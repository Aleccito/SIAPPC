"""Publicacion de los signos vitales por MQTT hacia el backend de SIAPPC.

Antes esto armaba un sobre `monitor.v1` y lo mandaba por HTTP a
`POST /api/v1/ingest`. Ese endpoint no existe en el backend de SIAPPC: la
telemetria que llega a la base entra por MQTT, en `siappc/<dispositivo>/telemetry`,
y la consume `backend/src/services/mqttIngest.ts`. Asi que el monitor publica
por ahi, con el mismo contrato, el mismo broker y las mismas credenciales que
`iot/src/`. El contrato viejo quedo documentado en JSON.md, pero ya no es lo que
sale de este modulo.

Diseno (el mismo de antes, con otro transporte):

  * El bucle principal solo encola: escribe la lectura en SQLite y sigue. Nunca
    toca la red, asi que una WiFi lenta no baja los FPS del monitor.
  * Un hilo aparte vacia la cola contra el broker, y una lectura solo se borra
    cuando el broker confirma la entrega (PUBACK de QoS 1).
  * Si el broker no esta, las lecturas se acumulan en el buffer y salen al
    reconectar. El buffer tira las mas viejas antes que las recientes.

Lo que **no** se publica:

  * **Las ondas** (ECG, pleth, resp). El backend guarda una fila por lectura en
    la tabla `lectura`, y el ECG son ~250 muestras por segundo: no entra en ese
    modelo. Graficar la onda necesita su propia tabla y su propio tema MQTT.
    Mientras tanto las muestras se dibujan en pantalla y ahi se quedan. Es la
    misma limitacion que tiene `iot/src/main.py`, que manda una muestra
    instantanea de ECG y no la onda.
  * **Las alarmas, la calidad de senial y el diagnostico del equipo.** El
    payload es una lectura suelta y no tiene donde meterlos. Las alarmas
    clinicas las vuelve a evaluar el backend sobre `hr` y `spo2`
    (`evaluateAlert` en mqttIngest.ts); las de pantalla siguen sonando aca.
"""

from __future__ import annotations

import hashlib
import json
import ssl
import threading
import time
from dataclasses import dataclass
from pathlib import Path

import paho.mqtt.client as mqtt

import iot_env
from config import BackendConfig, Config

Buffer = iot_env.load_buffer_class()


# Que se publica de cada foto del estado: (variable, campo de vitals_json, unidad).
#
# `variable` es lo que el backend guarda en `sensor.variable_medida` y no es un
# enum cerrado, pero `hr` y `spo2` tienen que llamarse asi: son los nombres que
# ya usa `iot/src/main.py` y sobre los que mqttIngest.ts evalua las alertas.
#
# Se lee de `vitals_json()` y no de los atributos crudos para publicar
# exactamente los mismos numeros que muestra la pantalla, con el mismo redondeo.
VARIABLES = (
    ("hr", "hr_bpm", "bpm"),
    ("spo2", "spo2_pct", "%"),
    ("pr", "pr_bpm", "bpm"),
    ("perfusion", "perfusion_index", "%"),
    # OJO: estimada de como la respiracion mueve la linea de base del pleth, no
    # medida con un sensor de flujo ni de impedancia. En pantalla va rotulada
    # como ESTIMADA; aca no hay donde decirlo, asi que queda escrito en el
    # README y en JSON.md.
    ("resp", "resp_rpm_estimated", "rpm"),
)


def reading_hash(device: str, variable: str, timestamp: float, value: float) -> str:
    """Identidad de una lectura.

    Misma construccion que `iot/src/publisher.py:reading_hash`, a proposito: el
    backend tiene un indice unico sobre esta columna, asi que un reenvio tras
    una caida (o un duplicado de QoS 1) choca contra el indice y se descarta en
    vez de contarse dos veces. Si cambia alla, cambia aca.
    """
    raw = f"{device}|{variable}|{timestamp:.3f}|{value:.4f}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def build_payload(device: str, timestamp: float, variable: str, value: float, unit: str) -> dict:
    """La forma exacta que valida `telemetrySchema` en mqttIngest.ts."""
    return {
        "device": device,
        "variable": variable,
        "value": value,
        "unit": unit,
        "ts": timestamp,
        "hash": reading_hash(device, variable, timestamp, value),
    }


@dataclass
class PublisherStatus:
    enabled: bool = False
    connected: bool = False
    # Lecturas en la cola local esperando que el broker las confirme.
    pending_readings: int = 0
    sent_ok: int = 0
    failed: int = 0
    last_error: str | None = None
    last_success_t: float = 0.0


