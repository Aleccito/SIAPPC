import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Las rondas con las que se generó un hash, leídas de su propio prefijo
 * (`$2a$10$…` → 10). Si no se puede leer, se supone el coste actual.
 */
export function costOf(hash: string): number {
  const rounds = Number(hash.split("$")[2]);
  return Number.isInteger(rounds) && rounds >= 4 && rounds <= 31 ? rounds : SALT_ROUNDS;
}

/**
 * Hashes de contraseñas que nadie conoce, uno por coste, calculados a demanda.
 *
 * Sirven para que un correo que NO está dado de alta tarde lo mismo en fallar
 * que uno que sí. Sin ellos el login corta antes de llegar a bcrypt cuando no
 * encuentra al usuario, y la diferencia se mide desde fuera sin ninguna
 * herramienta especial: medido en este proyecto, ~110 ms con cuenta existente
 * contra ~8 ms sin ella. Con eso se recorre una lista de correos y se saca
 * cuáles están dados de alta en el hospital, que es justo lo que el 401
 * idéntico de las dos ramas pretendía evitar.
 *
 * Van indexados por coste y NO fijos en `SALT_ROUNDS` porque el coste no es el
 * mismo en toda la base: los usuarios sembrados traen 10 y los creados por la
 * aplicación 12. Un señuelo de 12 contra hashes de 10 tarda cuatro veces más y
 * vuelve a delatar la cuenta, solo que al revés —medido: 470 ms sin cuenta
 * contra 165 ms con ella—. Tomando el coste de la propia base, el señuelo se
 * ajusta solo y sigue ajustándose según los hashes se vayan renovando.
 */
const dummies = new Map<number, string>();

export function dummyHashFor(cost: number): string {
  let hash = dummies.get(cost);
  if (!hash) {
    // La contraseña es aleatoria y distinta en cada arranque: el señuelo no es
    // un valor conocido que esté escrito en el repositorio.
    hash = bcrypt.hashSync(randomUUID(), cost);
    dummies.set(cost, hash);
  }
  return hash;
}

/** Compara contra el señuelo del coste dado. Devuelve `false` siempre. */
export function verifyAgainstDummy(plain: string, cost: number): Promise<boolean> {
  return bcrypt.compare(plain, dummyHashFor(cost));
}
