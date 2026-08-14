"""Exportacion a CSV.

Existe por dos razones practicas: para poder trabajar sin base de datos (por
ejemplo en una maquina donde no se puede levantar Docker) y para llevar los
resultados a Excel o a R sin pasar por SQL.
"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Iterable, Sequence

from sqlalchemy import text
from sqlalchemy.engine import Engine

VISTAS_EXPORTABLES = (
    "v_resumen_escenario",
    "v_cuellos_botella",
    "v_zonas",
    "v_actividades",
    "v_kpi_escenario",
    "v_parametros_fuente",
    "v_parametros",
)


def _abrir(ruta: Path, encabezados: Sequence[str]):
    nuevo = not ruta.exists()
    ruta.parent.mkdir(parents=True, exist_ok=True)
    fichero = ruta.open("a", newline="", encoding="utf-8")
    escritor = csv.writer(fichero)
    if nuevo:
        escritor.writerow(encabezados)
    return fichero, escritor


def escribir(ruta: Path, encabezados: Sequence[str], filas: Iterable[Sequence]) -> int:
    fichero, escritor = _abrir(ruta, encabezados)
    n = 0
    try:
        for fila in filas:
            escritor.writerow(fila)
            n += 1
    finally:
        fichero.close()
    return n


def exportar_replica(carpeta: str | Path, etiqueta: str, cfg, reg, kpis, muestras) -> None:
    """Anade una replica a los CSV acumulados del escenario."""
    base = Path(carpeta) / etiqueta

    escribir(
        base / "pacientes.csv",
        [
            "replica",
            "paciente",
            "edad",
            "glasgow",
            "estable",
            "t_llegada",
            "t_salida",
            "tiempo_sistema_min",
            "desenlace",
            "ruta",
        ],
        (
            [
                reg.replica,
                p.indice,
                p.edad,
                p.glasgow,
                int(p.estable),
                round(p.t_llegada, 3),
                "" if p.t_salida is None else round(p.t_salida, 3),
                "" if p.tiempo_sistema is None else round(p.tiempo_sistema, 3),
                p.desenlace or "",
                p.ruta_texto,
            ]
            for p in reg.pacientes
        ),
    )

    escribir(
        base / "eventos.csv",
        [
            "replica",
            "paciente",
            "secuencia",
            "actividad",
            "zona",
            "t_solicitud",
            "t_inicio",
            "t_fin",
            "espera_min",
            "servicio_min",
            "es_adquisicion",
        ],
        (
            [
                reg.replica,
                e.paciente,
                e.secuencia,
                e.actividad,
                e.zona or "",
                round(e.t_solicitud, 3),
                round(e.t_inicio, 3),
                round(e.t_fin, 3),
                round(e.espera, 3),
                round(e.servicio, 3),
                int(e.adquisicion),
            ]
            for e in reg.eventos
        ),
    )

    escribir(
        base / "ocupaciones.csv",
        ["replica", "paciente", "zona", "t_solicitud", "t_inicio", "t_fin", "espera_min", "uso_min"],
        (
            [
                reg.replica,
                o.paciente,
                o.zona,
                round(o.t_solicitud, 3),
                round(o.t_inicio, 3),
                round(o.t_fin, 3),
                round(o.espera, 3),
                round(o.uso, 3),
            ]
            for o in reg.ocupaciones
        ),
    )

    escribir(
        base / "kpi.csv",
        ["replica", "metrica", "dimension", "entidad", "valor", "unidad"],
        (
            [reg.replica, k.metrica, k.dimension, k.entidad, round(k.valor, 6), k.unidad]
            for k in kpis
        ),
    )

    if muestras:
        escribir(
            base / "series.csv",
            ["replica", "t_min", "zona", "ocupados", "en_cola"],
            ([reg.replica, m.t, m.zona, m.ocupados, m.en_cola] for m in muestras),
        )


def exportar_parametros(carpeta: str | Path, etiqueta: str, cfg) -> None:
    base = Path(carpeta) / etiqueta / "parametros.csv"
    if base.exists():
        base.unlink()
    escribir(
        base,
        ["ruta", "valor", "fuente", "nota"],
        ([p.ruta, p.valor_texto, p.fuente, p.nota] for p in cfg.inventario.items),
    )


def exportar_vistas(eng: Engine, carpeta: str | Path, vistas: Sequence[str] | None = None) -> list[str]:
    """Vuelca las vistas de analisis de la base de datos a archivos CSV."""
    destino = Path(carpeta)
    destino.mkdir(parents=True, exist_ok=True)
    hechas: list[str] = []
    with eng.connect() as con:
        for vista in vistas or VISTAS_EXPORTABLES:
            try:
                resultado = con.execute(text(f"SELECT * FROM {vista}"))
            except Exception:
                continue
            ruta = destino / f"{vista}.csv"
            if ruta.exists():
                ruta.unlink()
            escribir(ruta, list(resultado.keys()), (list(f) for f in resultado.fetchall()))
            hechas.append(vista)
    return hechas
