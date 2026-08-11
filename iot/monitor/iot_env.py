"""Puente hacia la configuracion compartida de `iot/src/config.py`.

Este modulo y `iot/src/` publican en el mismo broker, con las mismas
credenciales y contra el mismo backend. Por eso no hay una segunda copia de
esos valores aca: se leen del mismo sitio de siempre, `iot/.env` (o el
entorno), a traves del modulo que ya sabe hacerlo. Si manana cambia el host del
broker o donde vive la CA, se cambia en un solo lugar.

Se carga por ruta y con otro nombre de modulo a proposito: `monitor/` ya tiene
su propio `config.py` al frente de `sys.path`, asi que un `import config` desde
aca resolveria a ese y no al de `iot/src/`.

Lo que sale de aca es solo *donde* y *con que credenciales* se publica. Lo que
se publica y cada cuanto vive en `config.py` (seccion `backend`).
"""

from __future__ import annotations

import importlib.util
import os
import sys
from pathlib import Path
from typing import Any

_IOT_DIR = Path(__file__).resolve().parent.parent
_SHARED_CONFIG = _IOT_DIR / "src" / "config.py"


def _load_shared() -> Any:
    if not _SHARED_CONFIG.is_file():
        raise SystemExit(
            f"[config] no se encuentra {_SHARED_CONFIG}.\n"
            "        El monitor lee la configuracion del broker del mismo sitio que\n"
            "        `iot/src/main.py`, asi que tiene que quedarse dentro del repo,\n"
            "        junto a `iot/src/`. Si lo copiaste solo a la Pi, copia la\n"
            "        carpeta `iot/` entera."
        )

    spec = importlib.util.spec_from_file_location("siappc_iot_config", _SHARED_CONFIG)
    if spec is None or spec.loader is None:
        raise SystemExit(f"[config] no se pudo cargar {_SHARED_CONFIG}")

    module = importlib.util.module_from_spec(spec)
    # Registrarlo antes de ejecutarlo evita que se cargue dos veces (y que se
    # relea el .env) si algo mas lo pide.
    sys.modules["siappc_iot_config"] = module
    spec.loader.exec_module(module)
    return module


_shared = _load_shared()

# Codigo del dispositivo tal como esta dado de alta en la tabla `dispositivo`.
# Si el backend no lo encuentra ahi, descarta las lecturas por no saber de quien
# son (ver `ingestReading` en backend/src/services/mqttIngest.ts).
DEVICE_CODE: str = _shared.DEVICE_CODE

MQTT_HOST: str = _shared.MQTT_HOST
MQTT_PORT: int = _shared.MQTT_PORT
MQTT_USER: str | None = _shared.MQTT_USER
MQTT_PASSWORD: str | None = _shared.MQTT_PASSWORD
MQTT_TLS: bool = _shared.MQTT_TLS
MQTT_CA_FILE: str = _shared.MQTT_CA_FILE
MQTT_CLIENT_CERT_FILE: str | None = _shared.MQTT_CLIENT_CERT_FILE
MQTT_CLIENT_KEY_FILE: str | None = _shared.MQTT_CLIENT_KEY_FILE

PUBLISH_INTERVAL: float = _shared.PUBLISH_INTERVAL
BUFFER_MAX_ROWS: int = _shared.BUFFER_MAX_ROWS


def env_file_missing() -> bool:
    """Si no hay `iot/.env`, todo lo de arriba son valores por defecto.

    Se avisa en vez de intentarlo en silencio contra `localhost`: sin ese
    archivo no hay broker real al que llegar, y las lecturas se irian
    acumulando en la cola sin que nadie entienda por que.
    """
    return not (_IOT_DIR / ".env").is_file()


def telemetry_topic(device: str) -> str:
    return f"siappc/{device}/telemetry"


def status_topic(device: str) -> str:
    return f"siappc/{device}/status"


def monitor_buffer_path() -> str:
    """Cola local del monitor, aparte de la de `iot/src/`.

    Son dos procesos distintos: si compartieran archivo, uno borraria del buffer
    lecturas que el otro todavia no confirmo.
    """
    return os.environ.get("MONITOR_BUFFER_PATH", str(_IOT_DIR / "monitor-buffer.db"))


def load_buffer_class() -> type:
    """La cola en SQLite de `iot/src/buffer.py`, cargada igual que la config.

    Misma razon para cargarla por ruta: `monitor/` no tiene un `buffer` propio,
    pero `iot/src/` no es un paquete importable desde aca sin pisar nombres.
    """
    path = _IOT_DIR / "src" / "buffer.py"
    spec = importlib.util.spec_from_file_location("siappc_iot_buffer", path)
    if spec is None or spec.loader is None:
        raise SystemExit(f"[config] no se pudo cargar {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules["siappc_iot_buffer"] = module
    spec.loader.exec_module(module)
    return module.Buffer
