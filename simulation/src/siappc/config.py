"""Carga y validacion de la configuracion del modelo.

Regla de oro del proyecto: ningun numero entra al modelo sin declarar de donde
sale. Por eso cada parametro del YAML puede escribirse de dos formas:

    triaje: "uniform(3,5)"                      # forma corta, queda sin declarar
    triaje:                                      # forma completa, trazable
      dist: "uniform(3,5)"
      fuente: modelo_actual
      nota: "Valor que ya tiene el bloque Demora en FlexSim"

El cargador construye ademas un inventario plano de todos los parametros, que se
guarda en la base de datos. Eso permite responder en una sola consulta SQL
cuantos parametros del modelo son datos reales y cuantos son supuestos, que es
justo lo que un jurado pregunta.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

from .distribuciones import Distribucion, parsear

# Fuentes admitidas, de mas a menos confiable.
FUENTES = (
    "dato_real",  # medido en el Hospital Santo Tomas
    "encuesta",  # derivado del cuestionario a personal (n=6)
    "modelo_actual",  # valor que ya esta puesto en el modelo de FlexSim
    "literatura",  # tomado de una fuente publicada y citada
    "estimado",  # calculado a partir de algo indirecto
    "supuesto",  # elegido por nosotros, sin respaldo
    "prueba",  # valor temporal solo para que el modelo corra
    "sin_declarar",  # se escribio en forma corta; el cargador lo marca solo
)

# Las 24 actividades del Process Flow actual y la zona que ocupa cada una.
# None significa que en el modelo de FlexSim es una Demora sin restriccion.
ACTIVIDADES: dict[str, tuple[str, str | None]] = {
    "triaje": ("Triaje", None),
    "traslado_shock_room": ("Traslado a shock room", None),
    "shock_room": ("Shock Room", "ZonaShockRoom"),
    "x_control_cervical": ("X - Control cervical", "ZonaPersonalMedico"),
    "a_via_aerea": ("A - Via aerea", "ZonaPersonalMedico"),
    "b_ventilacion": ("B - Ventilacion", "ZonaPersonalMedico"),
    "c_circulacion": ("C - Circulacion", "ZonaPersonalMedico"),
    "d_neurologico": ("D - Neurologico", "ZonaPersonalMedico"),
    "e_exposicion": ("E - Exposicion", "ZonaPersonalMedico"),
    "laboratorios": ("Laboratorios", "ZonaLaboratorio"),
    "rx_torax_pelvis": ("Rx Torax Pelvis", "ZonaRadiologia"),
    "fast": ("FAST", "ZonaRadiologia"),
    "tac": ("TAC", "ZonaTAC"),
    "control_hemorragias": ("Control hemorragias", None),
    "lesion_neurologica": ("Lesion neurologica", None),
    "trauma_toracico": ("Trauma toracico", None),
    "espera_especialista": ("Espera_Especialista", None),
    "valoracion_especialista": ("Valoracion especialista", "ZonaEspecialistas"),
    "espera_quirofano": ("Espera_Quirofano", None),
    "cirugia": ("Cirugia", "ZonaQuirofano"),
    "traslado_uci": ("Traslado a UCI", None),
    "estancia_uci": ("Estancia UCI", "ZonaUCI"),
    "hospitalizacion": ("Hospitalizacion", "ZonaHospitalizacion"),
    "rehabilitacion": ("Rehabilitacion", "ZonaRehabilitacion"),
}

# Las 10 zonas con capacidad limitada del modelo actual.
ZONAS = (
    "ZonaShockRoom",
    "ZonaPersonalMedico",
    "ZonaLaboratorio",
    "ZonaRadiologia",
    "ZonaTAC",
    "ZonaEspecialistas",
    "ZonaQuirofano",
    "ZonaUCI",
    "ZonaHospitalizacion",
    "ZonaRehabilitacion",
)

# Los 7 bloques Decidir del Process Flow actual.
#   1. Paciente estable        -> se resuelve con la etiqueta 'estable', que se
#                                 asigna al crear el paciente (igual que en
#                                 FlexSim, donde el Decidir lee una etiqueta ya
#                                 puesta por 'Asignar atributos').
#   2. Tipo de lesion critica  -> RAMAS_LESION_CRITICA (tres salidas)
#   3-7. Los cinco de abajo    -> DECISIONES_BINARIAS
DECISIONES_BINARIAS = (
    "requiere_especialista",
    "requiere_cirugia",
    "requiere_uci",
    "muerte_en_uci",
    "requiere_rehabilitacion",
)
RAMAS_LESION_CRITICA = ("control_hemorragias", "lesion_neurologica", "trauma_toracico")


class ErrorConfig(ValueError):
    """La configuracion tiene un problema que impide correr el modelo."""


@dataclass(frozen=True)
class Parametro:
    """Un numero del modelo junto con su procedencia."""

    ruta: str
    valor: Any
    fuente: str
    nota: str = ""

    @property
    def valor_texto(self) -> str:
        return str(self.valor)


@dataclass
class Inventario:
    """Todos los parametros declarados, en orden de aparicion."""

    items: list[Parametro] = field(default_factory=list)

    def agregar(self, ruta: str, valor: Any, fuente: str, nota: str) -> None:
        if fuente not in FUENTES:
            raise ErrorConfig(
                f"[{ruta}] fuente {fuente!r} no valida. Use una de: {', '.join(FUENTES)}"
            )
        self.items.append(Parametro(ruta, valor, fuente, nota))

    def conteo_por_fuente(self) -> dict[str, int]:
        conteo: dict[str, int] = {}
        for p in self.items:
            conteo[p.fuente] = conteo.get(p.fuente, 0) + 1
        return dict(sorted(conteo.items(), key=lambda kv: -kv[1]))


def _nodo(bruto: Any, ruta: str, clave: str, inventario: Inventario) -> Any:
    """Extrae el valor de un nodo que puede venir corto o completo."""
    if isinstance(bruto, dict):
        if clave not in bruto:
            raise ErrorConfig(f"[{ruta}] falta la clave {clave!r}")
        valor = bruto[clave]
        fuente = bruto.get("fuente", "sin_declarar")
        nota = str(bruto.get("nota", ""))
    else:
        valor = bruto
        fuente = "sin_declarar"
        nota = ""
    inventario.agregar(ruta, valor, fuente, nota)
    return valor


@dataclass
class ConfigSimulacion:
    horizonte: float
    calentamiento: float
    replicas: int
    semilla: int
    guardar_series: str
    intervalo_serie: float

    @property
    def ventana(self) -> float:
        """Duracion util de la corrida, ya descontado el calentamiento."""
        return self.horizonte - self.calentamiento


@dataclass
class Config:
    nombre: str
    descripcion: str
    version_modelo: str
    simulacion: ConfigSimulacion
    entre_llegadas: Distribucion
    edad: Distribucion
    glasgow: Distribucion
    prob_estable: float
    capacidades: dict[str, int]
    duraciones: dict[str, Distribucion]
    decisiones: dict[str, float]
    ramas_lesion: dict[str, float]
    sostener_shock_room: bool
    inventario: Inventario
    bruto: dict[str, Any]
    ruta_archivo: str = ""

    @property
    def hash_config(self) -> str:
        """Huella del contenido, para saber si dos corridas usaron lo mismo."""
        texto = json.dumps(self.bruto, sort_keys=True, ensure_ascii=False, default=str)
        return hashlib.sha256(texto.encode("utf-8")).hexdigest()[:16]

    @property
    def yaml_texto(self) -> str:
        return yaml.safe_dump(self.bruto, sort_keys=False, allow_unicode=True)


def _fusionar(base: dict[str, Any], encima: dict[str, Any]) -> dict[str, Any]:
    """Mezcla profunda: lo de 'encima' pisa lo de 'base', clave por clave."""
    salida = dict(base)
    for clave, valor in encima.items():
        if clave in salida and isinstance(salida[clave], dict) and isinstance(valor, dict):
            salida[clave] = _fusionar(salida[clave], valor)
        else:
            salida[clave] = valor
    return salida


def _leer_yaml(ruta: Path, vistos: set[Path] | None = None) -> dict[str, Any]:
    """Lee un YAML resolviendo la herencia con la clave 'extiende'."""
    vistos = vistos or set()
    ruta = ruta.resolve()
    if ruta in vistos:
        raise ErrorConfig(f"Herencia circular de configuraciones en {ruta}")
    vistos.add(ruta)
    if not ruta.exists():
        raise ErrorConfig(f"No existe el archivo de configuracion: {ruta}")

    bruto = yaml.safe_load(ruta.read_text(encoding="utf-8")) or {}
    padre = bruto.pop("extiende", None)
    if padre:
        base = _leer_yaml((ruta.parent / str(padre)), vistos)
        bruto = _fusionar(base, bruto)
    return bruto


def cargar(ruta: str | Path) -> Config:
    """Lee un YAML de configuracion (con herencia) y lo valida.

    Un escenario no repite toda la configuracion: declara `extiende: ../base.yaml`
    y solo escribe lo que cambia. Lo que se guarda en la base de datos es la
    configuracion ya resuelta, no el fragmento, para que la corrida sea
    reproducible sin depender de archivos externos.
    """
    ruta = Path(ruta)
    bruto = _leer_yaml(ruta)
    cfg = desde_dict(bruto)
    cfg.ruta_archivo = str(ruta)
    return cfg


def desde_dict(bruto: dict[str, Any]) -> Config:
    """Valida un diccionario ya cargado. Separado de cargar() para las pruebas."""
    inv = Inventario()

    meta = bruto.get("meta") or {}
    sim_bruto = bruto.get("simulacion") or {}
    if not sim_bruto:
        raise ErrorConfig("Falta la seccion 'simulacion'")

    simulacion = ConfigSimulacion(
        horizonte=float(_nodo(sim_bruto["horizonte"], "simulacion.horizonte", "valor", inv)),
        calentamiento=float(
            _nodo(sim_bruto.get("calentamiento", 0), "simulacion.calentamiento", "valor", inv)
        ),
        replicas=int(_nodo(sim_bruto.get("replicas", 10), "simulacion.replicas", "valor", inv)),
        semilla=int(_nodo(sim_bruto.get("semilla", 1), "simulacion.semilla", "valor", inv)),
        guardar_series=str(sim_bruto.get("guardar_series", "primera_replica")),
        intervalo_serie=float(sim_bruto.get("intervalo_serie", 60)),
    )
    if simulacion.ventana <= 0:
        raise ErrorConfig("El calentamiento no puede ser mayor o igual que el horizonte")
    if simulacion.replicas < 1:
        raise ErrorConfig("Se necesita al menos una replica")
    if simulacion.guardar_series not in ("ninguna", "primera_replica", "todas"):
        raise ErrorConfig(
            "simulacion.guardar_series debe ser: ninguna, primera_replica o todas"
        )

    # --- llegadas y etiquetas del paciente -------------------------------
    llegadas = bruto.get("llegadas") or {}
    if "entre_llegadas" not in llegadas:
        raise ErrorConfig("Falta 'llegadas.entre_llegadas'")
    entre_llegadas = parsear(
        _nodo(llegadas["entre_llegadas"], "llegadas.entre_llegadas", "dist", inv)
    )

    etiquetas = bruto.get("etiquetas") or {}
    for clave in ("edad", "glasgow", "estable"):
        if clave not in etiquetas:
            raise ErrorConfig(f"Falta 'etiquetas.{clave}'")
    edad = parsear(_nodo(etiquetas["edad"], "etiquetas.edad", "dist", inv))
    glasgow = parsear(_nodo(etiquetas["glasgow"], "etiquetas.glasgow", "dist", inv))
    prob_estable = float(_nodo(etiquetas["estable"], "etiquetas.estable", "p", inv))
    _validar_prob("etiquetas.estable", prob_estable)

    # --- zonas -----------------------------------------------------------
    zonas_bruto = bruto.get("zonas") or {}
    faltan = [z for z in ZONAS if z not in zonas_bruto]
    if faltan:
        raise ErrorConfig(f"Faltan zonas en la configuracion: {', '.join(faltan)}")
    sobran = [z for z in zonas_bruto if z not in ZONAS]
    if sobran:
        raise ErrorConfig(
            f"Zonas no reconocidas: {', '.join(sobran)}. "
            f"El modelo espejo solo admite: {', '.join(ZONAS)}"
        )
    capacidades: dict[str, int] = {}
    for zona in ZONAS:
        cap = int(_nodo(zonas_bruto[zona], f"zonas.{zona}", "capacidad", inv))
        if cap < 1:
            raise ErrorConfig(f"[zonas.{zona}] la capacidad debe ser al menos 1")
        capacidades[zona] = cap

    # --- duraciones de las 24 actividades --------------------------------
    act_bruto = bruto.get("actividades") or {}
    faltan = [a for a in ACTIVIDADES if a not in act_bruto]
    if faltan:
        raise ErrorConfig(f"Faltan actividades en la configuracion: {', '.join(faltan)}")
    sobran = [a for a in act_bruto if a not in ACTIVIDADES]
    if sobran:
        raise ErrorConfig(f"Actividades no reconocidas: {', '.join(sobran)}")
    duraciones = {
        clave: parsear(_nodo(act_bruto[clave], f"actividades.{clave}", "dist", inv))
        for clave in ACTIVIDADES
    }

    # --- los 7 bloques Decidir -------------------------------------------
    dec_bruto = bruto.get("decisiones") or {}
    faltan = [d for d in DECISIONES_BINARIAS if d not in dec_bruto]
    if faltan:
        raise ErrorConfig(f"Faltan decisiones en la configuracion: {', '.join(faltan)}")
    decisiones: dict[str, float] = {}
    for clave in DECISIONES_BINARIAS:
        p = float(_nodo(dec_bruto[clave], f"decisiones.{clave}", "p", inv))
        _validar_prob(f"decisiones.{clave}", p)
        decisiones[clave] = p

    lesion_bruto = dec_bruto.get("tipo_lesion_critica")
    if not isinstance(lesion_bruto, dict):
        raise ErrorConfig("Falta 'decisiones.tipo_lesion_critica' con sus tres ramas")
    ramas: dict[str, float] = {}
    for rama in RAMAS_LESION_CRITICA:
        if rama not in lesion_bruto:
            raise ErrorConfig(f"Falta la rama '{rama}' en decisiones.tipo_lesion_critica")
        p = float(
            _nodo(lesion_bruto[rama], f"decisiones.tipo_lesion_critica.{rama}", "p", inv)
        )
        _validar_prob(f"decisiones.tipo_lesion_critica.{rama}", p)
        ramas[rama] = p
    suma = sum(ramas.values())
    if abs(suma - 1.0) > 1e-6:
        raise ErrorConfig(
            f"Las tres ramas de tipo_lesion_critica deben sumar 1.0, suman {suma:.4f}"
        )

    # --- opciones de modelado --------------------------------------------
    opciones = bruto.get("opciones") or {}
    sostener = bool(opciones.get("sostener_shock_room", False))

    return Config(
        nombre=str(meta.get("nombre", "sin_nombre")),
        descripcion=str(meta.get("descripcion", "")),
        version_modelo=str(meta.get("version_modelo", "0.0.0")),
        simulacion=simulacion,
        entre_llegadas=entre_llegadas,
        edad=edad,
        glasgow=glasgow,
        prob_estable=prob_estable,
        capacidades=capacidades,
        duraciones=duraciones,
        decisiones=decisiones,
        ramas_lesion=ramas,
        sostener_shock_room=sostener,
        inventario=inv,
        bruto=bruto,
    )


def _validar_prob(ruta: str, p: float) -> None:
    if not 0.0 <= p <= 1.0:
        raise ErrorConfig(f"[{ruta}] la probabilidad debe estar entre 0 y 1, llego {p}")
