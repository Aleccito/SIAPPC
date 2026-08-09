# Backend

Base de datos MariaDB en Docker. Todavía no hay API.

Este `docker-compose.yml` levanta **solo** la base, con su propio `.env` local.
Para correr todo el sistema (base + backend + frontend) usa el Compose de la raíz
del repo: ver [../README.md](../README.md). No levantes los dos a la vez, ambos
publican MariaDB en el mismo puerto del host.

## Preparar

```bash
cp .env.example .env
```

Llena `DB_USER`, `DB_PASSWORD` y `DB_ROOT_PASSWORD`. El archivo `.env` está en
`.gitignore` y ahí se queda: nunca se commitea.

```bash
npm install
```

## Levantar

```bash
npm run db:up
```

La primera vez el contenedor aplica `db/schema.sql` automáticamente y crea las 16
tablas, y enseguida `db/seed.sql` con el hospital, los roles y el admin inicial
(`admin@institucion.org` / `Admin12345`, contraseña pública, solo desarrollo).
Tarda unos 30 segundos en quedar sano.

| Comando | Qué hace |
|---|---|
| `npm run db:up` | Levanta MariaDB en segundo plano |
| `npm run db:down` | Apaga el contenedor, conserva los datos |
| `npm run db:reset` | Borra el volumen y arranca de cero |
| `npm run db:logs` | Sigue los logs |
| `npm run migrate` | Aplica `db/schema.sql` contra la base actual |
| `npm run typecheck` | Revisa tipos |

## Migrar

`db/schema.sql` es solo DDL, no crea la base. El nombre sale de `DB_NAME`:
Docker crea la base con `MARIADB_DATABASE` y `migrate.ts` se conecta directo a
ella. Así el nombre vive en un solo lugar, el `.env`.

El esquema se aplica solo en el primer arranque, cuando el volumen está vacío.
Después de eso usa `npm run migrate`, que requiere que la base ya exista.

`migrate` **no es idempotente**: el esquema usa `CREATE TABLE` sin
`IF NOT EXISTS`, así que sobre una base que ya tiene las tablas falla con
`Table 'hospital' already exists`. Eso es correcto, no un bug. Para reconstruir:

```bash
npm run db:reset
```

## Conectarse a mano

```bash
docker exec -it chamba-mariadb mariadb -u root -p
```

## Pendiente

El esquema actual es **ThermoTrace**: sensores, lecturas y alertas. No tiene
tablas para corridas de FlexSim, módulos de atención KY-xxx, estado del paciente
en la fila de servicio, ni contraseña en `usuario`. El frontend espera esas
cosas. Falta decidir si el esquema o el frontend es el que se ajusta.
