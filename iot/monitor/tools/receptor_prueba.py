"""Receptor de prueba del contrato HTTP viejo. YA NO SE USA.

OJO: el monitor **no publica mas por HTTP**. Desde que se unifico con el resto
de SIAPPC manda los signos vitales por MQTT al broker
(`siappc/<dispositivo>/telemetry`, ver `net/publisher.py`), asi que este
servidor se queda esperando un POST que nunca llega.

Se conserva porque el contrato que entiende sigue documentado en JSON.md y es
lo unico que queda para inspeccionarlo, pero no sirve para probar el envio
real. Para ver lo que hoy sale del monitor, hay que suscribirse al broker:

    docker run --rm --network siappc_default \\
      -v "$PWD/infra/mosquitto/certs/ca.crt:/ca.crt:ro" \\
      eclipse-mosquitto:2 mosquitto_sub --cafile /ca.crt \\
      -h mosquitto -p 8883 -t 'siappc/#' -v -u siappc -P '...'

Lo que hacia, cuando el monitor hablaba HTTP: levantaba un servidor con la
libreria estandar (cero dependencias), aceptaba el POST, imprimia un resumen y
opcionalmente guardaba todo en un .jsonl.

    python tools/receptor_prueba.py --port 8000 --guardar datos.jsonl
"""

from __future__ import annotations

import argparse
import gzip
import json
import socket
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ARCHIVO = None
VERBOSE = False


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_POST(self) -> None:  # noqa: N802 (lo pide BaseHTTPRequestHandler)
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        if self.headers.get("Content-Encoding") == "gzip":
            body = gzip.decompress(body)

        try:
            payload = json.loads(body)
        except json.JSONDecodeError as exc:
            print(f"  !! JSON invalido: {exc}")
            self._reply(400, {"error": "json invalido"})
            return

        # Un error imprimiendo no tiene que parecer una caida de red: sin este
        # try, una excepcion aca cierra la conexion y el Pi reporta "sin
        # servidor" cuando en realidad el POST llego perfecto.
        try:
            self._describe(payload, len(body))
        except Exception as exc:
            print(f"  !! error mostrando el mensaje: {exc!r}", flush=True)

        if ARCHIVO is not None:
            for message in payload.get("messages", [payload]):
                ARCHIVO.write(json.dumps(message, ensure_ascii=False) + "\n")
            ARCHIVO.flush()

        self._reply(200, {"ok": True, "recibidos": len(payload.get("messages", []))})

    def do_GET(self) -> None:  # noqa: N802
        self._reply(200, {"ok": True, "servicio": "receptor de prueba"})

    def _reply(self, code: int, data: dict) -> None:
        body = json.dumps(data).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _describe(self, payload: dict, size: int) -> None:
        messages = payload.get("messages", [])
        stamp = time.strftime("%H:%M:%S")
        kinds: dict[str, int] = {}
        for message in messages:
            kinds[message.get("type", "?")] = kinds.get(message.get("type", "?"), 0) + 1
        resumen = " ".join(f"{k}x{v}" for k, v in sorted(kinds.items()))
        print(f"[{stamp}] {payload.get('device_id')}  {size/1024:6.1f} kB  {resumen}",
              flush=True)

        for message in messages:
            if message.get("type") == "vitals":
                # .get() en vez de [] a proposito: si el contrato agrega o
                # renombra un campo, el receptor tiene que seguir andando.
                v = message.get("vitals", {})
                alarmas = [a["code"] for a in message.get("alarms", [])]
                print(f"           FC {_f(v.get('hr_bpm'))}  "
                      f"SpO2 {_f(v.get('spo2_pct'))}  "
                      f"PR {_f(v.get('pr_bpm'))}  "
                      f"RESP ~{_f(v.get('resp_rpm_estimated'))}  "
                      f"PI {_f(v.get('perfusion_index'))}"
                      + (f"  ALARMAS: {', '.join(alarmas)}" if alarmas else ""),
                      flush=True)
            elif message.get("type") == "waveform" and VERBOSE:
                for wave in message.get("waveforms", []):
                    print(f"           onda {wave['name']:6s} "
                          f"{wave['n']:4d} muestras @ {wave['fs_hz']} Hz", flush=True)
            elif message.get("type") in ("session_start", "session_end", "event"):
                print(f"           {json.dumps(message, ensure_ascii=False)[:400]}",
                      flush=True)

    def log_message(self, *args) -> None:
        pass  # silenciamos el log por defecto, que es ruidoso


def _f(value) -> str:
    return "---" if value is None else str(value)


def ip_local() -> str:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


def main() -> None:
    global ARCHIVO, VERBOSE
    parser = argparse.ArgumentParser(description="Receptor de prueba del monitor")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--guardar", metavar="ARCHIVO.jsonl",
                        help="guarda cada mensaje en un archivo jsonl")
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="tambien muestra las ondas")
    args = parser.parse_args()

    VERBOSE = args.verbose
    if args.guardar:
        ARCHIVO = open(args.guardar, "a", encoding="utf-8")

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Escuchando en http://{ip_local()}:{args.port}/api/v1/ingest")
    print("AVISO: el monitor ya no publica por HTTP, sino por MQTT. Aca no va a")
    print("       llegar nada; ver el encabezado de este archivo.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nChau")
    finally:
        if ARCHIVO is not None:
            ARCHIVO.close()


if __name__ == "__main__":
    main()
