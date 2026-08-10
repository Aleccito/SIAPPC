"""Configuración por entorno.

Nada de credenciales en el código: la Pi lee un `.env` que no se commitea.
"""

import os
from pathlib import Path


def _load_env_file() -> None:
    """Carga `iot/.env` si existe.

    Se hace a mano en vez de con python-dotenv para no sumar una dependencia
    por veinte líneas.
    """
    path = Path(__file__).resolve().parent.parent / ".env"
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        # Lo que ya venga del entorno gana: permite sobreescribir sin editar
        # el archivo.
        os.environ.setdefault(key.strip(), value.strip())


_load_env_file()

# Código del dispositivo tal como está dado de alta en la tabla `dispositivo`.
DEVICE_CODE = os.environ.get("DEVICE_CODE", "RPI-01")

MQTT_HOST = os.environ.get("MQTT_HOST", "localhost")
# El broker solo escucha TLS: 8883, no 1883.
MQTT_PORT = int(os.environ.get("MQTT_PORT", "8883"))
MQTT_USER = os.environ.get("MQTT_USER") or None
MQTT_PASSWORD = os.environ.get("MQTT_PASSWORD") or None

# Solo para apuntar a un broker heredado sin TLS.
MQTT_TLS = os.environ.get("MQTT_TLS", "true").lower() not in ("false", "0", "no")

# CA que firma el certificado del broker. En desarrollo la emite
# `infra/mosquitto/gen-certs.sh` y hay que copiar el `ca.crt` resultante a la
# Pi; por defecto se busca en `iot/certs/ca.crt` (git-ignorado).
MQTT_CA_FILE = os.environ.get("MQTT_CA_FILE") or str(
    Path(__file__).resolve().parent.parent / "certs" / "ca.crt"
)

# Certificado de cliente: solo si el broker exige mTLS
# (require_certificate true). Los dos van juntos o ninguno.
MQTT_CLIENT_CERT_FILE = os.environ.get("MQTT_CLIENT_CERT_FILE") or None
MQTT_CLIENT_KEY_FILE = os.environ.get("MQTT_CLIENT_KEY_FILE") or None

TELEMETRY_TOPIC = f"siappc/{DEVICE_CODE}/telemetry"
STATUS_TOPIC = f"siappc/{DEVICE_CODE}/status"

# Segundos entre publicaciones. Las métricas derivadas no necesitan más
# resolución que esta, y una fila por segundo por variable es lo que la tabla
# `lectura` está pensada para aguantar.
PUBLISH_INTERVAL = float(os.environ.get("PUBLISH_INTERVAL", "1"))

BUFFER_PATH = os.environ.get(
    "BUFFER_PATH",
    str(Path(__file__).resolve().parent.parent / "buffer.db"),
)

# Cuántas lecturas guarda el buffer antes de tirar las más viejas. 86400 es
# aproximadamente un día a una lectura por segundo.
BUFFER_MAX_ROWS = int(os.environ.get("BUFFER_MAX_ROWS", "86400"))
