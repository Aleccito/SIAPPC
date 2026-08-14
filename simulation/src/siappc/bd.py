"""Persistencia en MariaDB.

Modelo de datos en una frase: un *escenario* (una configuracion) tiene muchas
*corridas* (replicas); cada corrida tiene *pacientes*, *eventos*, *kpi* y
opcionalmente *series* temporales. Ademas, cada escenario guarda el inventario
de *parametros* con su fuente declarada.

La estructura es deliberadamente "larga y estrecha" (una fila por metrica en vez
de una columna por metrica). Asi se pueden agregar indicadores nuevos sin migrar
la base de datos, y las vistas de analisis hacen el pivote cuando hace falta.
"""

from __future__ import annotations

import os
import time
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    UniqueConstraint,
    create_engine,
    delete,
    insert,
    select,
    text,
)
from sqlalchemy.engine import Engine

URL_POR_DEFECTO = "mysql+pymysql://siappc:siappc@mariadb:3306/siappc?charset=utf8mb4"

metadata = MetaData()

# SQLite solo autoincrementa columnas INTEGER; MariaDB necesita BIGINT para
# las tablas grandes. Con esta variante el mismo esquema sirve en los dos, y
# las pruebas pueden correr sin levantar una base de datos.
PK_GRANDE = BigInteger().with_variant(Integer, "sqlite")

escenario = Table(
    "escenario",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("nombre", String(120), nullable=False),
    Column("descripcion", Text),
    Column("version_modelo", String(40)),
    Column("hash_config", String(32), nullable=False),
    Column("archivo_config", String(255)),
    Column("config_yaml", Text),
    Column("creado_en", DateTime, nullable=False),
    UniqueConstraint("nombre", name="uq_escenario_nombre"),
)

parametro = Table(
    "parametro",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("escenario_id", Integer, ForeignKey("escenario.id", ondelete="CASCADE"), nullable=False),
    Column("ruta", String(160), nullable=False),
    Column("valor_texto", String(120), nullable=False),
    Column("fuente", String(24), nullable=False),
    Column("nota", Text),
    Index("ix_parametro_escenario", "escenario_id"),
)

corrida = Table(
    "corrida",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("escenario_id", Integer, ForeignKey("escenario.id", ondelete="CASCADE"), nullable=False),
    Column("replica", Integer, nullable=False),
    Column("semilla", BigInteger, nullable=False),
    Column("horizonte_min", Float, nullable=False),
    Column("calentamiento_min", Float, nullable=False),
    Column("motor", String(40), nullable=False),
    Column("iniciada_en", DateTime, nullable=False),
    Column("segundos_computo", Float),
    UniqueConstraint("escenario_id", "replica", name="uq_corrida_escenario_replica"),
)

paciente = Table(
    "paciente",
    metadata,
    Column("id", PK_GRANDE, primary_key=True, autoincrement=True),
    Column("corrida_id", Integer, ForeignKey("corrida.id", ondelete="CASCADE"), nullable=False),
    Column("paciente_idx", Integer, nullable=False),
    Column("edad", Float),
    Column("glasgow", Integer),
    Column("estable", Boolean),
    Column("t_llegada", Float, nullable=False),
    Column("t_salida", Float),
    Column("tiempo_sistema_min", Float),
    Column("desenlace", String(24)),
    Column("ruta", Text),
    Index("ix_paciente_corrida", "corrida_id"),
)

evento = Table(
    "evento",
    metadata,
    Column("id", PK_GRANDE, primary_key=True, autoincrement=True),
    Column("corrida_id", Integer, ForeignKey("corrida.id", ondelete="CASCADE"), nullable=False),
    Column("paciente_idx", Integer, nullable=False),
    Column("secuencia", Integer, nullable=False),
    Column("actividad", String(48), nullable=False),
    Column("zona", String(40)),
    Column("t_solicitud", Float, nullable=False),
    Column("t_inicio", Float, nullable=False),
    Column("t_fin", Float, nullable=False),
    Column("espera_min", Float, nullable=False),
    Column("servicio_min", Float, nullable=False),
    Column("es_adquisicion", Boolean, nullable=False, default=False),
    Index("ix_evento_corrida", "corrida_id"),
    Index("ix_evento_zona", "corrida_id", "zona"),
    Index("ix_evento_actividad", "corrida_id", "actividad"),
)