class Publisher:
    def __init__(self, cfg: Config):
        self.cfg: BackendConfig = cfg.backend
        self.full_cfg = cfg
        self.device = cfg.device.device_id
        self.telemetry_topic = iot_env.telemetry_topic(self.device)
        self.status_topic = iot_env.status_topic(self.device)
        self.status = PublisherStatus(enabled=self.cfg.enabled)

        self._buffer = None
        self._client: mqtt.Client | None = None
        # Protege el buffer: el bucle principal escribe y el hilo de red borra.
        self._lock = threading.Lock()
        self._wake = threading.Event()
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None
        self._last_vitals_at = 0.0

    @property
    def destination(self) -> str:
        """Para imprimirlo al arrancar, como antes se imprimia la URL."""
        scheme = "mqtts" if iot_env.MQTT_TLS else "mqtt"
        return f"{scheme}://{self.cfg.host}:{self.cfg.port}/{self.telemetry_topic}"

    # -- conexion ----------------------------------------------------------

    def _build_client(self) -> mqtt.Client:
        client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2,
            # Sufijo `-monitor`: `iot/src/` se conecta con el DEVICE_CODE pelado
            # y dos clientes con el mismo id se echan uno al otro del broker.
            client_id=f"{self.device}-monitor",
            # clean_session=False: el broker guarda los QoS 1 en vuelo si el Pi
            # se desconecta un momento.
            clean_session=False,
        )

        if iot_env.MQTT_USER:
            client.username_pw_set(iot_env.MQTT_USER, iot_env.MQTT_PASSWORD)

        if iot_env.MQTT_TLS:
            self._enable_tls(client)

        # Last Will: si el Pi desaparece sin avisar, el broker publica esto por
        # el y el tablero puede marcar el equipo como caido.
        client.will_set(self.status_topic, self._status_message("offline"), qos=1, retain=True)

        client.on_connect = self._on_connect
        client.on_disconnect = self._on_disconnect
        return client

    def _enable_tls(self, client: mqtt.Client) -> None:
        """Cifra la conexion y valida quien esta del otro lado.

        La CA se comprueba aca y no en `tls_set` para dar un mensaje claro: el
        error de paho cuando el archivo no existe no dice cual falta.
        """
        if not Path(iot_env.MQTT_CA_FILE).is_file():
            raise SystemExit(
                f"[mqtt] no se encuentra la CA del broker en {iot_env.MQTT_CA_FILE}.\n"
                "        Copiala desde infra/mosquitto/certs/ca.crt (la genera "
                "infra/mosquitto/gen-certs.sh) o apunta MQTT_CA_FILE al archivo correcto."
            )

        client.tls_set(
            ca_certs=iot_env.MQTT_CA_FILE,
            certfile=iot_env.MQTT_CLIENT_CERT_FILE,
            keyfile=iot_env.MQTT_CLIENT_KEY_FILE,
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLS_CLIENT,
        )
        # Nada de tls_insecure_set(True): el nombre del certificado tiene que
        # coincidir con el host. Si el broker se alcanza por IP, esa IP va como
        # SAN al emitir el certificado, no se desactiva la validacion.

    def _status_message(self, state: str) -> str:
        return json.dumps({"device": self.device, "status": state})

    def _on_connect(self, client, userdata, flags, reason_code, properties=None):
        if reason_code != 0:
            self.status.connected = False
            self.status.last_error = f"conexion rechazada: {reason_code}"
            print(f"[mqtt] conexion rechazada: {reason_code}")
            return

        self.status.connected = True
        self.status.last_error = None
        print(f"[mqtt] conectado a {self.destination}")
        client.publish(self.status_topic, self._status_message("online"), qos=1, retain=True)
        # El vaciado lo hace el hilo de red, no este callback: `wait_for_publish`
        # bloquearia el bucle interno de paho.
        self._wake.set()

    def _on_disconnect(self, client, userdata, flags, reason_code, properties=None):
        # paho reintenta solo mientras loop_start siga vivo; aca solo se deja
        # constancia para que la pantalla lo muestre.
        self.status.connected = False
        print(f"[mqtt] desconectado ({reason_code}), reintentando...")

    # -- ciclo de vida -----------------------------------------------------

    def start(self) -> None:
        if not self.cfg.enabled:
            return

        if iot_env.env_file_missing():
            print(
                "[mqtt] aviso: no hay iot/.env, asi que el broker, el usuario y la CA\n"
                "       son los valores por defecto. Copia iot/.env.example a iot/.env\n"
                "       (y el ca.crt a iot/certs/), o arranca con --no-backend si solo\n"
                "       queres la pantalla."
            )

        self._buffer = Buffer(self.cfg.buffer_path, self.cfg.buffer_max_rows)
        self.status.pending_readings = self._buffer.count()

        self._client = self._build_client()
        # connect_async + loop_start no bloquean: el monitor arranca aunque el
        # broker este caido, y las lecturas se van al buffer.
        self._client.connect_async(self.cfg.host, self.cfg.port, keepalive=30)
        self._client.loop_start()

        self._thread = threading.Thread(target=self._run, name="publisher-mqtt", daemon=True)
        self._thread.start()

    # Mas que los 5 s que puede tardar un `wait_for_publish`: si no, el join
    # vence justo mientras el hilo de red esta esperando el PUBACK del ultimo
    # mensaje.
    def stop(self, timeout: float = 6.0) -> None:
        if not self.cfg.enabled or self._client is None:
            return

        self._stop.set()
        self._wake.set()
        if self._thread is not None:
            self._thread.join(timeout=timeout)

        # El tema de estado no toca el buffer, asi que se publica siempre: es
        # como el tablero se entera de que este equipo se apago a proposito.
        if self._client.is_connected():
            info = self._client.publish(
                self.status_topic, self._status_message("offline"), qos=1, retain=True
            )
            try:
                info.wait_for_publish(timeout=2)
            except (ValueError, RuntimeError):
                pass

        # El buffer solo se toca si el hilo de red ya termino. Si sigue vivo lo
        # esta usando, y vaciarlo o cerrarlo desde aca seria publicar dos veces
        # lo mismo y dejarle la base cerrada en la mano.
        worker_alive = self._thread is not None and self._thread.is_alive()
        if not worker_alive:
            if self._client.is_connected():
                # Un ultimo intento con lo que quede en la cola. Lo que no salga
                # ahora sigue en el buffer para el proximo arranque.
                self._flush()
            with self._lock:
                self._buffer.close()
        else:
            print("[mqtt] el hilo de envio sigue ocupado, la cola queda para el proximo arranque")

        self._client.loop_stop()
        self._client.disconnect()

    # -- entrada de datos --------------------------------------------------

    def tick(self, snapshot) -> None:
        """Llamar una vez por frame: encola los signos vitales cuando toca.

        No recibe el gestor de alarmas: en este transporte no hay donde mandarlas
        (ver la nota del encabezado).
        """
        if not self.cfg.enabled:
            return

        now = time.monotonic()
        if now - self._last_vitals_at < self.cfg.vitals_interval_s:
            return
        self._last_vitals_at = now
        self._enqueue_vitals(snapshot)

    def _enqueue_vitals(self, snapshot) -> None:
        vitals = snapshot.vitals_json()
        # Un solo timestamp para toda la tanda: las cinco variables son la misma
        # foto del paciente, no cinco momentos distintos.
        timestamp = time.time()

        with self._lock:
            for variable, key, unit in VARIABLES:
                value = vitals.get(key)
                # Lo que todavia no se puede medir (el dedo fuera del sensor, el
                # detector de QRS asentandose) no se publica: un hueco en la
                # serie es mas honesto que un cero que parece una medicion.
                if value is None:
                    continue
                payload = build_payload(self.device, timestamp, variable, float(value), unit)
                self._buffer.add(json.dumps(payload), payload["hash"])
            self.status.pending_readings = self._buffer.count()

        self._wake.set()

    # -- envio -------------------------------------------------------------

    def _run(self) -> None:
        while not self._stop.is_set():
            # Con timeout y no solo por evento: si el broker vuelve mientras no
            # hay lecturas nuevas, igual se vacia la cola.
            self._wake.wait(timeout=1.0)
            self._wake.clear()
            if self._client is not None and self._client.is_connected():
                self._flush()

    def _flush(self) -> None:
        with self._lock:
            pending = list(self._buffer.pending())

        for row_id, payload in pending:
            info = self._client.publish(self.telemetry_topic, payload, qos=self.cfg.qos)
            # wait_for_publish confirma el PUBACK del broker. Sin esto se
            # borraria del buffer algo que quiza nunca llego.
            try:
                info.wait_for_publish(timeout=5)
            except (ValueError, RuntimeError) as exc:
                self._note_failure(_short(exc))
                return
            if not info.is_published():
                self._note_failure("el broker no confirmo la entrega")
                return

            with self._lock:
                self._buffer.drop(row_id)
                self.status.pending_readings = self._buffer.count()
            self.status.sent_ok += 1
            self.status.last_success_t = time.time()
            self.status.last_error = None

    def _note_failure(self, message: str) -> None:
        self.status.failed += 1
        self.status.last_error = message


def _short(exc: Exception) -> str:
    text = str(exc) or exc.__class__.__name__
    return text[:110]
