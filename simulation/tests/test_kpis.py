"""Pruebas de los indicadores.

La idea es comprobar el calculo contra numeros hechos a mano, no contra el
propio simulador: si el modelo y el indicador se equivocan igual, la prueba no
detectaria nada.
"""

import pytest

from siappc.config import cargar
from siappc.kpis import calcular, max_simultaneos, percentil, serie_conteo, solape
from siappc.modelo import correr_replica
from siappc.registro import Ocupacion


def test_solape_recorta_a_la_ventana():
    assert solape(0, 100, 50, 200) == 50  # empieza antes de la ventana
    assert solape(150, 300, 50, 200) == 50  # termina despues
    assert solape(60, 90, 50, 200) == 30  # dentro
    assert solape(0, 40, 50, 200) == 0  # fuera


def test_max_simultaneos_cuenta_bien_los_solapes():
    assert max_simultaneos([(0, 10), (5, 15), (20, 30)], 0, 100) == 2
    assert max_simultaneos([(0, 10), (10, 20)], 0, 100) == 1  # se tocan, no se solapan
    assert max_simultaneos([], 0, 100) == 0
    assert max_simultaneos([(0, 5), (1, 6), (2, 7)], 0, 100) == 3


def test_percentil_conocido():
    datos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    assert percentil(datos, 50) == 5.5
    assert percentil(datos, 0) == 1
    assert percentil(datos, 100) == 10
    assert percentil([], 95) == 0.0


def test_serie_conteo_en_instantes_conocidos():
    serie = dict(serie_conteo([(0, 30), (10, 50)], 0, 60, 10))
    assert serie[0] == 1
    assert serie[10] == 2
    assert serie[30] == 1  # el primero ya cerro
    assert serie[50] == 0


@pytest.fixture(scope="module")
def corrida():
    cfg = cargar("config/base.yaml")
    cfg.simulacion.horizonte = 30000
    cfg.simulacion.calentamiento = 3000
    reg = correr_replica(cfg, 1)
    return cfg, reg, {(k.metrica, k.entidad): k.valor for k in calcular(cfg, reg)}


def test_la_utilizacion_coincide_con_el_calculo_a_mano(corrida):
    cfg, reg, kpi = corrida
    v0, v1 = cfg.simulacion.calentamiento, cfg.simulacion.horizonte
    for zona, capacidad in cfg.capacidades.items():
        ocupado = sum(
            solape(o.t_inicio, o.t_fin, v0, v1) for o in reg.ocupaciones if o.zona == zona
        )
        esperado = 100 * ocupado / (capacidad * (v1 - v0))
        assert kpi[("utilizacion", zona)] == pytest.approx(esperado)


def test_la_utilizacion_nunca_pasa_de_cien(corrida):
    cfg, _, kpi = corrida
    for zona in cfg.capacidades:
        assert 0 <= kpi[("utilizacion", zona)] <= 100


def test_ley_de_little_en_la_cola(corrida):
    """cola media = espera media x tasa de llegada a la zona.

    Es una identidad, no una aproximacion: si falla, el error esta en el calculo
    de los indicadores. Se admite holgura por los bordes de la ventana.
    """
    cfg, _, kpi = corrida
    ventana = cfg.simulacion.ventana
    for zona in cfg.capacidades:
        esperado = kpi[("espera_media", zona)] * kpi[("n_atenciones", zona)] / ventana
        observado = kpi[("cola_media", zona)]
        assert observado == pytest.approx(esperado, abs=0.05, rel=0.15)


def test_las_proporciones_de_desenlace_suman_uno(corrida):
    _, _, kpi = corrida
    total = (
        kpi[("prop_alta", "")] + kpi[("prop_alta_directa", "")] + kpi[("prop_muerte", "")]
    )
    assert total == pytest.approx(1.0)


def test_solo_se_cuentan_los_pacientes_de_la_ventana(corrida):
    cfg, reg, kpi = corrida
    esperado = sum(1 for p in reg.pacientes if p.t_llegada >= cfg.simulacion.calentamiento)
    assert kpi[("pacientes_llegados", "")] == esperado


def test_la_espera_media_incluye_los_ceros():
    """Wq se promedia sobre todas las adquisiciones, no solo sobre las que esperan."""
    from siappc.kpis import media

    esperas = [0.0, 0.0, 0.0, 40.0]
    assert media(esperas) == 10.0
    assert media([x for x in esperas if x > 0]) == 40.0
