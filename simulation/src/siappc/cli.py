"""Interfaz de linea de comandos de SIAPPC.

    siappc correr        una configuracion, N replicas
    siappc escenarios    el base y todos los escenarios de una carpeta
    siappc comparar      compara escenarios ya guardados en la base de datos
    siappc parametros    inventario de parametros y su procedencia
    siappc verificar     pruebas de coherencia del modelo, sin escribir nada
    siappc esquema       DDL de referencia de la base de datos
    siappc esperar-bd    espera a que MariaDB acepte conexiones
"""

from __future__ import annotations

import math
import statistics
import time
from pathlib import Path

import typer
from rich.console import Console
from rich.table import Table

from . import bd, exportar
from .config import ErrorConfig, cargar
from .kpis import calcular, max_simultaneos, series
from .modelo import correr_replica

app = typer.Typer(add_completion=False, help="Simulador del flujo de politraumatizados (SIAPPC)")
consola = Console()

METRICAS_RESUMEN = (
    ("pacientes_atendidos", "Pacientes atendidos"),
    ("throughput_dia", "Pacientes por dia"),
    ("tiempo_sistema_medio", "Tiempo en el sistema (media, min)"),
    ("tiempo_sistema_p95", "Tiempo en el sistema (p95, min)"),
    ("espera_total_media", "Espera acumulada por paciente (min)"),
    ("pacientes_en_sistema_final", "Pacientes dentro al terminar"),
)


def _ic95(valores: list[float]) -> tuple[float, float]:
    """Media y semiancho del intervalo de confianza al 95%."""
    if not valores:
        return 0.0, 0.0
    m = statistics.fmean(valores)
    if len(valores) < 2:
        return m, 0.0
    s = statistics.stdev(valores)
    return m, 1.96 * s / math.sqrt(len(valores))


def _tabla_resumen(titulo: str, por_metrica: dict[str, list[float]]) -> Table:
    tabla = Table(title=titulo, header_style="bold")
    tabla.add_column("Indicador")
    tabla.add_column("Media", justify="right")
    tabla.add_column("IC 95%", justify="right")
    for clave, etiqueta in METRICAS_RESUMEN:
        valores = por_metrica.get(clave, [])
        m, h = _ic95(valores)
        tabla.add_row(etiqueta, f"{m:,.2f}", f"+/- {h:,.2f}")
    return tabla


def _tabla_zonas(por_zona: dict[str, dict[str, list[float]]]) -> Table:
    tabla = Table(title="Zonas ordenadas por espera media", header_style="bold")
    tabla.add_column("Zona")
    tabla.add_column("Cap.", justify="right")
    tabla.add_column("Utilizacion %", justify="right")
    tabla.add_column("Espera media (min)", justify="right")
    tabla.add_column("Espera p95 (min)", justify="right")
    tabla.add_column("% que espera", justify="right")
    tabla.add_column("Cola media", justify="right")
    orden = sorted(
        por_zona.items(),
        key=lambda kv: statistics.fmean(kv[1].get("espera_media", [0.0])),
        reverse=True,
    )
    for zona, metricas in orden:
        def m(clave: str) -> float:
            return statistics.fmean(metricas.get(clave, [0.0]))

        tabla.add_row(
            zona,
            f"{m('capacidad'):.0f}",
            f"{m('utilizacion'):.1f}",
            f"{m('espera_media'):.1f}",
            f"{m('espera_p95'):.1f}",
            f"{100 * m('prop_con_espera'):.0f}",
            f"{m('cola_media'):.2f}",
        )
    return tabla


