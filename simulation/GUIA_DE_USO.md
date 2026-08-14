# Guía de uso — paso a paso

Esta guía es el **flujo de trabajo**: qué correr, qué abrir, qué mirar y qué
archivos tocar. Para entender cómo está construido el modelo por dentro, ese es
el `README.md`.

```
   editas config/base.yaml
            │
            ▼
   docker compose --profile sim run --rm sim escenarios
            │
            ├──▶ terminal: dos tablas de resumen  (mirada rápida)
            ├──▶ Adminer:  localhost:8081          (análisis en SQL)
            └──▶ salidas/: archivos CSV            (Excel, informe)
            │
            ▼
   comparas contra la corrida anterior
```

---

# PARTE 1 — La primera vez

## Paso 1. Requisitos

- **Docker Desktop** instalado y abierto
- **Internet** solo la primera vez (descarga ~1 GB de imágenes)
- ~2 GB libres de disco

No necesitas instalar Python, ni MariaDB, ni ninguna librería. Todo va dentro
de los contenedores.

## Paso 2. Arrancar

El simulador es parte del Compose del repo. **Todos los comandos van desde la
raíz del repositorio**, no desde `simulation/`.

```bash
docker compose up -d mariadb
docker compose --profile sim run --rm sim escenarios --replicas 30
docker compose --profile sim up -d adminer
```

La primera línea levanta la base; la segunda corre los cinco escenarios; la
tercera deja el cliente SQL en http://localhost:8081.

`--profile sim` no es opcional: sin él, Compose no sabe que estos dos servicios
existen. Están en un perfil aparte a propósito, para que `docker compose up`
levante el hospital sin volver a simular en cada reinicio.

El `.env` de la raíz sí es **obligatorio** (lo entrega Ing. Adrian). El
simulador usa de ahí `DB_USER`, `DB_PASSWORD` y `SIM_DB_NAME`.

Si al correr aparece un error de permisos escribiendo en `salidas/`, la carpeta
existe pero pertenece a root: `sudo chown -R "$USER" simulation/salidas`. El
contenedor corre como usuario sin privilegios y no puede escribir en una carpeta
de root. Es un error tonto que cuesta media hora entender.

## Paso 3. Qué vas a ver

```
siappc-mariadb  | mariadbd: ready for connections
siappc-sim      | Escenario: base  (SIAPPC - modelo espejo del Process Flow actual)
siappc-sim      |   horizonte 129,600 min | calentamiento 21,600 min | replicas 30
siappc-sim      |   parametros: supuesto=22, modelo_actual=16, encuesta=7, estimado=5
siappc-sim      |   replica   1/30  pacientes= 346  eventos=  5387   0.12s
siappc-sim      |   replica   2/30  pacientes= 378  eventos=  5886   0.10s
...
```

Y al terminar cada escenario, dos tablas:

```
                   Resumen del escenario 'base'
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Indicador                           ┃     Media ┃       IC 95% ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
│ Pacientes atendidos                 │    267.60 │    +/- 16.10 │
│ Tiempo en el sistema (media, min)   │  9,816.38 │ +/-   290.15 │
...
                 Zonas ordenadas por espera media
│ ZonaRehabilitacion │ 15 │ 77.98 │ 680.5 │ 2054.2 │ 22 │ 0.32 │
│ ZonaUCI            │  8 │ 70.16 │ 261.4 │ 1816.3 │ 25 │ 0.60 │
...
```

**Esas dos tablas ya son un resultado usable.** Si solo quieres una mirada
rápida, no hace falta abrir nada más.

Al final verás:

```
siappc-sim exited with code 0
```

**Eso es correcto, no es un error.** El simulador es un proceso por lotes: hace
su trabajo y termina. MariaDB y Adminer se quedan corriendo.

Tarda entre 2 y 3 minutos la primera vez (casi todo es descarga). Las siguientes,
unos 90 segundos.

---

# PARTE 2 — Ver los resultados

## Paso 4. Abrir Adminer

Ve a **http://localhost:8081** y entra con:

| Campo | Valor |
|---|---|
| Motor de base de datos | MySQL / MariaDB |
| **Servidor** | `mariadb` |
| Usuario | el `DB_USER` del `.env` de la raíz |
| Contraseña | el `DB_PASSWORD` del `.env` de la raíz |
| **Base de datos** | `siappc_sim` |