ocupacion = Table(
    "ocupacion",
    metadata,
    Column("id", PK_GRANDE, primary_key=True, autoincrement=True),
    Column("corrida_id", Integer, ForeignKey("corrida.id", ondelete="CASCADE"), nullable=False),
    Column("paciente_idx", Integer, nullable=False),
    Column("zona", String(40), nullable=False),
    Column("t_solicitud", Float, nullable=False),
    Column("t_inicio", Float, nullable=False),
    Column("t_fin", Float, nullable=False),
    Column("espera_min", Float, nullable=False),
    Column("uso_min", Float, nullable=False),
    Index("ix_ocupacion_corrida", "corrida_id", "zona"),
)

kpi_corrida = Table(
    "kpi_corrida",
    metadata,
    Column("id", PK_GRANDE, primary_key=True, autoincrement=True),
    Column("corrida_id", Integer, ForeignKey("corrida.id", ondelete="CASCADE"), nullable=False),
    Column("metrica", String(48), nullable=False),
    Column("dimension", String(12), nullable=False),
    Column("entidad", String(48), nullable=False, default=""),
    Column("valor", Float, nullable=False),
    Column("unidad", String(16)),
    Index("ix_kpi_corrida", "corrida_id"),
    Index("ix_kpi_metrica", "metrica", "entidad"),
)

serie_zona = Table(
    "serie_zona",
    metadata,
    Column("id", PK_GRANDE, primary_key=True, autoincrement=True),
    Column("corrida_id", Integer, ForeignKey("corrida.id", ondelete="CASCADE"), nullable=False),
    Column("t_min", Float, nullable=False),
    Column("zona", String(40), nullable=False),
    Column("ocupados", Integer, nullable=False),
    Column("en_cola", Integer, nullable=False),
    Index("ix_serie_corrida", "corrida_id", "zona"),
)


# ----------------------------------------------------------------------
# conexion
# ----------------------------------------------------------------------
def url_bd(url: str | None = None) -> str:
    return url or os.environ.get("SIAPPC_BD_URL") or URL_POR_DEFECTO


def motor(url: str | None = None) -> Engine:
    return create_engine(url_bd(url), pool_pre_ping=True, future=True)


def esperar_bd(url: str | None = None, intentos: int = 30, pausa: float = 2.0) -> bool:
    """Espera a que la base de datos acepte conexiones (arranque en Docker)."""
    ultimo: Exception | None = None
    for intento in range(1, intentos + 1):
        try:
            eng = motor(url)
            with eng.connect() as con:
                con.execute(text("SELECT 1"))
            return True
        except Exception as exc:  # pragma: no cover - depende del entorno
            ultimo = exc
            time.sleep(pausa)
    raise RuntimeError(
        f"La base de datos no respondio tras {intentos} intentos: {ultimo}"
    )


def crear_esquema(eng: Engine) -> None:
    metadata.create_all(eng, checkfirst=True)


def ruta_vistas() -> Path | None:
    """Ubica db/vistas.sql tanto en desarrollo como dentro del contenedor."""
    candidatas = [
        Path(p)
        for p in (
            os.environ.get("SIAPPC_VISTAS"),
            Path(__file__).resolve().parents[2] / "db" / "vistas.sql",
            Path.cwd() / "db" / "vistas.sql",
        )
        if p
    ]
    for ruta in candidatas:
        if ruta.exists():
            return ruta
    return None


