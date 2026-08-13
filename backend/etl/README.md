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

## La agregación ocurre DENTRO de la base

Antes se traían las lecturas crudas a Node para reducirlas aquí. Con una lectura
por segundo y por sensor, eso es mover millones de renglones por la red para
escribir unos cientos: el trabajo real es la agregación, y se hace junto al dato.

Hoy cada proceso son dos sentencias desde [`run.ts`](run.ts):

1. Un `$queryRaw` de resumen que saca las tres cifras de la ventana —cuántas
   filas caen dentro, cuántos buckets resultan y la última fecha realmente
   procesada—.
2. Un `$executeRaw` que llama al procedimiento que agrega.

| Proceso | Procedimiento | Escribe en |
|---|---|---|
| `lecturas_hora` | `sp_etl_lecturas_hora(desde, hasta)` | `lectura_hora` |
| `alertas_dia` | `sp_etl_alertas_dia(desde, hasta)` | `alerta_dia` |
| poda (no es un proceso de `etl_ejecucion`) | `sp_purgar_lecturas(dias, lote)` | borra de `lectura` |

Los tres viven en [`../db/extra.sql`](../db/extra.sql), con su migración en
`prisma/migrations/`.

**Por qué `$executeRaw` y no `$queryRaw`:** los tres escriben y no devuelven
filas. Un `CALL` que sí devuelve resultados no sirve desde Node — el adaptador de
MariaDB entrega esas filas sin nombres de columna, y por eso los informes de la
API consultan **vistas** (`v_rep_actividad_clinica`, `v_dim_paciente`) y no
procedimientos.

**Por qué el conteo de buckets no sale del `CALL`:** `ON DUPLICATE KEY UPDATE`
informa 1 al insertar y 2 al actualizar, así que reprocesar una ventana ya
cargada diría el doble de filas escritas. De ahí el `SELECT` de resumen aparte.

**Aviso de zona horaria:** dentro de la base la hora se trunca con la zona de la
**sesión** de MariaDB; en Node se truncaba con la del proceso. Si backend y base
corren con zonas distintas, los buckets salen desplazados. En Compose las dos
son UTC.

[`transform.ts`](transform.ts) sigue existiendo y no es código muerto:
`agruparLecturasPorHora` y `contarAlertasPorDia` son la misma regla escrita en
TypeScript, y son lo que comprueban las pruebas unitarias sin necesidad de base.

> **Ya no hay `extract.ts` ni `load.ts`.** El paso a los procedimientos dejó sin
> uso las dos mitades que rodeaban a la transformación —la extracción por lotes
> con Prisma y la carga por tandas con `upsert`—, y se borraron en lugar de
> quedar como referencia: el historial de git ya cumple ese papel. Los tipos
> `LecturaCruda` y `AlertaCruda`, que eran lo único vivo de `extract.ts`,
> pasaron a `transform.ts`, su único consumidor.

[`run.ts`](run.ts) orquesta y escribe el resultado en `etl_ejecucion`.
[`scheduler.ts`](scheduler.ts) lo dispara cada hora y, después, poda.

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
- **La marca es la última fecha realmente procesada**, no `NOW()`. Entre la
  consulta de resumen y el final pueden entrar lecturas nuevas por MQTT; darlas
  por procesadas las perdería para siempre. La ventana se cierra en esa marca, y
  lo que llegue mientras corre el procedimiento queda para la próxima vuelta.

## Poda de lecturas crudas

`lectura` crece una fila por segundo y por sensor: con diez sensores son 864 000
filas al día. Una vez que la hora está en `lectura_hora`, la fila cruda no la
consulta nadie —el tablero lee las últimas por índice, y los informes leen el
agregado—.

`ETL_RETENCION_DIAS` fija cuántos días de lecturas crudas se conservan.

**`0` es el valor por defecto y significa que no se borra nada.** Es deliberado:
la poda destruye datos, y eso se enciende a mano en cada institución, no al
desplegar. Un valor que no sea un entero >= 0 apaga el planificador al arrancar.

