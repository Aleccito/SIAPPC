"""Motor de simulacion: espejo en codigo del Process Flow actual de SIAPPC.

El orden de los bloques de este archivo sigue el orden del diagrama del modelo
de FlexSim (FLOW.jpeg), a proposito, para que se puedan leer en paralelo:

    Llegada de pacientes -> Crear objeto -> Asignar atributos
    -> Triaje -> Traslado a shock room
    -> [ZonaShockRoom] Shock Room
    -> [ZonaPersonalMedico] X, A, B, C, D, E
    -> DECIDIR Paciente estable
         estable   -> [Laboratorio] [Radiologia] Rx, [Radiologia] FAST, [TAC]
                      -> DECIDIR Requiere especialista
         inestable -> DECIDIR Tipo de lesion critica -> una de las tres
    -> DECIDIR Requiere cirugia -> Espera_Quirofano -> [Quirofano] Cirugia
    -> DECIDIR Requiere UCI -> no: Alta directa
    -> Traslado a UCI -> [UCI] Estancia UCI -> DECIDIR Desenlace UCI -> Muerte
    -> [Hospitalizacion] -> DECIDIR Requiere rehabilitacion -> [Rehabilitacion]
    -> Alta

Numeros aleatorios
------------------
Cada paciente lleva su propio generador, derivado de (semilla, indice). Eso
significa que el paciente numero 42 de la replica 3 tiene exactamente la misma
edad, el mismo Glasgow, los mismos tiempos de servicio y las mismas decisiones
en todos los escenarios. Cuando se compara "un TAC" contra "dos TAC", la unica
diferencia posible es la congestion, no el azar. Es la tecnica de numeros
aleatorios comunes, y permite detectar diferencias reales con menos replicas.
"""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Any, Generator

import simpy

from .config import Config
from .registro import Paciente, Registro


@dataclass
class Toma:
    """Una zona adquirida y todavia retenida por un paciente."""

    zona: str
    peticion: Any
    t_solicitud: float
    t_inicio: float
    marca: int

TRAMO_ATLS = (
    "x_control_cervical",
    "a_via_aerea",
    "b_ventilacion",
    "c_circulacion",
    "d_neurologico",
    "e_exposicion",
)

VIA_DIAGNOSTICA = (
    ("laboratorios", "ZonaLaboratorio"),
    ("rx_torax_pelvis", "ZonaRadiologia"),
    ("fast", "ZonaRadiologia"),
    ("tac", "ZonaTAC"),
)

DESENLACES = ("alta_directa", "muerte", "alta")