def dividir_sentencias(sql: str) -> list[str]:
    """Separa un script SQL en sentencias.

    No sirve partir por ';' a secas: los comentarios y los textos entre comillas
    pueden contener puntos y coma. Este separador ignora comentarios de linea
    (--), de bloque y cadenas entre comillas.
    """
    sentencias: list[str] = []
    actual: list[str] = []
    i = 0
    n = len(sql)
    comilla: str | None = None
    en_linea = False
    en_bloque = False

    while i < n:
        c = sql[i]
        siguiente = sql[i + 1] if i + 1 < n else ""

        if en_linea:
            actual.append(c)
            if c == "\n":
                en_linea = False
            i += 1
            continue
        if en_bloque:
            actual.append(c)
            if c == "*" and siguiente == "/":
                actual.append(siguiente)
                en_bloque = False
                i += 2
                continue
            i += 1
            continue
        if comilla:
            actual.append(c)
            if c == "\\":  # escape dentro de la cadena
                if siguiente:
                    actual.append(siguiente)
                    i += 2
                    continue
            elif c == comilla:
                comilla = None
            i += 1
            continue

        if c == "-" and siguiente == "-":
            en_linea = True
            actual.append(c)
            i += 1
            continue
        if c == "#":
            en_linea = True
            actual.append(c)
            i += 1
            continue
        if c == "/" and siguiente == "*":
            en_bloque = True
            actual.append(c)
            actual.append(siguiente)
            i += 2
            continue
        if c in ("'", '"', "`"):
            comilla = c
            actual.append(c)
            i += 1
            continue
        if c == ";":
            sentencias.append("".join(actual))
            actual = []
            i += 1
            continue

        actual.append(c)
        i += 1

    if actual:
        sentencias.append("".join(actual))

    # Se descartan los trozos que solo tienen comentarios o espacios.
    limpias: list[str] = []
    for s in sentencias:
        cuerpo = "\n".join(
            linea
            for linea in s.splitlines()
            if linea.strip() and not linea.strip().startswith(("--", "#"))
        )
        if cuerpo.strip():
            limpias.append(s.strip())
    return limpias


def crear_vistas(eng: Engine, archivo: str | Path | None = None) -> int:
    """Crea o reemplaza las vistas de analisis. Se salta en SQLite."""
    if eng.dialect.name not in ("mysql", "mariadb"):
        return 0
    ruta = Path(archivo) if archivo else ruta_vistas()
    if ruta is None or not ruta.exists():
        return 0
    sentencias = dividir_sentencias(ruta.read_text(encoding="utf-8"))
    with eng.begin() as con:
        for sentencia in sentencias:
            con.execute(text(sentencia))
    return len(sentencias)


# ----------------------------------------------------------------------
# escritura
# ----------------------------------------------------------------------
def _ahora() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)


def registrar_escenario(eng: Engine, cfg, etiqueta: str, reemplazar: bool = True) -> int:
    """Crea (o reemplaza) el escenario y su inventario de parametros."""
    with eng.begin() as con:
        fila = con.execute(
            select(escenario.c.id).where(escenario.c.nombre == etiqueta)
        ).fetchone()
        if fila and reemplazar:
            con.execute(delete(escenario).where(escenario.c.id == fila[0]))
            fila = None
        if fila:
            return int(fila[0])

        res = con.execute(
            insert(escenario).values(
                nombre=etiqueta,
                descripcion=cfg.descripcion or cfg.nombre,
                version_modelo=cfg.version_modelo,
                hash_config=cfg.hash_config,
                archivo_config=cfg.ruta_archivo,
                config_yaml=cfg.yaml_texto,
                creado_en=_ahora(),
            )
        )
        escenario_id = int(res.inserted_primary_key[0])
        filas = [
            {
                "escenario_id": escenario_id,
                "ruta": p.ruta,
                "valor_texto": p.valor_texto[:120],
                "fuente": p.fuente,
                "nota": p.nota,
            }
            for p in cfg.inventario.items
        ]
        if filas:
            con.execute(insert(parametro), filas)
        return escenario_id


