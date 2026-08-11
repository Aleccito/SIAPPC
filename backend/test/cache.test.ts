import { after, before, describe, it } from "node:test";
import { setTimeout as sleep } from "node:timers/promises";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";
import { redis } from "../src/lib/redis.ts";
import {
  authHeader,
  closeConnections,
  flushRedis,
  loginAsAdmin,
  resetDatabase,
} from "./helpers.ts";

// SENSORS_CACHE_TTL=1 en .env.test para que la prueba de expiración no tarde
// diez segundos.
const TTL_SECONDS = 1;

// Inserta una lectura saltándose MQTT: lo que se prueba es la caché de lectura,
// no la ingesta.
async function insertReading(value: number): Promise<void> {
  const dispositivo = await prisma.dispositivo.upsert({
    where: { codigo: "TEST-01" },
    create: { hospital_id: 1, codigo: "TEST-01" },
    update: {},
    select: { dispositivo_id: true },
  });

  const sensor = await prisma.sensor.upsert({
    where: {
      dispositivo_id_variable_medida: {
        dispositivo_id: dispositivo.dispositivo_id,
        variable_medida: "hr",
      },
    },
    create: {
      dispositivo_id: dispositivo.dispositivo_id,
      variable_medida: "hr",
      unidad: "bpm",
    },
    update: { unidad: "bpm" },
    select: { sensor_id: true },
  });

  await prisma.lectura.create({
    data: {
      sensor_id: sensor.sensor_id,
      valor: value,
      // El índice único es sobre el hash; con uno distinto por lectura no se
      // descartan como reenvíos.
      hash_sha256: value.toString().padStart(64, "0"),
    },
  });
}

describe("caché de /sensors", () => {
  let app: FastifyInstance;
  let token: string;

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    token = await loginAsAdmin(app);
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  it("la primera consulta deja la respuesta en Redis con TTL", async () => {
    await insertReading(70);

    const res = await app.inject({
      method: "GET",
      url: "/sensors/readings?limit=5",
      headers: authHeader(token),
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().length, 1);

    const key = "siappc-cache:readings:limit=5";
    // La escritura de caché no bloquea la respuesta, así que puede llegar un
    // instante después.
    await sleep(50);
    assert.ok(await redis!.get(key), "no se guardó la respuesta en Redis");

    const ttl = await redis!.ttl(key);
    assert.ok(ttl > 0 && ttl <= TTL_SECONDS, `TTL fuera de rango: ${ttl}`);
  });

  it("sirve el valor cacheado aunque la base ya haya cambiado", async () => {
    await insertReading(88);

    // Dentro del TTL: la lectura nueva no debe aparecer todavía.
    const cached = await app.inject({
      method: "GET",
      url: "/sensors/readings?limit=5",
      headers: authHeader(token),
    });
    assert.equal(cached.json().length, 1);

    // Pasado el TTL la entrada caduca sola: no hay invalidación explícita, que
    // es la decisión de diseño que esto fija.
    await sleep((TTL_SECONDS + 0.3) * 1000);
    const fresh = await app.inject({
      method: "GET",
      url: "/sensors/readings?limit=5",
      headers: authHeader(token),
    });
    assert.equal(fresh.json().length, 2);
  });

  it("el orden de los parámetros no cambia la clave", async () => {
    await flushRedis();
    await app.inject({
      method: "GET",
      url: "/sensors/readings?device=TEST-01&limit=3",
      headers: authHeader(token),
    });
    await app.inject({
      method: "GET",
      url: "/sensors/readings?limit=3&device=TEST-01",
      headers: authHeader(token),
    });
    await sleep(50);

    const keys = await redis!.keys("siappc-cache:readings:*");
    assert.equal(keys.length, 1, `esperaba una sola clave, hay ${keys.length}: ${keys.join(", ")}`);
  });

  it("lecturas y alertas no comparten entrada", async () => {
    await flushRedis();
    await app.inject({
      method: "GET",
      url: "/sensors/readings?limit=9",
      headers: authHeader(token),
    });
    await app.inject({
      method: "GET",
      url: "/sensors/alerts?limit=9",
      headers: authHeader(token),
    });
    await sleep(50);

    assert.equal((await redis!.keys("siappc-cache:readings:limit=9")).length, 1);
    assert.equal((await redis!.keys("siappc-cache:alerts:limit=9")).length, 1);
  });
});
