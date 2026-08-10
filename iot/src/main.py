"""Lectura de sensores y publicación por MQTT.

Publica métricas derivadas (HR, SpO2) y una muestra instantánea de ECG, una vez
por segundo. No publica la onda de ECG completa: eso son ~250 muestras por
segundo y no cabe en el modelo de una fila por lectura.

Uso:
    python3 src/main.py              # con sensores reales
    python3 src/main.py --simulate   # sin hardware, valores sintéticos
"""

import random
import signal
import sys
import time

sys.path.append("sensors")

import config
from buffer import Buffer
from publisher import Publisher, build_payload

# Cada variable es una fila de la tabla `sensor` en el backend.
UNITS = {"hr": "bpm", "spo2": "%", "ecg": "V"}

_running = True


def _stop(signum, frame):
    global _running
    _running = False


class RealSensors:
    def __init__(self):
        import board
        import busio
        import adafruit_ads1x15.ads1115 as ADS
        from adafruit_ads1x15.analog_in import AnalogIn
        import max30102

        self._hr_sensor = max30102.MAX30102(gpio_pin=17)
        i2c = busio.I2C(board.SCL, board.SDA)
        ads = ADS.ADS1115(i2c, address=0x48)
        self._ecg_chan = AnalogIn(ads, 0)

    def read(self) -> dict:
        import hrcalc

        # amount=25 para no bloquear ~4s por vuelta.
        red, ir = self._hr_sensor.read_sequential(amount=25)
        hr, hr_valid, spo2, spo2_valid = hrcalc.calc_hr_and_spo2(ir, red)

        return {
            "hr": float(hr) if hr_valid else None,
            "spo2": round(float(spo2), 2) if spo2_valid else None,
            "ecg": round(self._ecg_chan.voltage, 3),
        }

    def cleanup(self) -> None:
        import RPi.GPIO as GPIO

        GPIO.cleanup()


class SimulatedSensors:
    """Valores plausibles para probar la cadena completa sin Raspberry.

    Existe porque el resto del sistema (broker, ingesta, tablero) se desarrolla
    en una laptop donde no hay sensores conectados.
    """

    def read(self) -> dict:
        return {
            "hr": round(random.uniform(60, 110), 1),
            "spo2": round(random.uniform(88, 99), 1),
            "ecg": round(random.uniform(-0.5, 1.5), 3),
        }

    def cleanup(self) -> None:
        pass


def main() -> None:
    simulate = "--simulate" in sys.argv
    signal.signal(signal.SIGINT, _stop)
    signal.signal(signal.SIGTERM, _stop)

    sensors = SimulatedSensors() if simulate else RealSensors()
    buffer = Buffer(config.BUFFER_PATH, config.BUFFER_MAX_ROWS)
    publisher = Publisher(buffer)
    publisher.start()

    print(
        f"[main] dispositivo {config.DEVICE_CODE} "
        f"{'(simulado)' if simulate else ''} -> {config.MQTT_HOST}:{config.MQTT_PORT}"
    )
    if buffer.count():
        print(f"[main] {buffer.count()} lecturas pendientes de envío")

    try:
        while _running:
            started = time.time()
            try:
                readings = sensors.read()
            except OSError as err:
                # Fallo de I2C: se reintenta sin tumbar el proceso.
                print(f"[sensores] error de lectura, reintentando: {err}")
                time.sleep(0.5)
                continue

            timestamp = time.time()
            for variable, value in readings.items():
                # Un valor inválido (dedo fuera del sensor) no se publica: es
                # mejor un hueco en la serie que un cero que parece real.
                if value is None:
                    continue
                payload = build_payload(
                    config.DEVICE_CODE, timestamp, variable, value, UNITS[variable]
                )
                publisher.publish(payload, payload["hash"])

            elapsed = time.time() - started
            time.sleep(max(0.0, config.PUBLISH_INTERVAL - elapsed))
    finally:
        print("\n[main] deteniendo…")
        publisher.stop()
        pending = buffer.count()
        if pending:
            print(f"[main] quedan {pending} lecturas en el buffer, se enviarán al reiniciar")
        buffer.close()
        sensors.cleanup()


if __name__ == "__main__":
    main()
