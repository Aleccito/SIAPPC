"""Pruebas de la capa de base de datos.

Corren contra SQLite en memoria para no necesitar MariaDB. Lo que se comprueba
aqui es que el esquema se crea, que se escribe todo lo que hay que escribir y
que los numeros guardados son los mismos que calculo el simulador. Las vistas
SQL solo existen en MariaDB y se saltan a proposito.
"""

import pytest
from sqlalchemy import create_engine, event, func, select

from siappc import bd
from siappc.config import cargar
from siappc.kpis import calcular, series
from siappc.modelo import correr_replica


@pytest.fixture
def motor():
    eng = create_engine("sqlite://")

    # SQLite trae las claves foraneas desactivadas. Se encienden para poder
    # comprobar de verdad que el borrado en cascada del esquema funciona.
    @event.listens_for(eng, "connect")
    def _activar_fk(conexion, _registro):  # pragma: no cover - gancho de sqlite
        conexion.execute("PRAGMA foreign_keys=ON")

    bd.crear_esquema(eng)
    return eng


@pytest.fixture(scope="module")
def corrida():
    cfg = cargar("config/base.yaml")
    cfg.simulacion.horizonte = 20000
    cfg.simulacion.calentamiento = 2000
    reg = correr_replica(cfg, 1)
    return cfg, reg, calcular(cfg, reg), series(cfg, reg)


def test_el_esquema_se_crea_completo(motor):
    from sqlalchemy import inspect

    tablas = set(inspect(motor).get_table_names())
    assert tablas == {
        "escenario",
        "parametro",
        "corrida",
        "paciente",
        "evento",
        "ocupacion",
        "kpi_corrida",
        "serie_zona",
    }


def test_se_guarda_todo_lo_de_una_replica(motor, corrida):
    cfg, reg, kpis, muestras = corrida
    esc = bd.registrar_escenario(motor, cfg, "prueba")
    corrida_id = bd.guardar_corrida(motor, esc, cfg, reg, kpis, muestras, 1.0)

    with motor.connect() as con:
        def cuantos(tabla):
            return con.execute(select(func.count()).select_from(tabla)).scalar_one()

        assert cuantos(bd.paciente) == len(reg.pacientes)
        assert cuantos(bd.evento) == len(reg.eventos)
        assert cuantos(bd.ocupacion) == len(reg.ocupaciones)
        assert cuantos(bd.kpi_corrida) == len(kpis)
        assert cuantos(bd.serie_zona) == len(muestras)
        assert cuantos(bd.parametro) == len(cfg.inventario.items)
        assert corrida_id > 0


def test_los_kpi_guardados_coinciden_con_los_calculados(motor, corrida):
    cfg, reg, kpis, _ = corrida
    esc = bd.registrar_escenario(motor, cfg, "prueba")
    bd.guardar_corrida(motor, esc, cfg, reg, kpis, [], 1.0)

    esperado = {(k.metrica, k.entidad): round(k.valor, 6) for k in kpis}
    with motor.connect() as con:
        filas = con.execute(
            select(bd.kpi_corrida.c.metrica, bd.kpi_corrida.c.entidad, bd.kpi_corrida.c.valor)
        ).fetchall()
    assert {(m, e): round(v, 6) for m, e, v in filas} == esperado


def test_volver_a_registrar_un_escenario_borra_lo_anterior(motor, corrida):
    """Correr dos veces el mismo escenario no debe acumular resultados viejos."""
    cfg, reg, kpis, _ = corrida
    primero = bd.registrar_escenario(motor, cfg, "prueba")
    bd.guardar_corrida(motor, primero, cfg, reg, kpis, [], 1.0)
    bd.registrar_escenario(motor, cfg, "prueba")

    with motor.connect() as con:
        def cuantos(tabla):
            return con.execute(select(func.count()).select_from(tabla)).scalar_one()

        assert cuantos(bd.escenario) == 1
        # El borrado en cascada tiene que haberse llevado corridas, pacientes,
        # eventos y kpi de la vez anterior.
        assert cuantos(bd.corrida) == 0
        assert cuantos(bd.paciente) == 0
        assert cuantos(bd.evento) == 0
        assert cuantos(bd.kpi_corrida) == 0
        # Y los parametros deben ser los de una sola vez, no el doble.
        assert cuantos(bd.parametro) == len(cfg.inventario.items)


def test_se_puede_omitir_la_bitacora_de_eventos(motor, corrida):
    cfg, reg, kpis, _ = corrida
    esc = bd.registrar_escenario(motor, cfg, "prueba")
    bd.guardar_corrida(motor, esc, cfg, reg, kpis, [], 1.0, guardar_eventos=False)
    with motor.connect() as con:
        assert con.execute(select(func.count()).select_from(bd.evento)).scalar_one() == 0
        assert con.execute(select(func.count()).select_from(bd.ocupacion)).scalar_one() > 0


def test_el_separador_de_sentencias_ignora_los_puntos_y_coma_de_comentarios():
    """Error real: un ';' dentro de un comentario partia el SQL por la mitad."""
    sql = """
    -- este comentario tiene un punto y coma; a proposito
    CREATE OR REPLACE VIEW v_a AS SELECT 1;
    CREATE OR REPLACE VIEW v_b AS SELECT 'texto; con punto y coma';
    """
    sentencias = bd.dividir_sentencias(sql)
    assert len(sentencias) == 2
    assert "v_a" in sentencias[0] and "v_b" in sentencias[1]


def test_el_archivo_de_vistas_se_parte_en_sentencias_completas():
    ruta = bd.ruta_vistas()
    assert ruta is not None, "no se encontro db/vistas.sql"
    sentencias = bd.dividir_sentencias(ruta.read_text(encoding="utf-8"))
    assert len(sentencias) >= 10
    for s in sentencias:
        assert "CREATE OR REPLACE VIEW" in s.upper()


def test_las_vistas_se_saltan_en_sqlite(motor):
    assert bd.crear_vistas(motor) == 0
