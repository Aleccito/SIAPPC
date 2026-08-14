"""Distribuciones estadisticas con la misma sintaxis que usa FlexSim.

El objetivo de este modulo es que un tiempo escrito en el modelo de FlexSim
(por ejemplo ``uniform(3,5)`` o ``triangular(20,45,120)``) se pueda copiar tal
cual al archivo de configuracion YAML y signifique exactamente lo mismo aqui.
Asi la validacion cruzada entre los dos modelos no depende de traducir formulas
a mano, que es donde suelen aparecer las diferencias inexplicables.

FlexSim admite un argumento extra de ``stream`` al final (por ejemplo
``uniform(3,5,1)``). Aqui se acepta y se ignora: la aleatoriedad se controla con
una sola semilla por replica, declarada en la configuracion.
"""

from __future__ import annotations

import math
import random
import re
from dataclasses import dataclass
from typing import Callable

_PATRON = re.compile(r"^\s*([A-Za-z_][A-Za-z_0-9]*)\s*\(\s*(.*?)\s*\)\s*$", re.DOTALL)


class ErrorDistribucion(ValueError):
    """La expresion de distribucion no se pudo interpretar."""


@dataclass(frozen=True)
class Distribucion:
    """Una distribucion ya interpretada y lista para muestrear."""

    texto: str
    nombre: str
    argumentos: tuple[float, ...]
    _muestreador: Callable[[random.Random], float]

    def muestrear(self, rng: random.Random) -> float:
        """Devuelve un tiempo en minutos. Nunca negativo."""
        valor = self._muestreador(rng)
        return valor if valor > 0.0 else 0.0

    def media_teorica(self) -> float | None:
        """Media analitica, util para verificar el modelo sin correrlo."""
        a = self.argumentos
        if self.nombre == "constant":
            return a[0]
        if self.nombre in ("uniform", "duniform"):
            return (a[0] + a[1]) / 2.0
        if self.nombre == "triangular":
            return (a[0] + a[1] + a[2]) / 3.0
        if self.nombre == "exponential":
            return a[0] + a[1]
        if self.nombre == "normal":
            return a[0]
        if self.nombre == "lognormal2":
            return a[0]
        return None

    def __str__(self) -> str:  # pragma: no cover - representacion
        return self.texto


def _constant(a: tuple[float, ...]) -> Callable[[random.Random], float]:
    (c,) = a
    return lambda rng: c


def _uniform(a: tuple[float, ...]) -> Callable[[random.Random], float]:
    lo, hi = a
    return lambda rng: rng.uniform(lo, hi)


def _duniform(a: tuple[float, ...]) -> Callable[[random.Random], float]:
    lo, hi = int(a[0]), int(a[1])
    return lambda rng: float(rng.randint(lo, hi))


def _triangular(a: tuple[float, ...]) -> Callable[[random.Random], float]:
    lo, moda, hi = a
    return lambda rng: rng.triangular(lo, hi, moda)


def _exponential(a: tuple[float, ...]) -> Callable[[random.Random], float]:
    loc, media = a
    return lambda rng: loc + rng.expovariate(1.0 / media)


def _normal(a: tuple[float, ...]) -> Callable[[random.Random], float]:
    mu, sigma = a
    return lambda rng: rng.gauss(mu, sigma)


def _lognormal2(a: tuple[float, ...]) -> Callable[[random.Random], float]:
    """Lognormal parametrizada por media y desviacion del valor observado.

    Es la forma comoda de escribir tiempos de servicio asimetricos: se declara
    lo que uno mediria con un cronometro, no los parametros internos mu/sigma.
    """
    media, desv = a
    if media <= 0:
        raise ErrorDistribucion("lognormal2 exige media > 0")
    varianza = desv * desv
    sigma2 = math.log(1.0 + varianza / (media * media))
    sigma = math.sqrt(sigma2)
    mu = math.log(media) - sigma2 / 2.0
    return lambda rng: math.exp(rng.gauss(mu, sigma))


# nombre -> (aridades validas, constructor, normalizador de argumentos)
_REGISTRO: dict[str, tuple[tuple[int, ...], Callable]] = {
    "constant": ((1,), _constant),
    "uniform": ((2,), _uniform),
    "duniform": ((2,), _duniform),
    "triangular": ((3,), _triangular),
    "exponential": ((1, 2), _exponential),
    "normal": ((2,), _normal),
    "lognormal2": ((2,), _lognormal2),
}


def parsear(texto: str) -> Distribucion:
    """Interpreta una expresion tipo ``uniform(3,5)`` y devuelve la distribucion."""
    if isinstance(texto, (int, float)):
        texto = f"constant({texto})"
    if not isinstance(texto, str):
        raise ErrorDistribucion(f"Se esperaba texto o numero, llego {type(texto)!r}")

    coincidencia = _PATRON.match(texto)
    if not coincidencia:
        raise ErrorDistribucion(
            f"No entiendo la distribucion {texto!r}. "
            f"Formato esperado: nombre(arg1,arg2,...). "
            f"Disponibles: {', '.join(sorted(_REGISTRO))}"
        )

    nombre = coincidencia.group(1).lower()
    crudo = coincidencia.group(2).strip()
    try:
        args = tuple(float(p) for p in crudo.split(",")) if crudo else ()
    except ValueError as exc:
        raise ErrorDistribucion(f"Argumentos no numericos en {texto!r}") from exc

    if nombre not in _REGISTRO:
        raise ErrorDistribucion(
            f"Distribucion desconocida {nombre!r} en {texto!r}. "
            f"Disponibles: {', '.join(sorted(_REGISTRO))}"
        )

    aridades, constructor = _REGISTRO[nombre]

    # FlexSim permite un argumento final de 'stream'; se descarta.
    if len(args) not in aridades and len(args) - 1 in aridades:
        args = args[:-1]

    # exponential(media) es el atajo de exponential(0, media).
    if nombre == "exponential" and len(args) == 1:
        args = (0.0, args[0])

    if len(args) not in aridades:
        raise ErrorDistribucion(
            f"{nombre} espera {' o '.join(str(n) for n in aridades)} argumentos, "
            f"llegaron {len(args)} en {texto!r}"
        )

    if nombre in ("uniform", "duniform") and args[0] > args[1]:
        raise ErrorDistribucion(f"En {texto!r} el minimo es mayor que el maximo")
    if nombre == "triangular" and not (args[0] <= args[1] <= args[2]):
        raise ErrorDistribucion(
            f"En {texto!r} se espera minimo <= moda <= maximo (orden de FlexSim)"
        )

    return Distribucion(
        texto=texto.strip(),
        nombre=nombre,
        argumentos=args,
        _muestreador=constructor(args),
    )
