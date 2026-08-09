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
MQTT_PORT = int(os.environ.get("MQTT_PORT", "1883"))
MQTT_USER = os.environ.get("MQTT_USER") or None
MQTT_PASSWORD = os.environ.get("MQTT_PASSWORD") or None

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
