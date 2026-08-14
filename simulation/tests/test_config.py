import copy

import pytest
import yaml

from siappc.config import ACTIVIDADES, ZONAS, ErrorConfig, cargar, desde_dict

RUTA_BASE = "config/base.yaml"


@pytest.fixture
def bruto():
    with open(RUTA_BASE, encoding="utf-8") as f:
        return yaml.safe_load(f)


def test_la_configuracion_base_carga_completa():
    cfg = cargar(RUTA_BASE)
    assert set(cfg.capacidades) == set(ZONAS)
    assert set(cfg.duraciones) == set(ACTIVIDADES)
    assert cfg.simulacion.ventana > 0


def test_cada_parametro_declara_su_procedencia():
    cfg = cargar(RUTA_BASE)
    conteo = cfg.inventario.conteo_por_fuente()
    assert conteo.get("sin_declarar", 0) == 0, (
        "Hay parametros escritos en forma corta. En este proyecto todo numero "
        "debe declarar su fuente."
    )
    assert sum(conteo.values()) == len(cfg.inventario.items)


def test_el_escenario_hereda_del_base_y_solo_pisa_lo_que_cambia():
    base = cargar(RUTA_BASE)
    tac = cargar("config/escenarios/tac_adicional.yaml")
    assert tac.capacidades["ZonaTAC"] == 2
    assert base.capacidades["ZonaTAC"] == 1
    # Todo lo demas se hereda intacto.
    otras = {z: c for z, c in tac.capacidades.items() if z != "ZonaTAC"}
    assert otras == {z: c for z, c in base.capacidades.items() if z != "ZonaTAC"}
    assert tac.duraciones["tac"].texto == base.duraciones["tac"].texto


def test_dos_configuraciones_distintas_tienen_hash_distinto():
    assert cargar(RUTA_BASE).hash_config != cargar(
        "config/escenarios/tac_adicional.yaml"
    ).hash_config


def test_falta_una_zona(bruto):
    d = copy.deepcopy(bruto)
    del d["zonas"]["ZonaTAC"]
    with pytest.raises(ErrorConfig, match="Faltan zonas"):
        desde_dict(d)


def test_zona_desconocida(bruto):
    d = copy.deepcopy(bruto)
    d["zonas"]["ZonaInventada"] = {"capacidad": 1, "fuente": "supuesto"}
    with pytest.raises(ErrorConfig, match="no reconocidas"):
        desde_dict(d)


def test_las_ramas_de_lesion_critica_deben_sumar_uno(bruto):
    d = copy.deepcopy(bruto)
    d["decisiones"]["tipo_lesion_critica"]["control_hemorragias"]["p"] = 0.9
    with pytest.raises(ErrorConfig, match="sumar 1"):
        desde_dict(d)


def test_probabilidad_fuera_de_rango(bruto):
    d = copy.deepcopy(bruto)
    d["decisiones"]["requiere_uci"]["p"] = 1.4
    with pytest.raises(ErrorConfig, match="entre 0 y 1"):
        desde_dict(d)


def test_calentamiento_mayor_que_el_horizonte(bruto):
    d = copy.deepcopy(bruto)
    d["simulacion"]["calentamiento"]["valor"] = d["simulacion"]["horizonte"]["valor"]
    with pytest.raises(ErrorConfig, match="calentamiento"):
        desde_dict(d)


def test_fuente_no_admitida(bruto):
    d = copy.deepcopy(bruto)
    d["zonas"]["ZonaTAC"]["fuente"] = "me_lo_dijo_un_amigo"
    with pytest.raises(ErrorConfig, match="no valida"):
        desde_dict(d)