def _ejecutar(
    ruta_config: str,
    etiqueta: str | None,
    replicas: int | None,
    semilla: int | None,
    usar_bd: bool,
    guardar_eventos: bool,
    carpeta_csv: str,
) -> None:
    try:
        cfg = cargar(ruta_config)
    except ErrorConfig as exc:
        consola.print(f"[bold red]Configuracion invalida:[/] {exc}")
        raise typer.Exit(code=2)

    if replicas is not None:
        cfg.simulacion.replicas = replicas
    if semilla is not None:
        cfg.simulacion.semilla = semilla
    nombre = etiqueta or Path(ruta_config).stem

    consola.print(f"[bold]Escenario:[/] {nombre}  ({cfg.nombre})")
    consola.print(
        f"  horizonte {cfg.simulacion.horizonte:,.0f} min "
        f"| calentamiento {cfg.simulacion.calentamiento:,.0f} min "
        f"| replicas {cfg.simulacion.replicas} | semilla {cfg.simulacion.semilla}"
    )
    conteo = cfg.inventario.conteo_por_fuente()
    consola.print("  parametros: " + ", ".join(f"{k}={v}" for k, v in conteo.items()))

    motor = None
    escenario_id = None
    if usar_bd:
        try:
            motor = bd.motor()
            bd.crear_esquema(motor)
            bd.crear_vistas(motor)
            escenario_id = bd.registrar_escenario(motor, cfg, nombre)
        except Exception as exc:
            consola.print(f"[yellow]Sin base de datos ({exc}). Se continua solo con CSV.[/]")
            motor = None

    exportar.exportar_parametros(carpeta_csv, nombre, cfg)
    for archivo in ("pacientes.csv", "eventos.csv", "ocupaciones.csv", "kpi.csv", "series.csv"):
        ruta = Path(carpeta_csv) / nombre / archivo
        if ruta.exists():
            ruta.unlink()

    por_metrica: dict[str, list[float]] = {}
    por_zona: dict[str, dict[str, list[float]]] = {}
    t_total = time.perf_counter()

    for replica in range(1, cfg.simulacion.replicas + 1):
        t0 = time.perf_counter()
        reg = correr_replica(cfg, replica)
        kpis = calcular(cfg, reg)
        modo = cfg.simulacion.guardar_series
        muestras = (
            series(cfg, reg)
            if modo == "todas" or (modo == "primera_replica" and replica == 1)
            else []
        )
        segundos = time.perf_counter() - t0

        for k in kpis:
            if k.dimension == "global":
                por_metrica.setdefault(k.metrica, []).append(k.valor)
            elif k.dimension == "zona":
                por_zona.setdefault(k.entidad, {}).setdefault(k.metrica, []).append(k.valor)

        if motor is not None and escenario_id is not None:
            bd.guardar_corrida(
                motor, escenario_id, cfg, reg, kpis, muestras, segundos, guardar_eventos
            )
        exportar.exportar_replica(carpeta_csv, nombre, cfg, reg, kpis, muestras)

        consola.print(
            f"  replica {replica:>3}/{cfg.simulacion.replicas}  "
            f"pacientes={len(reg.pacientes):>4}  eventos={len(reg.eventos):>6}  "
            f"{segundos:5.2f}s"
        )

    consola.print()
    consola.print(_tabla_resumen(f"Resumen del escenario '{nombre}'", por_metrica))
    consola.print(_tabla_zonas(por_zona))
    consola.print(
        f"[green]Listo[/] en {time.perf_counter() - t_total:.1f}s. "
        f"CSV en {Path(carpeta_csv) / nombre}"
        + ("" if motor is None else "  |  datos en MariaDB")
    )


@app.command()
def correr(
    config: str = typer.Option("config/base.yaml", "--config", "-c", help="Archivo YAML"),
    etiqueta: str = typer.Option(None, "--etiqueta", "-e", help="Nombre del escenario en la BD"),
    replicas: int = typer.Option(None, "--replicas", "-r", help="Sobrescribe las replicas"),
    semilla: int = typer.Option(None, "--semilla", "-s", help="Sobrescribe la semilla"),
    sin_bd: bool = typer.Option(False, "--sin-bd", help="No escribir en MariaDB"),
    sin_eventos: bool = typer.Option(
        False, "--sin-eventos", help="No guardar la bitacora de eventos en la BD"
    ),
    salidas: str = typer.Option("salidas", "--salidas", help="Carpeta para los CSV"),
) -> None:
    """Corre una configuracion y guarda resultados."""
    _ejecutar(config, etiqueta, replicas, semilla, not sin_bd, not sin_eventos, salidas)


@app.command()
def escenarios(
    base: str = typer.Option("config/base.yaml", "--base", help="Configuracion base"),
    carpeta: str = typer.Option("config/escenarios", "--carpeta", help="Carpeta de escenarios"),
    replicas: int = typer.Option(None, "--replicas", "-r"),
    sin_bd: bool = typer.Option(False, "--sin-bd"),
    sin_eventos: bool = typer.Option(False, "--sin-eventos"),
    salidas: str = typer.Option("salidas", "--salidas"),
) -> None:
    """Corre el escenario base y todos los de la carpeta, uno tras otro."""
    rutas = [base] + sorted(str(p) for p in Path(carpeta).glob("*.yaml"))
    for ruta in rutas:
        consola.rule(Path(ruta).stem)
        _ejecutar(ruta, None, replicas, None, not sin_bd, not sin_eventos, salidas)


