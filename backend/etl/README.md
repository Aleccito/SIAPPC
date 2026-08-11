# Proceso ETL

Extrae de las tablas operativas, agrega, y carga en un datamart que consultan la
pantalla de Reportes y Power BI.

## Por qué existe

`lectura` crece **una fila por segundo y por sensor**. Con diez sensores son
~26 millones de filas al mes. Una pregunta de tablero como *"promedio de SpO2 por
hora del último mes"* barre esos millones cada vez que alguien abre la pantalla;
contra el agregado son unos cientos de filas.

El ETL paga ese costo **una vez por hora, en un proceso aparte**, en lugar de
pagarlo en cada visita y dentro del proceso que atiende la API.

## Las tres fases

| Fase | Archivo | Qué hace |
|---|---|---|
| **Extract** | [`extract.ts`](extract.ts) | Lee `lectura` y `alerta` desde la marca de agua, con tope de 200 000 filas por lote. |
| **Transform** | [`transform.ts`](transform.ts) | Agrupa en buckets: lecturas por sensor+hora (mín/máx/promedio/muestras), alertas por día+sensor+severidad. Funciones puras, sin base de datos. |
| **Load** | [`load.ts`](load.ts) | Upsert en `lectura_hora` y `alerta_dia`, en tandas de 500 dentro de transacción. |

[`run.ts`](run.ts) orquesta las tres y escribe el resultado en `etl_ejecucion`.
[`scheduler.ts`](scheduler.ts) lo dispara cada hora.

## Modelo del datamart

```
lectura ──┐
          ├─→ lectura_hora   (sensor_id, hora)            PK = el bucket
alerta  ──┘   alerta_dia     (dia, sensor_id, severidad)  PK = el bucket

              etl_ejecucion  (proceso, estado, marca_hasta, filas, error)
```

La llave primaria de las tablas de agregados **es el bucket**, no un
autoincrement. Esa decisión es la que hace el proceso repetible: cargar dos veces
la misma hora reemplaza su fila en vez de duplicarla.

## Incremental e idempotente

La marca de agua es `marca_hasta` de la última corrida `completado`. Cada corrida
arranca en el **inicio del bucket** de esa marca, no en la marca exacta: si la
anterior cortó a las 14:37, esa hora quedó a medias, y se vuelve a leer completa
para recalcularla.

Consecuencias buscadas:

- **Repetir una corrida no ensucia nada.** Es lo que permite reparar una ventana
  sin borrar tablas a mano.
- **Un fallo no avanza la marca.** El renglón queda en `fallido` y la siguiente
  corrida reintenta la misma ventana.
- **La marca es la última fecha realmente procesada**, no `NOW()`. Entre el
  extract y el update pueden entrar lecturas nuevas por MQTT; darlas por
  procesadas las perdería para siempre.

## Uso

```bash
cd backend

node --env-file=.env etl/run.ts                 # los dos procesos, incremental
node --env-file=.env etl/run.ts lecturas_hora   # solo uno
node --env-file=.env etl/run.ts --completo      # reprocesa todo desde cero
node --env-file=.env etl/scheduler.ts           # el planificador, en primer plano
```

Sale con código distinto de cero si algún proceso falló.

## Automatización

El servicio `etl` de `docker-compose.yml` corre `etl/scheduler.ts` con la misma
imagen del backend. Cada hora al minuto `:05` (`ETL_MINUTO`), más una corrida al
arrancar para ponerse al día si el contenedor estuvo caído.

El minuto no es `:00` a propósito: a la hora en punto el bucket recién cerrado
todavía recibe lecturas atrasadas desde el buffer local de las Raspberry.

La programación va **dentro del contenedor**, no en el cron del anfitrión:
`docker compose up` tiene que dejar el sistema completo funcionando sin que nadie
edite un crontab, y así queda versionada junto al código que dispara.

## Qué se ve desde la aplicación

`GET /reports` devuelve las últimas corridas de `etl_ejecucion`, que es lo que
lista la pantalla de Reportes: proceso, fuente, estado (`ready` / `running` /
`failed`), cuándo, filas leídas y escritas, y el error si lo hubo.

## Límites conocidos

- **El grano es fijo**: hora para lecturas, día para alertas. No hay rollup a
  día/semana; si un reporte lo necesita, sale de sumar `lectura_hora`.
- **Un lote son 200 000 filas.** Una base muy atrasada necesita varias corridas
  seguidas para ponerse al día. Cada una avanza la marca, así que no se repite
  trabajo, pero el datamart no está completo hasta que alcanza.
- **No hay borrado de agregados** cuando se borran lecturas crudas. Hoy no se
  borran: `lectura` solo crece.
- **Una sola instancia.** Dos planificadores corriendo a la vez escribirían los
  mismos buckets y se bloquearían entre ellos. No hay lock distribuido.
