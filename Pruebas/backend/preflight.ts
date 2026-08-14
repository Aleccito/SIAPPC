import { connect } from "node:net";

// Comprobación previa a `npm test`.
//
// La suite necesita MariaDB y Redis alcanzables DESDE EL HOST, y el
// docker-compose.yml normal no publica el puerto de Redis a propósito: solo lo
// hace el override de pruebas. Olvidarlo no daba un error, daba un cuelgue mudo
// —diez minutos sin una sola línea de salida— y desde fuera eso se parece a una
// prueba lenta o a un interbloqueo en el código, que es donde se acaba
// buscando. De ahí este archivo: convertir esa espera en un mensaje.
//
// No importa nada de `backend/src`. Abrir el módulo de Prisma o el de ioredis
// para preguntarles si están conectados es justo lo que puede colgarse, y
// entonces la comprobación tendría el mismo problema que viene a resolver. Un
// socket TCP con temporizador propio no depende de nada.
//
// No se llama `*.test.ts` a propósito: el patrón de `npm test` es
// `../Pruebas/backend/*.test.ts` y este archivo no debe entrar en la suite.

const TIMEOUT_MS = 2000;

type Servicio = { nombre: string; host: string; puerto: number; arreglo: string };

/** ¿Hay algo escuchando? Solo eso: ni credenciales ni versión ni esquema. */
function alcanzable(host: string, puerto: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host, port: puerto });
    // `once` en los tres y `destroy` siempre: sin esto un servicio caído deja el
    // socket a medio abrir y el proceso no termina, que es el fallo que este
    // archivo existe para evitar.
    const terminar = (ok: boolean) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(TIMEOUT_MS);
    socket.once("connect", () => terminar(true));
    socket.once("timeout", () => terminar(false));
    socket.once("error", () => terminar(false));
  });
}

const COMPOSE =
  "docker compose -f docker-compose.yml -f docker-compose.test.yml up -d";

const servicios: Servicio[] = [];

// MariaDB. El docker-compose.yml principal ya publica su puerto, así que aquí
// lo normal es que falle por estar todo apagado.
servicios.push({
  nombre: "MariaDB",
  host: process.env.DB_HOST ?? "127.0.0.1",
  puerto: Number(process.env.DB_PORT ?? 3306),
  arreglo: `Levanta la base:  ${COMPOSE}`,
});

// Redis. `REDIS_URL` es obligatoria: helpers.ts lanza si falta, pero lo hace ya
// dentro de la primera prueba y el mensaje se pierde entre la salida del
// runner.
const url = process.env.REDIS_URL;
if (!url) {
  console.error(
    "\nFalta REDIS_URL en backend/.env.test.\n" +
      "Cópiala del ejemplo y usa el REDIS_PASSWORD del .env de la raíz.\n",
  );
  process.exit(1);
}

let redisUrl: URL;
try {
  redisUrl = new URL(url);
} catch {
  console.error(`\nREDIS_URL no es una URL válida: ${url}\n`);
  process.exit(1);
}

servicios.push({
  nombre: "Redis",
  host: redisUrl.hostname,
  puerto: Number(redisUrl.port || 6379),
  // El motivo más probable de que Redis no responda y MariaDB sí: se levantó
  // Compose sin el override, que es lo único que publica este puerto.
  arreglo:
    `Redis solo publica su puerto con el override de pruebas:\n    ${COMPOSE}\n` +
    "    (el docker-compose.yml a secas lo deja solo en la red interna)",
});

const resultados = await Promise.all(
  servicios.map(async (s) => ({ ...s, ok: await alcanzable(s.host, s.puerto) })),
);

const caidos = resultados.filter((r) => !r.ok);
if (caidos.length === 0) process.exit(0);

console.error("\nLas pruebas del backend no pueden arrancar:\n");
for (const s of caidos) {
  console.error(`  ✖ ${s.nombre} no responde en ${s.host}:${s.puerto}`);
  console.error(`    ${s.arreglo}\n`);
}
process.exit(1);