@app.command()
def comparar(
    referencia: str = typer.Option("base", "--referencia", help="Escenario de referencia"),
    metrica: str = typer.Option(
        "tiempo_sistema_medio", "--metrica", help="Metrica global a comparar"
    ),
) -> None:
    """Compara escenarios ya guardados contra uno de referencia."""
    from sqlalchemy import text

    motor = bd.motor()
    with motor.connect() as con:
        filas = con.execute(
            text(
                "SELECT escenario, media, ic95_inf, ic95_sup, replicas, unidad "
                "FROM v_kpi_escenario WHERE metrica = :m AND dimension = 'global' "
                "ORDER BY escenario"
            ),
            {"m": metrica},
        ).fetchall()

    if not filas:
        consola.print(f"[yellow]No hay resultados guardados para la metrica '{metrica}'.[/]")
        raise typer.Exit(code=1)

    base_fila = next((f for f in filas if f[0] == referencia), None)
    tabla = Table(title=f"Comparacion de escenarios - {metrica}", header_style="bold")
    tabla.add_column("Escenario")
    tabla.add_column("Media", justify="right")
    tabla.add_column("IC 95%", justify="right")
    tabla.add_column("Dif. vs referencia", justify="right")
    tabla.add_column("Traslape de IC", justify="center")

    for f in filas:
        escenario, m, inf, sup, _reps, _uni = f
        if base_fila is None or escenario == referencia:
            dif, traslape = "-", "-"
        else:
            delta = m - base_fila[1]
            pct = 100 * delta / base_fila[1] if base_fila[1] else 0.0
            dif = f"{delta:+,.2f} ({pct:+.1f}%)"
            hay_traslape = not (sup < base_fila[2] or inf > base_fila[3])
            traslape = "si" if hay_traslape else "NO"
        tabla.add_row(escenario, f"{m:,.2f}", f"[{inf:,.2f} ; {sup:,.2f}]", dif, traslape)

    consola.print(tabla)
    consola.print(
        "[dim]'Traslape de IC = NO' indica una diferencia que no se explica solo "
        "por el azar de las replicas. 'si' significa que con estas replicas no se "
        "puede afirmar que haya diferencia.[/]"
    )


@app.command("exportar")
def exportar_vistas(
    salidas: str = typer.Option("salidas/vistas", "--salidas", help="Carpeta destino"),
) -> None:
    """Vuelca las vistas de analisis de MariaDB a archivos CSV."""
    try:
        hechas = exportar.exportar_vistas(bd.motor(), salidas)
    except Exception as exc:
        consola.print(f"[red]No se pudo leer la base de datos:[/] {exc}")
        raise typer.Exit(code=1)
    if not hechas:
        consola.print(
            "[yellow]No se exporto nada. Puede que todavia no haya corridas guardadas.[/]"
        )
        raise typer.Exit(code=1)
    for vista in hechas:
        consola.print(f"  {vista}.csv")
    consola.print(f"[green]{len(hechas)} vistas exportadas a[/] {salidas}")


@app.command()
def parametros(
    config: str = typer.Option("config/base.yaml", "--config", "-c"),
    detalle: bool = typer.Option(False, "--detalle", help="Listar parametro por parametro"),
) -> None:
    """Muestra de donde sale cada numero del modelo."""
    cfg = cargar(config)
    conteo = cfg.inventario.conteo_por_fuente()
    total = sum(conteo.values())

    tabla = Table(title=f"Procedencia de los parametros - {Path(config).name}", header_style="bold")
    tabla.add_column("Fuente")
    tabla.add_column("Parametros", justify="right")
    tabla.add_column("%", justify="right")
    for fuente, n in conteo.items():
        tabla.add_row(fuente, str(n), f"{100 * n / total:.1f}")
    tabla.add_row("[bold]TOTAL[/]", f"[bold]{total}[/]", "100.0")
    consola.print(tabla)

    if detalle:
        detalle_tabla = Table(header_style="bold")
        detalle_tabla.add_column("Parametro")
        detalle_tabla.add_column("Valor")
        detalle_tabla.add_column("Fuente")
        for p in cfg.inventario.items:
            detalle_tabla.add_row(p.ruta, p.valor_texto, p.fuente)
        consola.print(detalle_tabla)

    reales = conteo.get("dato_real", 0)
    if reales == 0:
        consola.print(
            "[yellow]Aviso: ningun parametro esta marcado como dato_real. "
            "El modelo sirve para comparar escenarios entre si, no para afirmar "
            "tiempos absolutos del hospital.[/]"
        )


