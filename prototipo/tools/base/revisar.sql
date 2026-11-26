-- Revisión de la base para el prototipo conectado (CONEXION-BACKEND.md, 9.3). Solo lee.
SELECT COUNT(*) AS pacientes_demo FROM paciente WHERE cedula LIKE 'DEMO-%';
SELECT COUNT(*) AS notas_demo FROM nota_soap n JOIN paciente p USING (paciente_id) WHERE p.cedula LIKE 'DEMO-%';
SELECT r.nombre AS rol, COUNT(*) AS asignados
  FROM medico_paciente mp JOIN usuario u USING (usuario_id) JOIN rol r ON r.rol_id = u.rol_id
 WHERE mp.activo GROUP BY r.nombre;
SELECT COUNT(*) AS permiso_ia FROM permiso WHERE modulo = 'asistente_ia';
SELECT MAX(fecha_hora) AS ultima_lectura, COUNT(*) AS lecturas FROM lectura;
SELECT COUNT(*) AS monitores_libres FROM dispositivo WHERE paciente_id IS NULL AND estado IN ('activo', 'inactivo');
SELECT rp.puede_editar AS administrativo_asigna_monitor
  FROM rol_permiso rp JOIN rol r ON r.rol_id = rp.rol_id JOIN permiso p ON p.permiso_id = rp.permiso_id
 WHERE r.nombre = 'administrativo' AND p.modulo = 'dispositivos';
