import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "../../backend/src/generated/prisma/client.ts";
import { countRows, resetDatabase } from "./helpers.ts";
import { closePrisma } from "../../backend/src/lib/prisma.ts";

// El catálogo de variables: la unidad de medida es un dato de la VARIABLE, no
// del sensor.
//
// Lo que se comprueba es el invariante que la normalización compra y que antes
// no existía: dos sensores de la misma variable no pueden reportar unidades
// distintas, porque la unidad ya no se guarda en el sensor. Con la columna
// `sensor.unidad` esto era expresable, y la pantalla de cama pintaba la misma
// constante vital con dos etiquetas según el equipo.

describe("Catálogo de variables", () => {
  before(async () => {
    await resetDatabase();
  });

  after(async () => {
    // Solo Prisma, y no el `closeConnections` de helpers.ts que usan las demás
    // suites: esta no levanta la aplicación ni toca Redis, así que su cliente
    // nunca llega a conectarse y el `quit()` de cierre se queda esperando para
    // siempre —el proceso de pruebas termina los casos y no sale nunca—.
    await closePrisma();
  });

  it("el seed trae las variables que publica la Raspberry, con una unidad cada una", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const variables = await prisma.variable.findMany({ orderBy: { codigo: "asc" } });

    // `pr`, `perfusion` y `resp` entraron al seed con los umbrales
    // configurables: `umbral_alerta` cuelga de esta tabla por clave foránea, así
    // que sin ellas no se pueden sembrar sus bandas. Antes solo aparecían
    // cuando la ingesta recibía su primera lectura y las daba de alta sola.
    //
    // `pr` va en `lpm` como `hr` —es la misma frecuencia por otra vía— aunque el
    // equipo la publique en `bpm`. `ecg` no está: no tiene umbral que sembrar y
    // sigue entrando por el alta automática.
    assert.deepEqual(
      variables.map((v) => [v.codigo, v.unidad]),
      [
        ["hr", "lpm"],
        ["pa", "mmHg"],
        ["perfusion", "%"],
        ["pr", "lpm"],
        ["resp", "rpm"],
        ["spo2", "%"],
        ["temp", "°C"],
      ],
    );
  });

  it("dos sensores de la misma variable comparten unidad porque no la guardan", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");

    // Dos equipos distintos midiendo lo mismo. Antes cada uno traía su columna
    // `unidad` y podían discrepar; ahora la columna no existe y el dato sale
    // del catálogo, así que la coincidencia no depende de quién los dio de alta.
    const equipos = await Promise.all(
      ["VAR-A", "VAR-B"].map((codigo) =>
        prisma.dispositivo.create({
          data: { hospital_id: 1, codigo },
          select: { dispositivo_id: true },
        }),
      ),
    );

    for (const equipo of equipos) {
      await prisma.sensor.create({
        data: { dispositivo_id: equipo.dispositivo_id, variable_medida: "hr" },
      });
    }

    const filas = await prisma.$queryRaw<{ codigo: string; unidad: string }[]>`
      SELECT d.codigo, v.unidad
      FROM sensor s
      JOIN variable v ON v.codigo = s.variable_medida
      JOIN dispositivo d ON d.dispositivo_id = s.dispositivo_id
      WHERE d.codigo IN ('VAR-A', 'VAR-B')
      ORDER BY d.codigo
    `;

    assert.equal(filas.length, 2);
    assert.equal(filas[0]!.unidad, "lpm");
    assert.equal(filas[1]!.unidad, "lpm");
  });

  it("un sensor con una variable que no está en el catálogo se rechaza", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const equipo = await prisma.dispositivo.create({
      data: { hospital_id: 1, codigo: "VAR-C" },
      select: { dispositivo_id: true },
    });

    // La clave foránea es lo que impide que aparezcan variables sueltas
    // escritas a mano —"HR", "hr ", "ritmo"— que luego nadie sabe traducir.
    await assert.rejects(() =>
      prisma.sensor.create({
        data: { dispositivo_id: equipo.dispositivo_id, variable_medida: "inventada" },
      }),
    );
  });

  it("una variable en uso no se puede borrar", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");

    // onDelete: Restrict. Borrar 'hr' dejaría sensores apuntando al vacío y sus
    // lecturas sin unidad con la que leerse.
    await assert.rejects(() => prisma.variable.delete({ where: { codigo: "hr" } }));

    assert.equal(
      await countRows(Prisma.sql`FROM variable WHERE codigo = 'hr'`),
      1,
    );
  });

  it("cambiar la unidad en el catálogo la cambia para todos los sensores a la vez", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");

    // Es el objetivo de la normalización: un solo sitio que corregir. Antes
    // había que recorrer `sensor` fila por fila y cualquiera que se saltara
    // dejaba una unidad vieja en pantalla.
    await prisma.variable.update({ where: { codigo: "hr" }, data: { unidad: "bpm" } });

    const filas = await prisma.$queryRaw<{ unidad: string }[]>`
      SELECT v.unidad
      FROM sensor s
      JOIN variable v ON v.codigo = s.variable_medida
      WHERE s.variable_medida = 'hr'
    `;

    assert.ok(filas.length >= 2);
    assert.ok(filas.every((f) => f.unidad === "bpm"));

    await prisma.variable.update({ where: { codigo: "hr" }, data: { unidad: "lpm" } });
  });
});
