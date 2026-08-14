# SIAPPC — simulación en código del flujo de politraumatizados

Modelo de eventos discretos en Python que **replica el Process Flow construido en
FlexSim** para el flujo del paciente politraumatizado con triaje rojo del
Hospital Santo Tomás. No sustituye a FlexSim: es su gemelo de verificación.

Sirve para dos cosas que en FlexSim son caras o imposibles:

1. **Verificación cruzada.** Dos implementaciones independientes de la misma
   lógica. Si dan lo mismo, la lógica está bien implementada. Si no, hay un
   error en alguno de los dos y sabemos dónde buscar.
2. **Barrido de escenarios.** 30 réplicas de 5 escenarios corren en 85 segundos
   y quedan en MariaDB con sus intervalos de confianza. A mano, en FlexSim, eso
   son horas de clics.

---

> **¿Solo quieres usarlo?** Ve a **[`GUIA_DE_USO.md`](GUIA_DE_USO.md)**: el paso
> a paso de qué correr, qué abrir y qué mirar. Este README explica cómo está
> construido por dentro.

## Arranque rápido

El simulador vive dentro del Compose del repo, así que **todos los comandos se
lanzan desde la raíz**, no desde esta carpeta.

```bash
docker compose up -d mariadb
docker compose --profile sim run --rm sim escenarios --replicas 30
```

Eso corre el escenario base y los cuatro de `config/escenarios/`, y deja los
resultados en la base `siappc_sim`. Para mirarlos a mano, Adminer:

```bash
docker compose --profile sim up -d adminer
```

Queda en **http://localhost:8081** — servidor `mariadb`, base `siappc_sim`, y el
usuario y la contraseña del `.env` de la raíz (`DB_USER` / `DB_PASSWORD`).

El contenedor `sim` termina cuando acaba: es un simulador por lotes, no un
servicio. Que salga con código 0 es lo normal, y por eso está en un perfil
aparte: `docker compose up` levanta el hospital sin volver a simular.

Para correr cosas sueltas:

```bash
docker compose --profile sim run --rm sim correr --config config/base.yaml --replicas 50
docker compose --profile sim run --rm sim comparar --metrica tiempo_sistema_medio
docker compose --profile sim run --rm sim parametros --detalle
docker compose --profile sim run --rm sim verificar
```

### En qué base escribe

En `siappc_sim`, **no** en `siappc`. Mismo servidor MariaDB, esquema aparte: los
dos declaran una tabla `paciente` con columnas que no tienen nada que ver, y un
resultado de simulación es sintético y desechable, así que no le tocan los
respaldos ni la retención de la base clínica. El razonamiento completo está en
[`db/init/00-base-sim.sh`](db/init/00-base-sim.sh).

La base se crea sola la primera vez que MariaDB arranca con el volumen vacío. Si
tu volumen ya existía, hay que crearla una vez a mano; el comando está en ese
mismo archivo.

### Sin Docker

```bash
pip install -r requirements.txt
PYTHONPATH=src python -m siappc correr --sin-bd     # solo CSV
PYTHONPATH=src python -m pytest                      # las pruebas
```

---

## Qué hay dentro

```
config/base.yaml              todos los parámetros, cada uno con su fuente declarada
config/escenarios/*.yaml      escenarios que heredan del base y solo pisan lo que cambia
src/siappc/modelo.py          el motor: espejo bloque a bloque del Process Flow
src/siappc/kpis.py            indicadores, calculados sobre la bitácora
src/siappc/bd.py              esquema de MariaDB
db/vistas.sql                 vistas de análisis (se recrean en cada corrida)
db/init/00-base-sim.sh        crea `siappc_sim` al primer arranque de MariaDB
tests/                        54 pruebas de verificación
salidas/<escenario>/*.csv     los mismos datos, para Excel o R
```

El `docker-compose.yml` y el `.env.example` propios ya no están: sus servicios
viven en el Compose de la raíz (`sim` y `adminer`, perfil `sim`) y sus variables
en el `.env` de la raíz. Tener dos stacks era tener dos MariaDB con el mismo
`container_name`, que no pueden estar levantadas a la vez.

## Cómo se lee un resultado

Todo entra por **`v_resumen_escenario`** (una fila por escenario) y sigue por
**`v_cuellos_botella`** (ranking de zonas por espera). Después:

| Vista | Para qué |
|---|---|
| `v_resumen_escenario` | Los seis números de cabecera de cada escenario |
| `v_cuellos_botella` | Qué zona hace esperar más, con su utilización al lado |
| `v_zonas` | Utilización, cola, espera y pico de ocupación por zona |
| `v_actividades` | Espera y servicio por actividad (separa Rx de FAST) |
| `v_kpi_escenario` | Todo, con media, desviación e intervalo de confianza |
| `v_parametros_fuente` | Cuántos parámetros son datos reales y cuántos supuestos |
| `v_serie_zona` | Ocupación y cola a lo largo del tiempo, para graficar |
| `v_recorrido_paciente` | El recorrido de un paciente concreto, paso a paso |
| `v_utilizacion_sql` | La utilización recalculada en SQL puro, para auditar |

Ejemplo:

```sql
SELECT * FROM v_cuellos_botella WHERE escenario = 'base' ORDER BY puesto;
```

**Cómo se lee `utilizacion_pct` en un servicio de trauma:** alto es malo. Una
sala de reanimación al 90% no es eficiente, es una sala sin reserva para el
siguiente paciente crítico. Esa es la diferencia entre un modelo de fábrica y
uno de urgencias.

---

## Power BI