class Modelo:
    """Una replica del modelo. Se construye, se corre y devuelve su bitacora."""

    def __init__(self, cfg: Config, replica: int, semilla: int) -> None:
        self.cfg = cfg
        self.env = simpy.Environment()
        self.registro = Registro(replica=replica, semilla=semilla)
        self.semilla = semilla
        self.rng_llegadas = random.Random(f"{semilla}-llegadas")
        self.zonas: dict[str, simpy.Resource] = {
            nombre: simpy.Resource(self.env, capacity=capacidad)
            for nombre, capacidad in cfg.capacidades.items()
        }
        self._pendientes: dict[int, tuple[str, float]] = {}
        self._ocupando: dict[int, tuple[Paciente, Toma]] = {}
        self._marca = 0

    # ------------------------------------------------------------------
    # Ejecucion
    # ------------------------------------------------------------------
    def correr(self) -> Registro:
        self.env.process(self._llegada_de_pacientes())
        fin = self.cfg.simulacion.horizonte
        self.env.run(until=fin)

        # Cierre de la ventana. Hay dos cosas a medias que hay que anotar, o los
        # indicadores salen sesgados a la baja:
        #  1. Pacientes que seguian en cola: ocupaban cola hasta el final.
        #  2. Pacientes que seguian dentro de una zona: la ocupaban hasta el
        #     final. Sin esto se pierde toda la estancia de quien esta en UCI
        #     cuando termina la simulacion, que es justo el recurso mas cargado.
        self.registro.esperas_pendientes = list(self._pendientes.values())
        for paciente, toma in self._ocupando.values():
            self.registro.anotar_ocupacion(
                paciente, toma.zona, toma.t_solicitud, toma.t_inicio, fin
            )
        self.registro.cerrar()
        return self.registro

    def _llegada_de_pacientes(self) -> Generator:
        """Bloque 'Fuente Entre llegadas' + 'Crear objeto' + 'Asignar atributos'."""
        indice = 0
        while True:
            yield self.env.timeout(self.cfg.entre_llegadas.muestrear(self.rng_llegadas))
            indice += 1
            rng = random.Random(f"{self.semilla}-paciente-{indice}")
            paciente = self.registro.nuevo_paciente(
                indice=indice,
                t_llegada=self.env.now,
                edad=round(self.cfg.edad.muestrear(rng), 1),
                glasgow=int(round(self.cfg.glasgow.muestrear(rng))),
                estable=rng.random() < self.cfg.prob_estable,
            )
            self.env.process(self._flujo_del_paciente(paciente, rng))

    # ------------------------------------------------------------------
    # Piezas reutilizables (equivalentes a los bloques de FlexSim)
    # ------------------------------------------------------------------
    def _demora(self, p: Paciente, clave: str, rng: random.Random) -> Generator:
        """Bloque 'Demora' sin restriccion: consume tiempo pero no ocupa zona."""
        t0 = self.env.now
        yield self.env.timeout(self.cfg.duraciones[clave].muestrear(rng))
        self.registro.anotar(p, clave, None, t0, t0, self.env.now, adquisicion=False)

    def _adquirir(self, p: Paciente, zona: str) -> Generator:
        """Bloque 'Zona de entrada'. Devuelve la Toma con la zona retenida."""
        t_solicitud = self.env.now
        peticion = self.zonas[zona].request()
        self._marca += 1
        marca = self._marca
        self._pendientes[marca] = (zona, t_solicitud)
        try:
            yield peticion
        finally:
            self._pendientes.pop(marca, None)
        toma = Toma(zona, peticion, t_solicitud, self.env.now, marca)
        self._ocupando[marca] = (p, toma)
        return toma

    def _atender(
        self,
        p: Paciente,
        clave: str,
        zona: str | None,
        rng: random.Random,
        t_solicitud: float | None = None,
    ) -> Generator:
        """Actividad que ocurre dentro de una zona ya adquirida.

        Se pasa `t_solicitud` unicamente en la actividad que adquirio la zona;
        las siguientes del mismo tramo lo dejan en None y no vuelven a contar la
        espera.
        """
        t_inicio = self.env.now
        yield self.env.timeout(self.cfg.duraciones[clave].muestrear(rng))
        self.registro.anotar(
            p,
            clave,
            zona,
            t_inicio if t_solicitud is None else t_solicitud,
            t_inicio,
            self.env.now,
            adquisicion=t_solicitud is not None,
        )

    def _liberar(self, p: Paciente, toma: Toma) -> None:
        """Bloque 'Zona de salida'. Anota cuanto tiempo se retuvo el recurso."""
        if self._ocupando.pop(toma.marca, None) is None:
            return  # ya se cerro al terminar la simulacion
        self.zonas[toma.zona].release(toma.peticion)
        self.registro.anotar_ocupacion(
            p, toma.zona, toma.t_solicitud, toma.t_inicio, self.env.now
        )

    def _pasar_por_zona(
        self, p: Paciente, clave: str, zona: str, rng: random.Random
    ) -> Generator:
        """Patron 'Zona de entrada -> actividad -> Zona de salida'."""
        toma = yield from self._adquirir(p, zona)
        try:
            yield from self._atender(p, clave, zona, rng, toma.t_solicitud)
        finally:
            self._liberar(p, toma)

    def _decidir(self, clave: str, rng: random.Random) -> bool:
        """Bloque 'Decidir' de dos salidas."""
        return rng.random() < self.cfg.decisiones[clave]

    def _elegir_lesion(self, rng: random.Random) -> str:
        """Bloque 'Decidir' de tres salidas (Tipo de lesion critica)."""
        u = rng.random()
        acumulado = 0.0
        for rama, p in self.cfg.ramas_lesion.items():
            acumulado += p
            if u < acumulado:
                return rama
        return list(self.cfg.ramas_lesion)[-1]

    def _salir(self, p: Paciente, desenlace: str) -> None:
        """Bloque 'Destruir objeto' (Alta directa / Alta / Muerte)."""
        p.t_salida = self.env.now
        p.desenlace = desenlace

    # ------------------------------------------------------------------
    # El flujo completo del paciente
    # ------------------------------------------------------------------
    def _flujo_del_paciente(self, p: Paciente, rng: random.Random) -> Generator:
        cfg = self.cfg

        yield from self._demora(p, "triaje", rng)
        yield from self._demora(p, "traslado_shock_room", rng)

        # --- Shock Room --------------------------------------------------
        toma_sr = yield from self._adquirir(p, "ZonaShockRoom")
        sr_liberada = False

        def soltar_shock_room() -> None:
            self._liberar(p, toma_sr)

        try:
            yield from self._atender(
                p, "shock_room", "ZonaShockRoom", rng, toma_sr.t_solicitud
            )

            if not cfg.sostener_shock_room:
                # Comportamiento del modelo actual de FlexSim: la Zona de salida
                # esta inmediatamente despues del bloque Shock Room, asi que la
                # sala se libera antes de la evaluacion primaria. Es el hallazgo
                # 5.1 del documento de migracion, reproducido a proposito.
                soltar_shock_room()
                sr_liberada = True

            # --- Evaluacion primaria ATLS (ZonaPersonalMedico) -----------
            toma_pm = yield from self._adquirir(p, "ZonaPersonalMedico")
            try:
                for i, clave in enumerate(TRAMO_ATLS):
                    yield from self._atender(
                        p,
                        clave,
                        "ZonaPersonalMedico",
                        rng,
                        toma_pm.t_solicitud if i == 0 else None,
                    )
            finally:
                self._liberar(p, toma_pm)

            # --- DECIDIR: paciente estable -------------------------------
            if p.estable:
                if not sr_liberada:
                    soltar_shock_room()
                    sr_liberada = True
                for clave, zona in VIA_DIAGNOSTICA:
                    yield from self._pasar_por_zona(p, clave, zona, rng)

                # --- DECIDIR: requiere especialista ----------------------
                if self._decidir("requiere_especialista", rng):
                    yield from self._demora(p, "espera_especialista", rng)
                    yield from self._pasar_por_zona(
                        p, "valoracion_especialista", "ZonaEspecialistas", rng
                    )
            else:
                # --- DECIDIR: tipo de lesion critica ---------------------
                yield from self._demora(p, self._elegir_lesion(rng), rng)
                if not sr_liberada:
                    soltar_shock_room()
                    sr_liberada = True
        finally:
            if not sr_liberada:
                soltar_shock_room()

        # --- DECIDIR: requiere cirugia -----------------------------------
        if self._decidir("requiere_cirugia", rng):
            yield from self._demora(p, "espera_quirofano", rng)
            yield from self._pasar_por_zona(p, "cirugia", "ZonaQuirofano", rng)

        # --- DECIDIR: requiere UCI ---------------------------------------
        if not self._decidir("requiere_uci", rng):
            self._salir(p, "alta_directa")
            return

        yield from self._demora(p, "traslado_uci", rng)
        yield from self._pasar_por_zona(p, "estancia_uci", "ZonaUCI", rng)

        # --- DECIDIR: desenlace UCI --------------------------------------
        if self._decidir("muerte_en_uci", rng):
            self._salir(p, "muerte")
            return

        yield from self._pasar_por_zona(p, "hospitalizacion", "ZonaHospitalizacion", rng)

        # --- DECIDIR: requiere rehabilitacion ----------------------------
        if self._decidir("requiere_rehabilitacion", rng):
            yield from self._pasar_por_zona(p, "rehabilitacion", "ZonaRehabilitacion", rng)

        self._salir(p, "alta")


def correr_replica(cfg: Config, replica: int) -> Registro:
    """Corre una replica y devuelve su bitacora."""
    semilla = cfg.simulacion.semilla + replica
    return Modelo(cfg, replica=replica, semilla=semilla).correr()
