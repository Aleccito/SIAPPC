"""Publicador MQTT con reintento y vaciado del buffer al reconectar."""

import hashlib
import json
import ssl
import threading
import time
from pathlib import Path

import paho.mqtt.client as mqtt

import config
from buffer import Buffer


def reading_hash(device: str, variable: str, timestamp: float, value: float) -> str:
    """Identidad de una lectura.

    El backend tiene un índice único sobre esta columna, así que un reenvío
    tras una caída (o un duplicado de QoS 1) choca contra el índice y se
    descarta en vez de contarse dos veces.
    """
    raw = f"{device}|{variable}|{timestamp:.3f}|{value:.4f}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


class Publisher:
    def __init__(self, buffer: Buffer):
        self._buffer = buffer
        self._lock = threading.Lock()
        self._client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2,
            client_id=config.DEVICE_CODE,
            # clean_session=False: el broker guarda la suscripción y los
            # mensajes QoS 1 en vuelo si la Pi se desconecta un momento.
            clean_session=False,
        )

        if config.MQTT_USER:
            self._client.username_pw_set(config.MQTT_USER, config.MQTT_PASSWORD)

        if config.MQTT_TLS:
            self._enable_tls()

        # Last Will: si la Pi desaparece sin avisar, el broker publica esto por
        # ella y el tablero puede marcar el dispositivo como caído.
        self._client.will_set(
            config.STATUS_TOPIC,
            json.dumps({"device": config.DEVICE_CODE, "status": "offline"}),
            qos=1,
            retain=True,
        )

        self._client.on_connect = self._on_connect
        self._client.on_disconnect = self._on_disconnect

    def _enable_tls(self) -> None:
        """Cifra la conexión y valida quién está al otro lado.

        La CA se comprueba aquí y no en `tls_set` para dar un mensaje claro:
        el error de paho cuando el archivo no existe no dice cuál falta.
        """
        if not Path(config.MQTT_CA_FILE).is_file():
            raise SystemExit(
                f"[mqtt] no se encuentra la CA del broker en {config.MQTT_CA_FILE}.\n"
                "        Cópiala desde infra/mosquitto/certs/ca.crt (la genera "
                "infra/mosquitto/gen-certs.sh) o apunta MQTT_CA_FILE al archivo correcto."
            )

        self._client.tls_set(
            ca_certs=config.MQTT_CA_FILE,
            certfile=config.MQTT_CLIENT_CERT_FILE,
            keyfile=config.MQTT_CLIENT_KEY_FILE,
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLS_CLIENT,
        )
        # Nada de tls_insecure_set(True): el nombre del certificado tiene que
        # coincidir con MQTT_HOST. Si el broker se alcanza por una IP, esa IP
        # va como SAN al emitir el certificado, no se desactiva la validación.

    def start(self) -> None:
        # connect_async + loop_start no bloquean: la lectura de sensores sigue
        # aunque el broker esté caído, y las lecturas se van al buffer.
        self._client.connect_async(config.MQTT_HOST, config.MQTT_PORT, keepalive=30)
        self._client.loop_start()

    def stop(self) -> None:
        self._client.publish(
            config.STATUS_TOPIC,
            json.dumps({"device": config.DEVICE_CODE, "status": "offline"}),
            qos=1,
            retain=True,
        )
        self._client.loop_stop()
        self._client.disconnect()

    def _on_connect(self, client, userdata, flags, reason_code, properties=None):
        if reason_code != 0:
            print(f"[mqtt] conexión rechazada: {reason_code}")
            return

        scheme = "mqtts" if config.MQTT_TLS else "mqtt"
        print(f"[mqtt] conectado a {scheme}://{config.MQTT_HOST}:{config.MQTT_PORT}")
        client.publish(
            config.STATUS_TOPIC,
            json.dumps({"device": config.DEVICE_CODE, "status": "online"}),
            qos=1,
            retain=True,
        )
        self._flush()

    def _on_disconnect(self, client, userdata, flags, reason_code, properties=None):
        # paho reintenta solo mientras loop_start siga vivo; aquí únicamente se
        # deja constancia.
        print(f"[mqtt] desconectado ({reason_code}), reintentando…")

    def publish(self, payload: dict, hash_: str) -> None:
        """Encola siempre, publica si se puede.

        El buffer es la fuente de verdad: una lectura solo se borra cuando el
        broker confirma la entrega.
        """
        self._buffer.add(json.dumps(payload), hash_)
        if self._client.is_connected():
            self._flush()

    def _flush(self) -> None:
        # Un solo hilo vaciando la cola: on_connect y el bucle de lectura
        # pueden entrar a la vez.
        if not self._lock.acquire(blocking=False):
            return
        try:
            for row_id, payload in self._buffer.pending():
                info = self._client.publish(config.TELEMETRY_TOPIC, payload, qos=1)
                # wait_for_publish confirma el PUBACK del broker. Sin esto se
                # borraría del buffer algo que quizá nunca llegó.
                try:
                    info.wait_for_publish(timeout=5)
                except (ValueError, RuntimeError):
                    return
                if info.is_published():
                    self._buffer.drop(row_id)
                else:
                    return
        finally:
            self._lock.release()


def build_payload(device: str, timestamp: float, variable: str, value: float, unit: str) -> dict:
    return {
        "device": device,
        "variable": variable,
        "value": value,
        "unit": unit,
        "ts": timestamp,
        "hash": reading_hash(device, variable, timestamp, value),
    }


def now() -> float:
    return time.time()
