# Pruebas

Todo lo que prueba SIAPPC vive aquí. Tres cosas distintas, con propósitos
distintos:

| Carpeta | Qué es | Responde a |
|---|---|---|
| `backend/` | Suite automatizada (`node:test`), 84 pruebas | ¿Las reglas del negocio se sostienen? |
| `postman/` | Colección funcional, 50 peticiones / 143 aserciones | ¿La API cumple su contrato de extremo a extremo? |
| `jmeter/` | Plan de carga | ¿Aguanta con muchos usuarios a la vez? |
| `reportes/` | Salidas generadas. **No se editan a mano.** | |

Las tres necesitan el stack arriba:

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml up -d
```

---

## 1. Suite automatizada

Corre desde `backend/`, porque necesita su `.env.test` y su `node_modules`:

```bash
cd backend && npm test
```

**84 pruebas, 84 pasan.** Cubren autenticación y revocación de sesión, la matriz
de permisos contra `rol_permiso`, el CRUD genérico, la caché de Redis, el límite
de intentos de login, el ETL contra la base, las notas SOAP con su firma, el
expediente, admisión (camas/ingresos/citas), el catálogo de variables y el
aislamiento entre hospitales.

Los archivos viven aquí pero importan el código con rutas relativas
(`../../backend/src/...`). El `package.json` de esta carpeta existe por una sola
razón: Node resuelve los paquetes desde la carpeta del archivo hacia arriba, y
`helpers.ts` importa `mysql2` — sin él, `Pruebas/` no lo encuentra. Todo lo demás
resuelve desde `backend/`.

## 2. Postman

```bash
cd Pruebas && npm run test:postman
```

Corre la colección con Newman —sin abrir Postman— y deja
`reportes/postman.html`. Para trabajar a mano: importar en Postman
`postman/SIAPPC.postman_collection.json` y su `..._environment.json`.

**El orden importa.** `Login` guarda el token en el entorno y el resto lo hereda;
las carpetas de Pacientes y Admisión guardan los identificadores que crean. Se
corre entera de arriba abajo.

Qué cubre, además del camino feliz: `401` sin token y con contraseña incorrecta,
`400` con cuerpo inválido (y que el error traiga las incidencias de zod), `404`
con id inexistente, `409` al duplicar cama y al meter dos pacientes en la misma,
`409` por solape de agenda, `403` cuando la cuenta técnica intenta escribir
contenido clínico, y `401` con el token ya revocado tras cerrar sesión.

Última corrida: **50 peticiones, 143 aserciones, 0 fallos**, 9 s.

## 3. JMeter

```bash
sh Pruebas/jmeter/correr.sh                       # 50 usuarios, 60 s
USUARIOS=200 DURACION=120 sh Pruebas/jmeter/correr.sh
```

Corre en contenedor: **no hace falta Java ni JMeter instalados**. Entra a la red
de Compose y llama al backend por su nombre de servicio, así la medición no pasa
por el reenvío de puertos de Docker Desktop, que añade latencia propia.

Deja `reportes/jmeter/html/index.html` (reporte con gráficas) y
`reportes/jmeter/resultados.jtl` (datos crudos).

### El límite de peticiones, y por qué importa aquí

La primera corrida dio **91% de errores 429**. No era un fallo del plan: es el
techo general de la API —100 peticiones por minuto **y por IP**—. Todos los
usuarios virtuales de JMeter salen de la misma IP, así que comparten un solo
cubo y el limitador responde antes de que se pueda medir nada.

Ese resultado vale por sí mismo: **demuestra que la protección funciona**. Pero
para medir la base de datos hay que subir el techo, y por eso `RATE_LIMIT_MAX`
es ahora configurable. Por defecto vale 100 —el comportamiento de siempre— y
solo se sube para medir:

```bash
# en el .env de la raíz
RATE_LIMIT_MAX=20000
```

### Resultados

50 usuarios, rampa de 15 s, 60 s sostenidos, `RATE_LIMIT_MAX=20000`:

| Endpoint | Muestras | Media | p95 | p99 | Máx |
|---|---:|---:|---:|---:|---:|
| `GET /sensors/readings` (cacheado) | 1296 | 59 ms | 149 | 233 | 295 |
| `GET /dashboard/devices` (subconsulta) | 1262 | 62 ms | 148 | 225 | 298 |
| `GET /patients` (CRUD + COUNT) | 1270 | 66 ms | 155 | 225 | 286 |
| `GET /beds/occupancy` (agregado) | 1281 | 69 ms | 163 | 256 | 301 |

**5110 peticiones, 0 errores, 79 peticiones/s, media 64 ms.**

Lo que se lee de ahí:

- Los cuatro endpoints quedan en la misma banda. Ninguno es el cuello de
  botella; con la base recién sembrada, el trabajo por petición es parecido.
- El pico de 1159 ms es el **login**, y es correcto: bcrypt con 10 rondas está
  hecho para ser lento. Por eso el plan inicia sesión una sola vez y comparte el
  token — si cada usuario virtual iniciara sesión, la prueba mediría bcrypt.
- El p99 en ~230 ms con 50 usuarios concurrentes no es una cifra de capacidad,
  es un punto de comparación para la próxima vez.

### Advertencia sobre estos números

Generador de carga, backend, MariaDB y Redis **comparten la CPU de una sola
máquina**. Estos números sirven para comparar endpoints entre sí, para ver si un
cambio los empeora, y para cumplir el entregable. **No** son la capacidad de un
despliegue real, donde cada pieza tiene su propio servidor.

Además, la base estaba prácticamente vacía. `lectura` crece una fila por segundo
y por sensor; medir de nuevo con millones de filas dará otra cosa, y ese es
justamente el escenario que conviene repetir antes de poner esto en un hospital.
