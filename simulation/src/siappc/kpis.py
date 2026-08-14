"""Calculo de indicadores a partir de la bitacora de eventos.

Todo lo que aparece aqui se deriva de tres numeros por evento: cuando se pidio
la zona, cuando empezo la atencion y cuando termino. Ningun indicador se
"acumula" dentro del motor de simulacion, de modo que cualquiera puede
recalcularlos desde la tabla `evento` en SQL y comprobar que coinciden.

Definiciones que conviene tener claras al defender el modelo:

* utilizacion de una zona = tiempo-zona ocupado / (capacidad x ventana). Es el
  porcentaje del recurso que estuvo trabajando, no el porcentaje del tiempo en
  que hubo al menos un paciente.
* cola media = suma de esperas / ventana. Es el numero promedio de pacientes
  esperando, y sale de la ley de Little aplicada a la cola.
* ventana = horizonte - calentamiento. Todo se recorta a esa ventana: un
  paciente que entro a UCI antes del calentamiento solo aporta la parte de su
  estancia que cae dentro.
"""

from __future__ import annotations

from dataclasses import dataclass

from .config import ACTIVIDADES, Config
from .registro import Registro

MINUTOS_POR_DIA = 1440.0


@dataclass(frozen=True)
class Kpi:
    metrica: str
    dimension: str  # global | zona | actividad
    entidad: str
    valor: float
    unidad: str


@dataclass(frozen=True)
class MuestraSerie:
    t: float
    zona: str
    ocupados: int
    en_cola: int


# ----------------------------------------------------------------------
# utilidades numericas (sin dependencias externas, para que sean auditables)
# ----------------------------------------------------------------------
def percentil(datos: list[float], q: float) -> float:
    """Percentil con interpolacion lineal. q entre 0 y 100."""
    if not datos:
        return 0.0
    ordenados = sorted(datos)
    if len(ordenados) == 1:
        return ordenados[0]
    pos = (len(ordenados) - 1) * (q / 100.0)
    bajo = int(pos)
    alto = min(bajo + 1, len(ordenados) - 1)
    peso = pos - bajo
    return ordenados[bajo] * (1 - peso) + ordenados[alto] * peso


def media(datos: list[float]) -> float:
    return sum(datos) / len(datos) if datos else 0.0


def solape(inicio: float, fin: float, v0: float, v1: float) -> float:
    """Minutos del intervalo [inicio, fin) que caen dentro de la ventana."""
    return max(0.0, min(fin, v1) - max(inicio, v0))


def max_simultaneos(intervalos: list[tuple[float, float]], v0: float, v1: float) -> int:
    """Maximo numero de intervalos solapados dentro de la ventana (barrido)."""
    deltas: list[tuple[float, int]] = []
    for ini, fin in intervalos:
        if solape(ini, fin, v0, v1) <= 0:
            continue
        deltas.append((max(ini, v0), 1))
        deltas.append((min(fin, v1), -1))
    if not deltas:
        return 0
    # Las salidas se procesan antes que las entradas en el mismo instante.
    deltas.sort(key=lambda d: (d[0], d[1]))
    actual = maximo = 0
    for _, cambio in deltas:
        actual += cambio
        maximo = max(maximo, actual)
    return maximo


def serie_conteo(
    intervalos: list[tuple[float, float]], t0: float, t1: float, paso: float
) -> list[tuple[float, int]]:
    """Numero de intervalos activos en t0, t0+paso, t0+2*paso, ... hasta t1."""
    if paso <= 0:
        return []
    deltas: list[tuple[float, int]] = []
    for ini, fin in intervalos:
        if fin <= t0 or ini >= t1:
            continue
        deltas.append((ini, 1))
        deltas.append((fin, -1))
    deltas.sort()
    salida: list[tuple[float, int]] = []
    i = 0
    actual = 0
    t = t0
    while t <= t1:
        while i < len(deltas) and deltas[i][0] <= t:
            actual += deltas[i][1]
            i += 1
        salida.append((t, actual))
        t += paso
    return salida