@app.command()
def verificar(
    config: str = typer.Option("config/base.yaml", "--config", "-c"),
    replicas: int = typer.Option(3, "--replicas", "-r"),
) -> None:
    """Corre pruebas de coherencia del modelo sin guardar nada."""
    cfg = cargar(config)
    cfg.simulacion.replicas = replicas
    fallos: list[str] = []
    consola.print(f"[bold]Verificando[/] {config} con {replicas} replicas cortas")

    for replica in range(1, replicas + 1):
        reg = correr_replica(cfg, replica)
        terminados = [p for p in reg.pacientes if p.t_salida is not None]

        if not reg.pacientes:
            fallos.append(f"replica {replica}: no llego ningun paciente")
            continue
        for p in terminados:
            if p.desenlace not in ("alta", "alta_directa", "muerte"):
                fallos.append(f"replica {replica}: desenlace invalido {p.desenlace!r}")
                break
            if p.t_salida is not None and p.t_salida < p.t_llegada:
                fallos.append(f"replica {replica}: paciente {p.indice} sale antes de llegar")
                break

        for e in reg.eventos:
            if not (e.t_solicitud <= e.t_inicio <= e.t_fin):
                fallos.append(f"replica {replica}: tiempos incoherentes en {e.actividad}")
                break

        for zona, capacidad in cfg.capacidades.items():
            usos = [(o.t_inicio, o.t_fin) for o in reg.ocupaciones if o.zona == zona]
            pico = max_simultaneos(usos, 0.0, cfg.simulacion.horizonte)
            if pico > capacidad:
                fallos.append(
                    f"replica {replica}: {zona} llego a {pico} pacientes con capacidad {capacidad}"
                )

        # Ley de Little aplicada a la cola: cola_media = espera_media x tasa.
        # Es una comprobacion independiente de que los indicadores estan bien
        # calculados; si falla, el error esta en kpis.py, no en el modelo.
        kpis = calcular(cfg, reg)
        por_zona: dict[str, dict[str, float]] = {}
        for k in kpis:
            if k.dimension == "zona":
                por_zona.setdefault(k.entidad, {})[k.metrica] = k.valor
        ventana = cfg.simulacion.ventana
        for zona, m in por_zona.items():
            esperado = m["espera_media"] * m["n_atenciones"] / ventana
            # La tolerancia es amplia a proposito: en los bordes de la ventana
            # las dos formas de medir no pueden coincidir exactamente (hay
            # esperas que empiezan antes del calentamiento y otras que siguen
            # abiertas al cerrar). Lo que se comprueba es que no haya un error
            # de calculo, no que cuadre al decimal.
            if abs(esperado - m["cola_media"]) > 0.05 + 0.15 * max(esperado, m["cola_media"]):
                fallos.append(
                    f"replica {replica}: {zona} se aleja de la ley de Little "
                    f"(cola_media={m['cola_media']:.3f}, esperado={esperado:.3f})"
                )

        # Todo paciente estable debe pasar por las cuatro paradas diagnosticas.
        for p in terminados:
            if not p.estable:
                continue
            actividades = {e.actividad for e in reg.eventos_de(p.indice)}
            faltan = {"laboratorios", "rx_torax_pelvis", "fast", "tac"} - actividades
            if faltan:
                fallos.append(
                    f"replica {replica}: paciente estable {p.indice} no paso por {faltan}"
                )
                break

    if fallos:
        for f in fallos:
            consola.print(f"[red]FALLA[/] {f}")
        raise typer.Exit(code=1)
    consola.print("[green]Todo bien:[/] rutas validas, capacidades respetadas, tiempos coherentes.")


@app.command()
def esquema(
    salida: str = typer.Option(None, "--salida", help="Archivo donde escribir el DDL"),
) -> None:
    """Imprime el DDL de referencia (tablas y vistas)."""
    vistas = bd.ruta_vistas()
    texto = bd.ddl_texto()
    if vistas is not None:
        texto += "\n\n-- ----- vistas -----\n" + vistas.read_text(encoding="utf-8")
    if salida:
        Path(salida).write_text(texto, encoding="utf-8")
        consola.print(f"DDL escrito en {salida}")
    else:
        print(texto)


@app.command("esperar-bd")
def esperar_bd(
    intentos: int = typer.Option(30, "--intentos"),
    pausa: float = typer.Option(2.0, "--pausa"),
) -> None:
    """Espera a que MariaDB responda (util al arrancar con Docker)."""
    bd.esperar_bd(intentos=intentos, pausa=pausa)
    consola.print("[green]Base de datos lista.[/]")


def main() -> None:  # pragma: no cover
    app()


if __name__ == "__main__":  # pragma: no cover
    main()