⚠️ Dos errores comunes al entrar la primera vez:

- En "Servidor" va **`mariadb`**, no `localhost`. Adminer vive dentro de la red
  de Docker y llama a la base por su nombre de servicio.
- La base es **`siappc_sim`**, no `siappc`. `siappc` es la base clínica del
  hospital y ahí no hay ni un resultado de simulación. Están separadas a
  propósito: ver `db/init/00-base-sim.sh`.

Y el puerto es 8081, no 8080: el 8080 lo ocupa el tablero del hospital.

## Paso 5. Las consultas, en orden

En Adminer, arriba a la izquierda hay un enlace **"Comando SQL"**. Pega ahí.

### 5.1 — La foto general

```sql
SELECT * FROM v_resumen_escenario;
```

Una fila por escenario. Lo primero que hay que mirar. Si dos escenarios dan lo
mismo, ya aprendiste algo (probablemente que el recurso que tocaste no era el
que limita).

### 5.2 — Dónde duele

```sql
SELECT * FROM v_cuellos_botella
WHERE escenario = 'base'
ORDER BY puesto;
```

Ranking de zonas por minutos de espera. **Es la consulta que más vas a usar.**

### 5.3 — El detalle de una zona

```sql
SELECT * FROM v_zonas WHERE escenario = 'base';
```

Utilización, ocupación media y máxima, cola media y máxima, espera media y p95.

### 5.4 — Separar actividades que comparten zona

```sql
SELECT * FROM v_actividades
WHERE escenario = 'base'
ORDER BY espera_media_min DESC;
```

Útil porque Rx y FAST comparten `ZonaRadiologia` y en la vista de zonas se
confunden.

### 5.5 — Comparar dos escenarios cara a cara

```sql
SELECT escenario, zona, utilizacion_pct, espera_media_min
FROM v_zonas
WHERE escenario IN ('base', 'tac_adicional')
  AND zona = 'ZonaTAC';
```

### 5.6 — ¿La diferencia es real o es azar?

```sql
SELECT escenario, media, ic95_inf, ic95_sup
FROM v_kpi_escenario
WHERE metrica = 'tiempo_sistema_medio' AND dimension = 'global';
```

Si los intervalos de confianza de dos escenarios **se solapan**, con esas
réplicas no puedes afirmar que haya diferencia. Es la regla que evita presentar
ruido como hallazgo.

Hay un comando que hace justo esta comparación y te lo dice en palabras:

```bash
docker compose --profile sim run --rm sim comparar --metrica tiempo_sistema_medio
```

### 5.7 — Para el informe: de dónde salen los números

```sql
SELECT * FROM v_parametros_fuente WHERE escenario = 'base';
```

### 5.8 — Verificar un paciente a mano

```sql
SELECT * FROM v_recorrido_paciente
WHERE escenario = 'base' AND replica = 1 AND paciente_idx = 42
ORDER BY secuencia;
```

Esta es muy buena para la defensa: enseñas el recorrido paso a paso de un
paciente concreto y demuestras que sigue la ruta correcta, con sus esperas.

### 5.9 — Auditar el simulador

```sql
SELECT * FROM v_utilizacion_sql WHERE escenario = 'base' AND replica = 1;
```

Recalcula la utilización en SQL puro desde los datos crudos. Debe coincidir con
`v_zonas`. Sirve para demostrar que los indicadores no son una caja negra.

## Paso 6. Sacar los datos a CSV

```bash
docker compose --profile sim run --rm sim exportar
```

Deja las siete vistas principales en `salidas/vistas/*.csv`, listas para Excel o
para pegar en el informe.

---

# PARTE 3 — Trabajar con el modelo

## Paso 7. Qué archivos usarás

### Los que editas

| Archivo | Cuándo |
|---|---|
| **`config/base.yaml`** | Casi siempre: capacidades, tiempos, probabilidades, datos reales |
| `config/escenarios/*.yaml` | Cuando creas un escenario nuevo |

**Y nada más.** No tienes que tocar Python.

### Los que lees

