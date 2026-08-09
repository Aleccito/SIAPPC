"""Cola local de lecturas pendientes.

La red del hospital se cae, el broker se reinicia, la Pi se queda sin wifi. Sin
esta cola esas lecturas se pierden para siempre: el script anterior solo las
imprimía. Aquí se guardan en SQLite y se reenvían cuando vuelve la conexión.
"""

import sqlite3
import time
from typing import Iterator

SCHEMA = """
CREATE TABLE IF NOT EXISTS pendiente (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  payload    TEXT NOT NULL,
  hash       TEXT NOT NULL UNIQUE,
  creado_en  REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_pendiente_creado ON pendiente (creado_en);
"""


class Buffer:
    def __init__(self, path: str, max_rows: int):
        self._max_rows = max_rows
        # check_same_thread=False: el callback de paho corre en su propio hilo.
        self._db = sqlite3.connect(path, check_same_thread=False)
        self._db.executescript(SCHEMA)
        self._db.commit()

    def add(self, payload: str, hash_: str) -> None:
        try:
            self._db.execute(
                "INSERT INTO pendiente (payload, hash, creado_en) VALUES (?, ?, ?)",
                (payload, hash_, time.time()),
            )
        except sqlite3.IntegrityError:
            # Mismo hash: la lectura ya estaba encolada. No es un error.
            return
        self._trim()
        self._db.commit()

    def _trim(self) -> None:
        """Descarta lo más viejo cuando la cola crece sin límite.

        Ante una desconexión larga preferimos perder las lecturas antiguas y
        conservar las recientes: son las que importan para el monitoreo.
        """
        self._db.execute(
            """
            DELETE FROM pendiente
            WHERE id NOT IN (
              SELECT id FROM pendiente ORDER BY id DESC LIMIT ?
            )
            """,
            (self._max_rows,),
        )

    def pending(self, limit: int = 200) -> Iterator[tuple[int, str]]:
        cursor = self._db.execute(
            "SELECT id, payload FROM pendiente ORDER BY id LIMIT ?", (limit,)
        )
        yield from cursor.fetchall()

    def drop(self, row_id: int) -> None:
        """Se llama solo cuando el broker confirmó la entrega (QoS 1)."""
        self._db.execute("DELETE FROM pendiente WHERE id = ?", (row_id,))
        self._db.commit()

    def count(self) -> int:
        return self._db.execute("SELECT COUNT(*) FROM pendiente").fetchone()[0]

    def close(self) -> None:
        self._db.close()