Solo afecta a `lectura`. Los agregados de `lectura_hora` y `alerta_dia` no se
tocan nunca: son los que sostienen los informes y Power BI.

`sp_purgar_lecturas(dias, lote)` no borra una fila salvo que se cumplan las tres
condiciones:

1. es más antigua que `dias`;
2. su bucket horario **existe** en `lectura_hora`;
3. si disparó alertas, el día de esas alertas ya está contado en `alerta_dia`.
   Sin esto la poda las borraría de rebote: `alerta` cuelga de `lectura` con
   `ON DELETE CASCADE`, y el histórico de alertas se perdería.

Se poda **después** de agregar, no antes: ese orden es lo que garantiza que
ninguna lectura desaparezca sin haber entrado en su bucket. El procedimiento lo
comprueba de todos modos, pero invertir el orden dejaría cada corrida podando la
ventana anterior.

El borrado va en lotes de 5000 filas por llamada (`LOTE_PURGA` en
`scheduler.ts`): un `DELETE` de millones de renglones bloquea la tabla y deja la
ingesta MQTT esperando. Una base muy atrasada necesita varias corridas para
ponerse al día.

## Uso

```bash
cd backend

node --env-file=.env etl/run.ts                 # los dos procesos, incremental
node --env-file=.env etl/run.ts lecturas_hora   # solo uno
node --env-file=.env etl/run.ts --completo      # reprocesa todo desde cero
node --env-file=.env etl/scheduler.ts           # el planificador, en primer plano
```

Sale con código distinto de cero si algún proceso falló.

`etl/` entra en el `include` de `backend/tsconfig.json`, así que
`npm run typecheck` también comprueba estos archivos. Antes quedaban fuera y un
error de tipos aquí no lo veía nadie hasta ejecutarlo.

## Automatización

El servicio `etl` de `docker-compose.yml` corre `etl/scheduler.ts` con la misma
imagen del backend. Cada hora al minuto `:05` (`ETL_MINUTO`), más una corrida al
arrancar para ponerse al día si el contenedor estuvo caído. Recibe también
`ETL_RETENCION_DIAS` (`0` por defecto, o sea sin poda).

El minuto no es `:00` a propósito: a la hora en punto el bucket recién cerrado
todavía recibe lecturas atrasadas desde el buffer local de las Raspberry.

La programación va **dentro del contenedor**, no en el cron del anfitrión:
`docker compose up` tiene que dejar el sistema completo funcionando sin que nadie
edite un crontab, y así queda versionada junto al código que dispara.

## Qué se ve desde la aplicación

`GET /reports` devuelve las últimas corridas de `etl_ejecucion`, que es lo que
lista la pantalla de Reportes: proceso, fuente, estado (`ready` / `running` /
`failed`), cuándo, filas leídas y escritas, y el error si lo hubo.

La misma pantalla descarga `GET /reports/actividad-clinica.csv`, que **no** sale
del datamart: se calcula en vivo sobre la vista `v_rep_actividad_clinica`. El ETL
agrega telemetría; la actividad clínica se cuenta sobre las notas SOAP.

## Límites conocidos

- **El grano es fijo**: hora para lecturas, día para alertas. No hay rollup a
  día/semana; si un reporte lo necesita, sale de sumar `lectura_hora`.
- **La ventana no tiene tope de filas.** El procedimiento agrega de una vez todo
  lo que caiga entre la marca de agua y la última fecha vista, así que una base
  muy atrasada hace una sentencia larga en lugar de varias corridas cortas.
- **No hay borrado de agregados** cuando se podan lecturas crudas, y es a
  propósito: el agregado es justamente lo que queda. `sp_purgar_lecturas` se
  niega a borrar cualquier fila cuyo bucket no exista ya.
- **Una sola instancia.** Dos planificadores corriendo a la vez escribirían los
  mismos buckets y se bloquearían entre ellos. No hay lock distribuido.
