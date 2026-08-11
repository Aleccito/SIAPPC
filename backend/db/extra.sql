-- Lo que el esquema de Prisma no sabe expresar.
--
-- Este archivo SÍ se edita a mano. `npm run schema:build` lo pega al final de
-- `db/schema.sql`, y cada sentencia de aquí tiene además que existir en alguna
-- migración de `prisma/migrations/` para que las bases ya creadas la reciban.
--
-- Regla para agregar: solo va aquí lo que Prisma no puede representar (CHECK,
-- triggers, vistas, particiones). Todo lo demás se modela en schema.prisma.

-- Una alerta no se puede resolver antes de haberse abierto.
ALTER TABLE `alerta`
  ADD CONSTRAINT `ck_alerta_resolucion`
  CHECK (`fecha_resolucion` IS NULL OR `fecha_resolucion` >= `fecha_hora`);
