"""Pruebas de verificacion del modelo.

Verificar no es lo mismo que validar. Aqui se comprueba que el modelo hace lo
que dijimos que hace (rutas correctas, capacidades respetadas, resultados
reproducibles). Que ademas se parezca al Hospital Santo Tomas es otra cosa, y
esa no se puede probar con pytest: hace falta el registro del hospital.
"""

import copy
import gc

import pytest

from siappc.config import cargar, desde_dict
from siappc.kpis import calcular, max_simultaneos, series
from siappc.modelo import correr_replica


@pytest.fixture(scope="module")
def cfg_corta():
    """Configuracion corta para que las pruebas no tarden."""
    cfg = cargar("config/base.yaml")
    cfg.simulacion.horizonte = 20000
    cfg.simulacion.calentamiento = 2000
    return cfg


@pytest.fixture(scope="module")
def registro(cfg_corta):
    return correr_replica(cfg_corta, 1)


def test_la_misma_semilla_da_exactamente_el_mismo_resultado(cfg_corta):
    a = correr_replica(cfg_corta, 1)
    b = correr_replica(cfg_corta, 1)
    assert len(a.pacientes) == len(b.pacientes)
    assert [e.t_fin for e in a.eventos] == [e.t_fin for e in b.eventos]


def test_replicas_distintas_dan_resultados_distintos(cfg_corta):
    a = correr_replica(cfg_corta, 1)
    b = correr_replica(cfg_corta, 2)
    assert [p.t_llegada for p in a.pacientes] != [p.t_llegada for p in b.pacientes]


def test_la_bitacora_no_cambia_despues_de_cerrada(cfg_corta):
    """Los procesos a medias no deben anadir filas al recolectarse la basura.

    Es la prueba de un error real que tuvo este modelo: los bloques finally de
    los procesos abandonados se ejecutaban tarde y descuadraban los indicadores
    respecto a lo guardado en la base de datos.
    """
    reg = correr_replica(cfg_corta, 3)
    antes = (len(reg.eventos), len(reg.ocupaciones))
    gc.collect()
    assert (len(reg.eventos), len(reg.ocupaciones)) == antes


def test_nunca_se_supera_la_capacidad_de_una_zona(cfg_corta, registro):
    for zona, capacidad in cfg_corta.capacidades.items():
        usos = [(o.t_inicio, o.t_fin) for o in registro.ocupaciones if o.zona == zona]
        pico = max_simultaneos(usos, 0.0, cfg_corta.simulacion.horizonte)
        assert pico <= capacidad, f"{zona} llego a {pico} con capacidad {capacidad}"


def test_los_tiempos_de_cada_evento_son_coherentes(registro):
    for e in registro.eventos:
        assert e.t_solicitud <= e.t_inicio <= e.t_fin
        assert e.espera >= 0 and e.servicio >= 0


def test_el_paciente_estable_recorre_la_via_diagnostica(registro):
    estables = [p for p in registro.pacientes if p.estable and p.t_salida is not None]
    assert estables, "no hubo pacientes estables terminados"
    for p in estables:
        hechas = {e.actividad for e in registro.eventos_de(p.indice)}
        assert {"laboratorios", "rx_torax_pelvis", "fast", "tac"} <= hechas


def test_el_paciente_inestable_va_a_intervencion_critica_y_no_a_diagnostico(registro):
    inestables = [p for p in registro.pacientes if not p.estable and p.t_salida is not None]
    assert inestables
    criticas = {"control_hemorragias", "lesion_neurologica", "trauma_toracico"}
    for p in inestables:
        hechas = {e.actividad for e in registro.eventos_de(p.indice)}
        assert len(hechas & criticas) == 1, "debe pasar por exactamente una intervencion"
        assert "tac" not in hechas, "el inestable no entra a la via diagnostica"


def test_todos_los_desenlaces_son_validos(registro):
    for p in registro.pacientes:
        if p.t_salida is not None:
            assert p.desenlace in ("alta", "alta_directa", "muerte")
            assert p.t_salida >= p.t_llegada


def test_quien_muere_en_uci_no_sigue_a_hospitalizacion(registro):
    for p in registro.pacientes:
        if p.desenlace == "muerte":
            hechas = {e.actividad for e in registro.eventos_de(p.indice)}
            assert "estancia_uci" in hechas
            assert "hospitalizacion" not in hechas
            assert "rehabilitacion" not in hechas


def test_el_alta_directa_no_pasa_por_uci(registro):
    for p in registro.pacientes:
        if p.desenlace == "alta_directa":
            hechas = {e.actividad for e in registro.eventos_de(p.indice)}
            assert "estancia_uci" not in hechas


def test_sostener_el_shock_room_aumenta_su_ocupacion(cfg_corta):
    """La correccion del hallazgo 5.1 tiene que notarse en la utilizacion."""
    suelto = correr_replica(cfg_corta, 1)

    sostenido = copy.copy(cfg_corta)
    sostenido.sostener_shock_room = True
    retenido = correr_replica(sostenido, 1)

    def minutos(reg):
        return sum(o.uso for o in reg.ocupaciones if o.zona == "ZonaShockRoom")

    assert minutos(retenido) > minutos(suelto) * 2


def test_mas_capacidad_nunca_empeora_la_espera(cfg_corta):
    """Prueba de monotonia: mas recursos no pueden alargar la cola.

    Se usa una demanda alta para que exista cola de verdad; con la demanda base
    casi ninguna zona hace cola y la prueba no probaria nada.
    """
    apretado = copy.copy(cfg_corta)
    apretado.entre_llegadas = cargar("config/escenarios/demanda_alta.yaml").entre_llegadas
    apretado.capacidades = dict(cfg_corta.capacidades)
    apretado.capacidades["ZonaUCI"] = 4

    holgado = copy.copy(apretado)
    holgado.capacidades = dict(apretado.capacidades)
    holgado.capacidades["ZonaUCI"] = 12

    def espera_uci(cfg):
        reg = correr_replica(cfg, 1)
        k = {(x.metrica, x.entidad): x.valor for x in calcular(cfg, reg)}
        return k[("espera_media", "ZonaUCI")]

    assert espera_uci(holgado) <= espera_uci(apretado)


def test_las_series_temporales_respetan_la_capacidad(cfg_corta, registro):
    for m in series(cfg_corta, registro):
        assert 0 <= m.ocupados <= cfg_corta.capacidades[m.zona]
        assert m.en_cola >= 0
