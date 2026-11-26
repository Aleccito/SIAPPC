-- Asigna a la enfermera del seed (enfermero@institucion.org) los mismos pacientes DEMO que tiene el médico, para
-- que su tablero no salga vacío (prototipo/docs/CONEXION-BACKEND.md, 9.3; pedido 24 para que lo traiga el seed).
-- Se puede correr varias veces: solo agrega las asignaciones que falten.
SET NAMES utf8mb4;
INSERT IGNORE INTO medico_paciente (usuario_id, paciente_id, fecha_asignacion, motivo, activo)
SELECT enf.usuario_id, mp.paciente_id, CURDATE(), 'Enfermería de la unidad (datos de demo del prototipo)', TRUE
  FROM medico_paciente mp
  JOIN usuario med ON med.usuario_id = mp.usuario_id AND med.email = 'medico@institucion.org'
  JOIN paciente p ON p.paciente_id = mp.paciente_id AND p.cedula LIKE 'DEMO-%'
  JOIN usuario enf ON enf.email = 'enfermero@institucion.org'
 WHERE mp.activo
   AND NOT EXISTS (
     SELECT 1 FROM medico_paciente x
      WHERE x.paciente_id = mp.paciente_id AND x.usuario_id = enf.usuario_id AND x.activo
   );
SELECT ROW_COUNT() AS asignaciones_nuevas;