| Archivo | Para qué | Tamaño (30 réplicas) |
|---|---|---|
| `salidas/vistas/*.csv` | Los resultados ya resumidos | pequeño |
| `salidas/<esc>/kpi.csv` | Indicadores réplica por réplica | ~340 KB |
| `salidas/<esc>/pacientes.csv` | Un paciente por fila, con ruta y desenlace | ~1,7 MB |
| `salidas/<esc>/parametros.csv` | Tabla de procedencias para el anexo | ~10 KB |
| `salidas/<esc>/series.csv` | Ocupación en el tiempo, para graficar | ~550 KB |
| `docs/propuesta.md` | Texto listo para el informe | — |

`eventos.csv` (~13 MB) y `ocupaciones.csv` (~4,5 MB) son los datos crudos. Están
por trazabilidad; no los vas a abrir salvo que quieras auditar algo a mano.

### Los que no tocas nunca

`src/`, `db/`, `Dockerfile`, `docker-compose.yml`, `tests/`. Son la maquinaria.

## Paso 8. Cambiar un parámetro

Abres `config/base.yaml`, buscas lo que quieres cambiar y editas. Ejemplo, si
consigues el dato real de llegadas:

```yaml
llegadas:
  entre_llegadas:
    dist: "exponential(290)"
    fuente: dato_real                     # <-- cambia también esto
    nota: "Registro de urgencias HST, ene-jun 2026: 4.96 activaciones/dia"
```

**Cambia siempre la `fuente` junto con el valor.** Es lo que separa un modelo
defendible de uno que presenta supuestos como hechos. Las fuentes válidas están
listadas al principio del archivo.

No hace falta reconstruir la imagen: la carpeta `config/` está montada desde tu
disco, el contenedor ve el cambio al instante.

## Paso 9. Crear un escenario nuevo

Crea `config/escenarios/mi_escenario.yaml`:

```yaml
extiende: ../base.yaml

meta:
  nombre: "Escenario: cuarta camilla de shock room"
  descripcion: "Que pasa si se habilita una camilla mas en shock room"

zonas:
  ZonaShockRoom:
    capacidad: 4
    fuente: supuesto
    nota: "Se prueba una camilla adicional sobre las 3 actuales"
```

Solo escribes lo que cambia; todo lo demás lo hereda del base. Y ya está: el
comando `escenarios` lo recoge solo, no hay que registrarlo en ningún lado.

Escribe siempre en la cabecera del archivo **qué pregunta intenta responder ese
escenario y qué esperas ver**. Cuando vuelvas en tres semanas te lo vas a
agradecer, y sirve tal cual para el informe.

## Paso 10. El ciclo normal

```bash
# 1. editas un YAML

# 2. corres (reutiliza la base ya levantada, no uses 'up')
docker compose --profile sim run --rm sim escenarios --replicas 30

# 3. recargas Adminer y vuelves a v_cuellos_botella

# 4. compruebas si la diferencia es real
docker compose --profile sim run --rm sim comparar --metrica tiempo_sistema_medio
```

---

# PARTE 4 — Todos los comandos

```bash
docker compose --profile sim run --rm sim <comando>
```

| Comando | Qué hace |
|---|---|
| `escenarios --replicas 30` | Corre el base y todos los de `config/escenarios/` |
| `correr --config config/base.yaml` | Corre uno solo |
| `correr --config X --replicas 50 --etiqueta prueba1` | Con nombre propio en la BD |
| `correr --sin-bd` | Solo CSV, sin tocar la base de datos |
| `correr --sin-eventos` | No guarda la bitácora cruda (base más ligera) |
| `comparar --metrica tiempo_sistema_medio` | Compara escenarios con sus IC |
| `exportar` | Vuelca las vistas a CSV |
| `parametros --detalle` | Lista los 50 parámetros con su fuente |
| `verificar` | Pruebas de coherencia del modelo |
| `esquema` | Imprime el DDL de la base de datos |

Y de Docker:

```bash
docker compose ps                          # qué está corriendo
docker compose --profile sim logs -f sim   # ver la salida del simulador
docker compose stop adminer                # apaga solo el cliente SQL
```

⚠️ **`docker compose down -v` ya no es una forma de "empezar de cero".** Ese
volumen ahora también tiene la base clínica del hospital: borrarlo se lleva
pacientes, usuarios y auditoría por delante. Para reiniciar solo la simulación:

```sql
DROP DATABASE siappc_sim;
CREATE DATABASE siappc_sim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

y vuelve a correr `escenarios`: el simulador recrea sus tablas y sus vistas al
arrancar. (Tras el `DROP` hay que devolver el permiso al usuario de la
aplicación; el `GRANT` está en `db/init/00-base-sim.sh`.)

---

# PARTE 5 — Cómo leer los números

Tres cosas que se malinterpretan fácil:

**Utilización alta es MALA en trauma.** Un shock room al 90 % no es eficiente:
es un shock room sin reserva para el siguiente paciente crítico. Esta es la
diferencia entre un modelo de fábrica y uno de urgencias, y conviene decirlo
explícitamente en el informe.

**`espera_media` incluye los ceros.** Es el promedio sobre *todas* las veces que
alguien pidió la zona, contando como cero las que no esperaron. Es la definición
estándar de tiempo en cola. Si quieres "cuánto espera el que espera", esa es
`espera_media_si_espera`, y sale mucho más alta.

**Espera alta con utilización baja significa otra cosa.** No es falta de
recurso: es que las llegadas vienen a ráfagas, o que hay una demora ciega
metiendo tiempo que no depende de ningún recurso. En este modelo,
`Espera_Especialista` y `Espera_Quirofano` son exactamente eso.

---

# PARTE 6 — Qué NO puedes concluir todavía

Es importante tenerlo claro antes de escribir el informe:

- **Ningún tiempo absoluto.** Cero parámetros son datos reales del hospital.
  Puedes decir "el escenario A tarda X % más que el B", no "un paciente tarda
  9 816 minutos en el Santo Tomás".
- **Nada sobre el TAC.** Sale al 5,9 % de utilización porque en el modelo solo lo
  usan 4 politraumatizados al día. En el hospital lo comparte todo urgencias. El
  modelo no incluye esa demanda, así que no puede opinar sobre si hace falta un
  segundo tomógrafo.
- **Nada sobre mortalidad.** La muerte en UCI entra como un parámetro fijo
  (15 %). El simulador no la predice: la reproduce. Presentarla como resultado
  sería un error grave.
- **Nada sobre especialistas.** La espera está modelada como demora ciega, así
  que el modelo es estructuralmente incapaz de evaluar esa medida hasta que se
  corrija.

Lo que sí puedes afirmar: cómo se comporta el sistema modelado, qué recurso cede
primero bajo presión, y cuánto cambian los resultados al mover cada palanca.

---

# PARTE 7 — Si algo falla

| Síntoma | Qué pasa | Solución |
|---|---|---|
| `no such service: sim` | Te faltó el perfil | `docker compose --profile sim run --rm sim ...` |
| `port is already allocated` | Ya usas el 8081 o el 3306 | Cambia `ADMINER_PORT` o `DB_PORT` en el `.env` de la raíz |
| `Permission denied` al escribir CSV | La carpeta `salidas/` la creó root | `sudo chown -R "$USER" simulation/salidas` |
| Adminer: "no se puede conectar" | Pusiste `localhost` como servidor | Escribe `mariadb` |
| Adminer entra pero no hay vistas | Estás en la base `siappc` | Cambia a `siappc_sim` |
| `Unknown database 'siappc_sim'` | Tu volumen de MariaDB es anterior a esto, y el script de init solo corre con el volumen vacío | Créala a mano una vez: el comando está en `db/init/00-base-sim.sh` |
| `siappc-sim exited with code 0` | Nada, terminó bien | No es un error |
| "Sin base de datos. Se continúa solo con CSV" | El simulador no alcanzó MariaDB | `docker compose ps` para ver si está arriba |
| Los resultados no cambian al editar el YAML | Editaste el archivo equivocado, o el escenario hereda el valor del base | `parametros --detalle` te dice el valor que se está usando |
| Quiero empezar de cero | | `DROP DATABASE siappc_sim` — **no** `docker compose down -v`, que borra también la base del hospital |

Si tienes que reconstruir la imagen (solo si tocas código Python):

```bash
docker compose --profile sim build --no-cache sim
```

---

# Resumen en cinco líneas

```bash
docker compose up -d mariadb                          # la base, una vez
docker compose --profile sim up -d adminer            # el cliente SQL, una vez
docker compose --profile sim run --rm sim escenarios  # cada vez que simulas
# abre localhost:8081 → servidor: mariadb, base: siappc_sim, usuario y clave del .env
# consulta: SELECT * FROM v_cuellos_botella WHERE escenario='base' ORDER BY puesto;
```
