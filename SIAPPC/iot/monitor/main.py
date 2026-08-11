"""Monitor de signos vitales para Raspberry Pi.

    MAX30102 (SpO2/pulso) + AD8232 (ECG) -> ADS1115 -> Raspberry Pi
        -> pantalla estilo monitor de cabecera (pygame)
        -> signos vitales por MQTT (TLS) al backend de SIAPPC

Uso tipico:
    python main.py                          # con hardware
    python main.py --demo --windowed        # para probar en la PC
    python main.py --mqtt 192.168.0.50      # apuntando a otro broker
    python main.py --save-config config.json    # escribe la config por defecto

AVISO: esto no es un equipo medico ni esta certificado. Sirve para aprender,
prototipar y ver tendencias, no para diagnosticar ni para tomar decisiones
clinicas sobre una persona.
"""

from __future__ import annotations

import argparse
import os
import sys
import time

# Permite ejecutar el archivo directamente desde cualquier carpeta
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pygame

from alarms import AlarmManager
from config import Config
from net import Publisher
from processing import EcgProcessor, PpgProcessor
from sensors import AcquisitionManager
from state import VitalsSnapshot
from ui import MonitorUI
from ui.sound import SoundEngine


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Monitor de signos vitales (RPi)")
    parser.add_argument("--config", help="archivo JSON de configuracion")
    parser.add_argument("--save-config", metavar="RUTA",
                        help="escribe la configuracion actual y sale")
    parser.add_argument("--demo", action="store_true",
                        help="seniales simuladas, sin hardware")
    parser.add_argument("--windowed", action="store_true",
                        help="en ventana en vez de pantalla completa")
    parser.add_argument("--mqtt", metavar="HOST[:PUERTO]",
                        help="broker MQTT (por defecto, el de iot/.env)")
    parser.add_argument("--device", metavar="CODIGO",
                        help="codigo del dispositivo, tal como esta en la tabla `dispositivo`")
    parser.add_argument("--no-backend", action="store_true",
                        help="no manda nada por red")
    parser.add_argument("--no-sound", action="store_true")
    parser.add_argument("--notch", type=float, metavar="HZ",
                        help="frecuencia de red para el notch (50 o 60)")
    parser.add_argument("--captura", metavar="ARCHIVO.png",
                        help="guarda una captura de pantalla y sale (para el informe)")
    parser.add_argument("--segundos", type=float, default=12.0,
                        help="cuanto esperar antes de la captura (default 12)")
    return parser.parse_args()


def build_config(args: argparse.Namespace) -> Config:
    cfg = Config.load(args.config)
    if args.demo:
        cfg.demo = True
    if args.windowed:
        cfg.ui.fullscreen = False
    if args.mqtt:
        host, _, port = args.mqtt.partition(":")
        cfg.backend.host = host
        if port:
            cfg.backend.port = int(port)
        cfg.backend.enabled = True
    if args.device:
        cfg.device.device_id = args.device
    if args.no_backend:
        cfg.backend.enabled = False
    if args.no_sound:
        cfg.ui.sound_enabled = False
    if args.notch:
        cfg.ecg.notch_hz = args.notch
    return cfg