Las once vistas son la superficie de lectura, y sirven igual para Adminer que
para Power BI: **Obtener datos → MySQL database**, servidor `localhost:3306`
(el `DB_PORT` del `.env`), base `siappc_sim`, usuario y contraseña del `.env`.

Qué cargar, para un informe que se entienda:

| Vista | Papel en el informe |
|---|---|
| `v_resumen_escenario` | Tabla de hechos principal: una fila por escenario |
| `v_cuellos_botella` | El gráfico de barras que contesta "¿dónde duele?" |
| `v_zonas` | Detalle por zona: utilización, cola, espera, pico |
| `v_kpi_escenario` | Media, desviación e IC 95 % de cada métrica |
| `v_serie_zona` | Serie temporal de ocupación y cola |
| `v_parametros_fuente` | La diapositiva de honestidad: cuántos números son supuestos |

Tres cosas que conviene saber antes de armar el informe:

- **El conector de MySQL de Power BI es solo modo Import**, no soporta
  DirectQuery. Da igual: estas vistas son cientos de filas, no millones. El
  volumen crudo (`evento`, `ocupacion`) se queda en la base, que es donde debe
  estar.
- **Un solo servidor para los dos informes.** `siappc` y `siappc_sim` están en
  la misma MariaDB, así que un informe puede llevar datos clínicos y de
  simulación con una conexión y un gateway. Lo que no debe hacer es mezclarlos
  en la misma tabla: no son el mismo paciente ni el mismo mundo.
- **`v_kpi_escenario` trae `ic95_inf` e `ic95_sup`.** Úsalos. Una diferencia
  entre escenarios cuyos intervalos se solapan no es un hallazgo, es ruido, y un
  gráfico de barras sin bigotes la presenta como si lo fuera.

Si prefieres no darle a Power BI acceso a la base, `siappc exportar` vuelca esas
mismas vistas a CSV en `salidas/`, y `--sin-bd` corre el modelo sin MariaDB.

---

## Correspondencia con el modelo de FlexSim

| Bloque de FlexSim | Dónde está en el código |
|---|---|
| Fuente Entre llegadas | `llegadas.entre_llegadas` en el YAML |
| Crear objeto + Asignar atributos | `Modelo._llegada_de_pacientes` |
| Demora (sin restricción) | `Modelo._demora` |
| Zona de entrada / Zona de salida | `Modelo._adquirir` / `Modelo._liberar` |
| Zona (capacidad) | `simpy.Resource` con `capacity` |
| Decidir (2 salidas) | `Modelo._decidir` |
| Decidir (3 salidas) | `Modelo._elegir_lesion` |
| Destruir objeto | `Modelo._salir` |
| Mover objeto | *no se implementa*: es representación 3D, no lógica |

Los tiempos se escriben con **la misma sintaxis de FlexSim** (`uniform(3,5)`,
`triangular(20,45,120)`, `exponential(360)`), incluido el argumento de *stream*,
que se acepta y se ignora. Se pueden copiar y pegar entre los dos modelos sin
traducir nada.

---

## De dónde salen los números

Cada parámetro del YAML declara su fuente. `siappc parametros` lo resume:

```
supuesto        22   44.0 %
modelo_actual   16   32.0 %
encuesta         7   14.0 %
estimado         5   10.0 %
dato_real        0    0.0 %
```

**Ningún parámetro es todavía un dato real del hospital.** El modelo sirve para
comparar escenarios entre sí, no para afirmar cuánto tarda de verdad un paciente
en el Santo Tomás. Para eso hacen falta, en orden de importancia:

1. Tasa de llegadas de politraumatizados rojos por día y por hora.
2. Distribución de rutas: qué proporción es estable, cuántos operan, cuántos van
   a UCI.
3. Estancias reales de UCI, hospitalización y rehabilitación.
4. Volumen de pacientes **no traumatizados** que compiten por TAC, quirófano y
   UCI. Sin esto el TAC parece libre casi siempre, que es lo que hoy pasa.

---

## Reproducibilidad

- Cada paciente lleva su propio generador de números aleatorios, derivado de
  `(semilla, número de paciente)`. El paciente 42 de la réplica 3 tiene la misma
  edad, los mismos tiempos y las mismas decisiones **en todos los escenarios**;
  lo único que cambia entre escenarios es la congestión. Es la técnica de
  números aleatorios comunes, y hace que las diferencias se detecten con menos
  réplicas.
- La configuración completa ya resuelta se guarda en la tabla `escenario`, junto
  con su huella `hash_config`. Una corrida se puede repetir sin depender de los
  archivos del disco.
- Misma semilla, mismo resultado, siempre. Hay una prueba que lo comprueba.

---

## Verificación

```bash
PYTHONPATH=src python -m pytest        # 54 pruebas
PYTHONPATH=src python -m siappc verificar
```

Lo que se comprueba:

- Ninguna zona supera nunca su capacidad.
- El paciente estable recorre las cuatro paradas diagnósticas; el inestable pasa
  por exactamente una intervención crítica y no entra a diagnóstico.
- Quien muere en UCI no continúa a hospitalización.
- Más capacidad nunca alarga la cola (prueba de monotonía).
- Se cumple la ley de Little: cola media = espera media × tasa.
- La utilización calculada en Python coincide con la recalculada en SQL puro
  (`v_utilizacion_sql`), hasta el decimal.
- Los resultados no cambian según cuándo pase el recolector de basura de Python
  (esto fue un error real durante el desarrollo, y ahora tiene su propia prueba).

Verificar no es validar. Todo esto comprueba que el modelo hace lo que dijimos
que hace. Que además se parezca al hospital es otra cosa, y necesita datos.