# ----------------------------------------------------------------------
# calculo principal
# ----------------------------------------------------------------------
def calcular(cfg: Config, reg: Registro) -> list[Kpi]:
    v0 = cfg.simulacion.calentamiento
    v1 = cfg.simulacion.horizonte
    ventana = v1 - v0
    dias = ventana / MINUTOS_POR_DIA
    kpis: list[Kpi] = []

    def g(metrica: str, valor: float, unidad: str) -> None:
        kpis.append(Kpi(metrica, "global", "", float(valor), unidad))

    # --- pacientes ----------------------------------------------------
    en_ventana = [p for p in reg.pacientes if p.t_llegada >= v0]
    terminados = [p for p in en_ventana if p.t_salida is not None]
    tiempos = [p.tiempo_sistema for p in terminados if p.tiempo_sistema is not None]

    g("pacientes_llegados", len(en_ventana), "pacientes")
    g("pacientes_atendidos", len(terminados), "pacientes")
    g(
        "pacientes_en_sistema_final",
        sum(1 for p in reg.pacientes if p.t_salida is None),
        "pacientes",
    )
    g("throughput_dia", len(terminados) / dias if dias else 0.0, "pacientes/dia")
    g("tiempo_sistema_medio", media(tiempos), "min")
    g("tiempo_sistema_p50", percentil(tiempos, 50), "min")
    g("tiempo_sistema_p95", percentil(tiempos, 95), "min")
    g("tiempo_sistema_max", max(tiempos) if tiempos else 0.0, "min")

    idx_ventana = {p.indice for p in en_ventana}
    espera_por_paciente: dict[int, float] = {}
    servicio_por_paciente: dict[int, float] = {}
    for e in reg.eventos:
        if e.paciente not in idx_ventana:
            continue
        espera_por_paciente[e.paciente] = espera_por_paciente.get(e.paciente, 0.0) + e.espera
        servicio_por_paciente[e.paciente] = (
            servicio_por_paciente.get(e.paciente, 0.0) + e.servicio
        )
    idx_terminados = {p.indice for p in terminados}
    g(
        "espera_total_media",
        media([v for k, v in espera_por_paciente.items() if k in idx_terminados]),
        "min",
    )
    g(
        "servicio_total_medio",
        media([v for k, v in servicio_por_paciente.items() if k in idx_terminados]),
        "min",
    )

    n_term = len(terminados) or 1
    for desenlace in ("alta_directa", "alta", "muerte"):
        cuantos = sum(1 for p in terminados if p.desenlace == desenlace)
        g(f"prop_{desenlace}", cuantos / n_term, "proporcion")
        g(f"n_{desenlace}", cuantos, "pacientes")
    g(
        "prop_estables",
        sum(1 for p in en_ventana if p.estable) / (len(en_ventana) or 1),
        "proporcion",
    )

    # --- por zona -----------------------------------------------------
    # Todo esto se calcula sobre `ocupaciones`, no sobre `eventos`. La razon:
    # la ocupacion real de una zona es el tiempo que el paciente retiene el
    # recurso, que no siempre coincide con las actividades etiquetadas con esa
    # zona (por ejemplo cuando el shock room se sostiene durante el ATLS).
    for zona, capacidad in cfg.capacidades.items():
        usos = [o for o in reg.ocupaciones if o.zona == zona]
        ocupacion = [(o.t_inicio, o.t_fin) for o in usos]
        colas = [(o.t_solicitud, o.t_inicio) for o in usos if o.espera > 0]
        # Esperas que no habian terminado al cerrar la simulacion: cuentan como
        # cola hasta el horizonte, aunque no dejen registro de ocupacion.
        truncadas = [(t, v1) for z, t in reg.esperas_pendientes if z == zona]
        colas = colas + truncadas

        # La espera se promedia sobre TODAS las adquisiciones, contando como
        # cero las que no esperaron: es la definicion estandar de tiempo en cola
        # (Wq) y la que hace que se cumpla la ley de Little (cola = Wq x tasa).
        adquisiciones = [o for o in usos if v0 <= o.t_inicio <= v1]
        esperas = [o.espera for o in adquisiciones]
        esperas_positivas = [x for x in esperas if x > 0]

        tiempo_ocupado = sum(solape(a, b, v0, v1) for a, b in ocupacion)
        tiempo_en_cola = sum(solape(a, b, v0, v1) for a, b in colas)

        def z(metrica: str, valor: float, unidad: str) -> None:
            kpis.append(Kpi(metrica, "zona", zona, float(valor), unidad))

        z("capacidad", capacidad, "puestos")
        z("utilizacion", 100.0 * tiempo_ocupado / (capacidad * ventana), "%")
        z("ocupacion_media", tiempo_ocupado / ventana, "pacientes")
        z("ocupacion_max", max_simultaneos(ocupacion, v0, v1), "pacientes")
        z("cola_media", tiempo_en_cola / ventana, "pacientes")
        z("cola_max", max_simultaneos(colas, v0, v1), "pacientes")
        z("espera_media", media(esperas), "min")
        z("espera_p95", percentil(esperas, 95), "min")
        z("espera_max", max(esperas) if esperas else 0.0, "min")
        z("espera_media_si_espera", media(esperas_positivas), "min")
        z("n_atenciones", len(adquisiciones), "atenciones")
        z("prop_con_espera", len(esperas_positivas) / (len(adquisiciones) or 1), "proporcion")
        z("esperas_truncadas", len(truncadas), "pacientes")

    # --- por actividad ------------------------------------------------
    for clave in ACTIVIDADES:
        eventos = [e for e in reg.eventos if e.actividad == clave and v0 <= e.t_inicio <= v1]
        if not eventos:
            continue
        kpis.append(
            Kpi("espera_actividad", "actividad", clave, media([e.espera for e in eventos]), "min")
        )
        kpis.append(
            Kpi(
                "servicio_actividad",
                "actividad",
                clave,
                media([e.servicio for e in eventos]),
                "min",
            )
        )
        kpis.append(
            Kpi("n_actividad", "actividad", clave, float(len(eventos)), "veces")
        )

    return kpis


def series(cfg: Config, reg: Registro) -> list[MuestraSerie]:
    """Serie temporal de ocupacion y cola por zona, para graficar."""
    v0 = cfg.simulacion.calentamiento
    v1 = cfg.simulacion.horizonte
    paso = cfg.simulacion.intervalo_serie
    muestras: list[MuestraSerie] = []
    for zona in cfg.capacidades:
        usos = [o for o in reg.ocupaciones if o.zona == zona]
        ocup = serie_conteo([(o.t_inicio, o.t_fin) for o in usos], v0, v1, paso)
        cola = serie_conteo(
            [(o.t_solicitud, o.t_inicio) for o in usos if o.espera > 0]
            + [(t, v1) for z, t in reg.esperas_pendientes if z == zona],
            v0,
            v1,
            paso,
        )
        cola_por_t = dict(cola)
        for t, n in ocup:
            muestras.append(MuestraSerie(t=t, zona=zona, ocupados=n, en_cola=cola_por_t.get(t, 0)))
    return muestras


def resumen_texto(kpis: list[Kpi]) -> dict[str, float]:
    """Diccionario plano metrica -> valor, util para imprimir en consola."""
    return {
        (k.metrica if k.dimension == "global" else f"{k.metrica}.{k.entidad}"): k.valor
        for k in kpis
    }