def guardar_corrida(
    eng: Engine,
    escenario_id: int,
    cfg,
    reg,
    kpis,
    muestras,
    segundos: float,
    guardar_eventos: bool = True,
) -> int:
    """Escribe una replica completa. Devuelve el id de la corrida."""
    with eng.begin() as con:
        res = con.execute(
            insert(corrida).values(
                escenario_id=escenario_id,
                replica=reg.replica,
                semilla=reg.semilla,
                horizonte_min=cfg.simulacion.horizonte,
                calentamiento_min=cfg.simulacion.calentamiento,
                motor="simpy",
                iniciada_en=_ahora(),
                segundos_computo=round(segundos, 3),
            )
        )
        corrida_id = int(res.inserted_primary_key[0])

        if reg.pacientes:
            con.execute(
                insert(paciente),
                [
                    {
                        "corrida_id": corrida_id,
                        "paciente_idx": p.indice,
                        "edad": p.edad,
                        "glasgow": p.glasgow,
                        "estable": p.estable,
                        "t_llegada": round(p.t_llegada, 4),
                        "t_salida": None if p.t_salida is None else round(p.t_salida, 4),
                        "tiempo_sistema_min": (
                            None if p.tiempo_sistema is None else round(p.tiempo_sistema, 4)
                        ),
                        "desenlace": p.desenlace,
                        "ruta": p.ruta_texto[:2000],
                    }
                    for p in reg.pacientes
                ],
            )

        if guardar_eventos and reg.eventos:
            con.execute(
                insert(evento),
                [
                    {
                        "corrida_id": corrida_id,
                        "paciente_idx": e.paciente,
                        "secuencia": e.secuencia,
                        "actividad": e.actividad,
                        "zona": e.zona,
                        "t_solicitud": round(e.t_solicitud, 4),
                        "t_inicio": round(e.t_inicio, 4),
                        "t_fin": round(e.t_fin, 4),
                        "espera_min": round(e.espera, 4),
                        "servicio_min": round(e.servicio, 4),
                        "es_adquisicion": e.adquisicion,
                    }
                    for e in reg.eventos
                ],
            )

        if reg.ocupaciones:
            con.execute(
                insert(ocupacion),
                [
                    {
                        "corrida_id": corrida_id,
                        "paciente_idx": o.paciente,
                        "zona": o.zona,
                        "t_solicitud": round(o.t_solicitud, 4),
                        "t_inicio": round(o.t_inicio, 4),
                        "t_fin": round(o.t_fin, 4),
                        "espera_min": round(o.espera, 4),
                        "uso_min": round(o.uso, 4),
                    }
                    for o in reg.ocupaciones
                ],
            )

        if kpis:
            con.execute(
                insert(kpi_corrida),
                [
                    {
                        "corrida_id": corrida_id,
                        "metrica": k.metrica,
                        "dimension": k.dimension,
                        "entidad": k.entidad,
                        "valor": round(k.valor, 6),
                        "unidad": k.unidad,
                    }
                    for k in kpis
                ],
            )

        if muestras:
            con.execute(
                insert(serie_zona),
                [
                    {
                        "corrida_id": corrida_id,
                        "t_min": m.t,
                        "zona": m.zona,
                        "ocupados": m.ocupados,
                        "en_cola": m.en_cola,
                    }
                    for m in muestras
                ],
            )
        return corrida_id


def ddl_texto() -> str:
    """DDL de referencia en dialecto MariaDB (para documentar el esquema)."""
    from sqlalchemy.dialects import mysql
    from sqlalchemy.schema import CreateIndex, CreateTable

    partes: list[str] = []
    for tabla in metadata.sorted_tables:
        partes.append(str(CreateTable(tabla).compile(dialect=mysql.dialect())).strip() + ";")
        for indice in tabla.indexes:
            partes.append(str(CreateIndex(indice).compile(dialect=mysql.dialect())).strip() + ";")
    return "\n\n".join(partes)
