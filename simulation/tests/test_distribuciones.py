import random

import pytest

from siappc.distribuciones import ErrorDistribucion, parsear


def test_sintaxis_de_flexsim_se_interpreta_igual():
    d = parsear("uniform(3,5)")
    assert d.nombre == "uniform"
    assert d.media_teorica() == 4.0


def test_acepta_el_argumento_stream_de_flexsim_y_lo_ignora():
    """FlexSim escribe uniform(3,5,1); el tercer argumento es el stream."""
    assert parsear("uniform(3,5,1)").argumentos == (3.0, 5.0)


def test_exponential_admite_la_forma_corta_y_la_de_flexsim():
    assert parsear("exponential(360)").media_teorica() == 360.0
    assert parsear("exponential(0,360)").media_teorica() == 360.0


def test_triangular_usa_el_orden_minimo_moda_maximo():
    d = parsear("triangular(20,45,120)")
    assert d.argumentos == (20.0, 45.0, 120.0)
    rng = random.Random(1)
    muestras = [d.muestrear(rng) for _ in range(5000)]
    assert 20 <= min(muestras) and max(muestras) <= 120
    assert abs(sum(muestras) / len(muestras) - d.media_teorica()) < 3


def test_lognormal2_respeta_la_media_pedida():
    d = parsear("lognormal2(2880,2160)")
    rng = random.Random(7)
    muestras = [d.muestrear(rng) for _ in range(20000)]
    assert abs(sum(muestras) / len(muestras) - 2880) < 120
    assert min(muestras) > 0


def test_duniform_da_enteros():
    d = parsear("duniform(3,15)")
    rng = random.Random(3)
    muestras = {d.muestrear(rng) for _ in range(500)}
    assert all(float(m).is_integer() for m in muestras)
    assert min(muestras) >= 3 and max(muestras) <= 15


def test_nunca_devuelve_tiempos_negativos():
    d = parsear("normal(1,50)")
    rng = random.Random(11)
    assert all(d.muestrear(rng) >= 0 for _ in range(2000))


def test_un_numero_suelto_es_una_constante():
    assert parsear(12).muestrear(random.Random()) == 12


@pytest.mark.parametrize(
    "texto",
    ["uniform(5,3)", "triangular(50,10,20)", "inventada(1,2)", "uniform(3)", "no es una dist"],
)
def test_configuraciones_invalidas_fallan_con_mensaje_claro(texto):
    with pytest.raises(ErrorDistribucion):
        parsear(texto)