def main() -> int:
    args = parse_args()
    cfg = build_config(args)

    if args.save_config:
        cfg.save(args.save_config)
        print(f"Configuracion escrita en {args.save_config}")
        return 0

    pygame.init()
    sound = SoundEngine(enabled=cfg.ui.sound_enabled)
    alarms = AlarmManager(cfg.alarms)
    ui = MonitorUI(cfg, alarms, sound)

    # -- adquisicion -------------------------------------------------------
    acquisition = AcquisitionManager(cfg)
    acquisition.start()
    ui.demo_source = acquisition
    for message in acquisition.errors:
        print(f"[aviso] {message}")

    ecg_fs = cfg.ecg.sample_rate_hz
    ppg_fs = acquisition.ppg.fs
    volts_per_count = cfg.ecg.pga_volts / 32768.0
    # Cuentas del ADS -> mV en el electrodo (dividiendo por la ganancia del AD8232).
    # Es una conversion nominal: la ganancia real del modulo no esta calibrada.
    counts_to_mv = volts_per_count * 1000.0 / cfg.ecg.frontend_gain

    ecg_proc = EcgProcessor(
        fs=ecg_fs,
        highpass_hz=cfg.ecg.highpass_hz,
        lowpass_hz=cfg.ecg.lowpass_hz,
        notch_hz=cfg.ecg.notch_hz,
        notch_q=cfg.ecg.notch_q,
        counts_to_mv=counts_to_mv,
        volts_per_count=volts_per_count,
        supply_volts=cfg.ecg.supply_volts,
    )
    ppg_proc = PpgProcessor(
        fs=ppg_fs,
        highpass_hz=cfg.ppg.highpass_hz,
        lowpass_hz=cfg.ppg.lowpass_hz,
        spo2_window_s=cfg.ppg.spo2_window_s,
        finger_threshold=cfg.ppg.finger_threshold,
        resp_fs=cfg.resp.fs_hz,
        resp_low_hz=cfg.resp.highpass_hz,
        resp_high_hz=cfg.resp.lowpass_hz,
    )

    # -- red ---------------------------------------------------------------
    #
    # Solo salen los signos vitales, uno por mensaje MQTT. Las ondas (ECG,
    # pleth, resp) se dibujan y no se publican: el backend guarda una fila por
    # lectura y el ECG son ~250 muestras por segundo. Ver la nota del
    # encabezado de net/publisher.py.
    publisher = Publisher(cfg)
    publisher.start()

    if cfg.backend.enabled:
        print(f"[red] publicando en {publisher.destination}")
    else:
        print("[red] envio deshabilitado")

    started_at = time.time()
    snapshot = VitalsSnapshot()
    last_temp = None

    try:
        while ui.handle_events():
            # ---- ECG ----
            for chunk in acquisition.drain_ecg():
                leads_off = chunk.lo_plus or chunk.lo_minus
                ecg_proc.set_leads_off(leads_off)
                ui.set_leads_off(leads_off)
                snapshot.ecg_lo_plus = chunk.lo_plus
                snapshot.ecg_lo_minus = chunk.lo_minus
                snapshot.ecg_leads_off = leads_off

                millivolts, beats = ecg_proc.process(chunk.values)
                ui.push_ecg(millivolts)
                for _ in range(beats):
                    ui.on_beat(ppg_proc.spo2)

            # ---- PPG ----
            for chunk in acquisition.drain_ppg():
                pleth, resp, pulses = ppg_proc.process(chunk.red, chunk.ir)
                ui.push_pleth(pleth)
                ui.push_resp(resp)
                if pulses:
                    ui.on_pulse()
                ui.set_finger_off(not ppg_proc.finger_detected)

            ecg_proc.tick()
            ppg_proc.tick()
            if acquisition.ppg.die_temp_c is not None:
                last_temp = acquisition.ppg.die_temp_c

            # ---- estado ----
            snapshot.hr_bpm = ecg_proc.hr_bpm
            snapshot.pr_bpm = ppg_proc.pr_bpm
            snapshot.spo2_pct = ppg_proc.spo2
            snapshot.perfusion_index = ppg_proc.perfusion_index
            snapshot.resp_rpm = ppg_proc.resp_rpm
            snapshot.rr_last_ms = ecg_proc.last_rr_ms
            snapshot.hrv_rmssd_ms = ecg_proc.rmssd_ms
            snapshot.ecg_noise = ecg_proc.noise_level
            snapshot.ecg_saturated = ecg_proc.saturated
            snapshot.finger_detected = ppg_proc.finger_detected
            # Diagnostico del equipo, no del paciente
            snapshot.sensor_die_temp_c = last_temp
            snapshot.ecg_baseline_v = ecg_proc.baseline_v
            snapshot.ir_dc = ppg_proc.ir_dc_value or None
            snapshot.red_dc = ppg_proc.red_dc_value or None
            snapshot.ecg_active = acquisition.ecg_ready
            snapshot.ppg_active = acquisition.ppg_ready
            snapshot.seconds_since_beat = ecg_proc.seconds_since_beat()
            snapshot.backend_enabled = cfg.backend.enabled
            snapshot.backend_ok = publisher.status.connected
            snapshot.backend_pending = publisher.status.pending_readings
            snapshot.uptime_s = time.time() - started_at
            snapshot.ts = time.time()

            alarms.evaluate(snapshot)
            if alarms.should_sound():
                sound.alarm(alarms.highest_level)

            publisher.tick(snapshot)
            ui.render(snapshot)

            if args.captura and snapshot.uptime_s >= args.segundos:
                pygame.image.save(ui.screen, args.captura)
                print(f"Captura guardada en {args.captura}")
                break

    except KeyboardInterrupt:
        pass
    finally:
        print("\nCerrando...")
        # stop() vacia lo que quede en la cola y deja el tema de estado en
        # "offline" (retenido), que es como el tablero se entera de que este
        # equipo se apago a proposito.
        publisher.stop()
        acquisition.stop()
        ui.close()
        sound.close()
        pygame.quit()

    status = publisher.status
    if cfg.backend.enabled:
        print(f"[red] lecturas confirmadas: {status.sent_ok}  fallos de envio: {status.failed}  "
              f"en cola: {status.pending_readings}")
        if status.last_error:
            print(f"[red] ultimo error: {status.last_error}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
