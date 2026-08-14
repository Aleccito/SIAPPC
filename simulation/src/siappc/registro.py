"""Bitacora de eventos de una replica.

El modelo no calcula ningun indicador mientras corre: solo anota cuando cada
paciente pidio una zona, cuando empezo a ser atendido y cuando termino. Todos
los indicadores (utilizacion, colas, esperas, cuellos de botella) se derivan
despues de esa bitacora.

Se hace asi a proposito. Un indicador calculado dentro del motor es dificil de
auditar; un indicador calculado sobre la bitacora se puede recalcular a mano,
en SQL o en Excel, y comprobar que da lo mismo. Para un trabajo que hay que
defender, esa trazabilidad vale mas que ahorrar memoria.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Evento:
    """Un paso del paciente por una actividad."""

    paciente: int
    secuencia: int
    actividad: str
    zona: str | None
    t_solicitud: float  # cuando pidio la zona (== t_inicio si no ocupa zona)
    t_inicio: float  # cuando empezo la atencion
    t_fin: float  # cuando termino
    adquisicion: bool = False  # True solo en el evento que adquiere la zona

    @property
    def espera(self) -> float:
        return self.t_inicio - self.t_solicitud

    @property
    def servicio(self) -> float:
        return self.t_fin - self.t_inicio


@dataclass
class Ocupacion:
    """Una vez que un paciente tomo y solto una zona.

    Es distinta de un Evento a proposito. Un evento es una actividad clinica
    (por ejemplo "C - Circulacion"); una ocupacion es el tiempo real durante el
    cual el paciente retuvo el recurso. Un mismo tramo puede tener seis eventos
    y una sola ocupacion, y si el paciente sostiene la camilla de shock room
    durante toda la evaluacion primaria, la ocupacion lo refleja aunque las
    actividades esten etiquetadas con otra zona.

    Todos los indicadores de utilizacion, cola y espera se calculan sobre esta
    lista, no sobre los eventos. Medir la utilizacion a partir de las etiquetas
    de actividad es un error facil de cometer y dificil de detectar.
    """

    paciente: int
    zona: str
    t_solicitud: float
    t_inicio: float
    t_fin: float

    @property
    def espera(self) -> float:
        return self.t_inicio - self.t_solicitud

    @property
    def uso(self) -> float:
        return self.t_fin - self.t_inicio


@dataclass
class Paciente:
    """Un paciente completo, con sus etiquetas y su desenlace."""

    indice: int
    t_llegada: float
    edad: float
    glasgow: int
    estable: bool
    t_salida: float | None = None
    desenlace: str | None = None
    ruta: list[str] = field(default_factory=list)

    @property
    def tiempo_sistema(self) -> float | None:
        if self.t_salida is None:
            return None
        return self.t_salida - self.t_llegada

    @property
    def ruta_texto(self) -> str:
        return " > ".join(self.ruta)


@dataclass
class Registro:
    """Todo lo ocurrido en una replica."""

    replica: int
    semilla: int
    eventos: list[Evento] = field(default_factory=list)
    ocupaciones: list[Ocupacion] = field(default_factory=list)
    pacientes: list[Paciente] = field(default_factory=list)
    # Esperas que seguian en curso cuando termino la simulacion: (zona, t_solicitud).
    # Sin ellas, la cola media saldria sesgada a la baja, porque un paciente que
    # nunca llego a entrar no deja ningun evento.
    esperas_pendientes: list[tuple[str, float]] = field(default_factory=list)
    # Una vez cerrada, la bitacora no acepta mas anotaciones. Hace falta porque
    # los procesos que quedaron a medias cuando termino la simulacion ejecutan
    # sus bloques finally mas tarde, cuando Python los recolecta, y si no se
    # bloquea eso pueden anadir filas DESPUES de haber calculado los
    # indicadores. El sintoma es horrible de diagnosticar: los KPI y la base de
    # datos dejan de cuadrar, y el resultado cambia segun cuando pase el
    # recolector de basura.
    cerrado: bool = False
    _secuencias: dict[int, int] = field(default_factory=dict, repr=False)

    def cerrar(self) -> None:
        self.cerrado = True

    def nuevo_paciente(
        self, indice: int, t_llegada: float, edad: float, glasgow: int, estable: bool
    ) -> Paciente:
        p = Paciente(
            indice=indice,
            t_llegada=t_llegada,
            edad=edad,
            glasgow=glasgow,
            estable=estable,
        )
        self.pacientes.append(p)
        return p

    def anotar(
        self,
        paciente: Paciente,
        actividad: str,
        zona: str | None,
        t_solicitud: float,
        t_inicio: float,
        t_fin: float,
        adquisicion: bool = False,
    ) -> None:
        """Anota un evento.

        `adquisicion` marca el evento en el que el paciente tomo la zona. Solo
        ese evento lleva la espera: un tramo como el ATLS ocupa una unica vez
        ZonaPersonalMedico aunque se anoten seis actividades seguidas, y contar
        seis esperas ahi inflaria el indicador.
        """
        if self.cerrado:
            return
        secuencia = self._secuencias.get(paciente.indice, 0) + 1
        self._secuencias[paciente.indice] = secuencia
        self.eventos.append(
            Evento(
                paciente=paciente.indice,
                secuencia=secuencia,
                actividad=actividad,
                zona=zona,
                t_solicitud=t_solicitud,
                t_inicio=t_inicio,
                t_fin=t_fin,
                adquisicion=adquisicion,
            )
        )
        # La ruta guarda las zonas que el paciente ADQUIRIO, no una entrada por
        # actividad: si no, el ATLS apareceria seis veces seguidas.
        if zona and adquisicion:
            paciente.ruta.append(zona)

    def anotar_ocupacion(
        self, paciente: Paciente, zona: str, t_solicitud: float, t_inicio: float, t_fin: float
    ) -> None:
        if self.cerrado:
            return
        self.ocupaciones.append(
            Ocupacion(
                paciente=paciente.indice,
                zona=zona,
                t_solicitud=t_solicitud,
                t_inicio=t_inicio,
                t_fin=t_fin,
            )
        )

    def eventos_de(self, paciente: int) -> list[Evento]:
        return [e for e in self.eventos if e.paciente == paciente]
