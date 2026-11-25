-- Datos de demostración: médico, paciente y dispositivo vinculados.
--
-- El seed deja el sistema utilizable pero vacío de casos: crea el hospital, las
-- unidades, los roles y una sola cuenta de administrador. Para ver la cadena
-- completa —telemetría, alertas y notificaciones— hacen falta tres piezas más
-- que el seed no puede inventar, porque son inventario y personas reales de
-- cada instalación:
--
--   1. Un usuario con rol `medico`, que es a quien se le notifica.
--   2. Un paciente.
--   3. La asignación entre ambos: `medico_paciente` es de donde la ingesta saca
--      los destinatarios de una alerta.
--
-- Sin el paso 3 las alertas se generan igual y se ven en /sensors, pero la
-- bandeja queda vacía: `notificarAlerta` busca los responsables del paciente y,
-- si no hay ninguno, retorna sin crear nada.
--
-- Correr con:
--   docker compose exec -T mariadb sh -c 'mariadb -u root -p"$MARIADB_ROOT_PASSWORD" siappc' < backend/db/demo.sql
--
-- Es idempotente: correrlo dos veces no duplica nada.

-- ---------------------------------------------------------------------------
-- 1. Médico
-- ---------------------------------------------------------------------------
-- Contraseña: Medico12345
-- El hash es bcrypt de 10 rondas, el mismo formato que genera el backend.
-- Sirve solo para desarrollo local, igual que la cuenta del seed.

INSERT INTO usuario (hospital_id, rol_id, unidad_id, nombre, tipo_personal, registro_profesional, email, password_hash)
SELECT
  1,
  (SELECT rol_id FROM rol WHERE nombre = 'medico'),
  (SELECT unidad_id FROM unidad LIMIT 1),
  'Dr. Ricardo Vargas',
  'medico',
  'MED-0001',
  'medico@institucion.org',
  '$2b$10$olmi2USa8tlOa.eCPZWWYe0HpioJPzk7P3fjco4UsErtrVQiEPjjG'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email = 'medico@institucion.org');

-- ---------------------------------------------------------------------------
-- 2. Paciente
-- ---------------------------------------------------------------------------

INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta)
SELECT
  1,
  'Juan Pérez',
  '8-888-8888',
  '1988-04-12',
  'M',
  'O+',
  'María Pérez — 6000-0000',
  'inService',
  'Politraumatismo por accidente de tránsito'
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE cedula = '8-888-8888');

-- ---------------------------------------------------------------------------
-- 3. Asignación médico → paciente
-- ---------------------------------------------------------------------------
-- Este es el eslabón que faltaba. `notificarAlerta` consulta esta tabla para
-- saber a quién dirigir el aviso.

INSERT INTO medico_paciente (usuario_id, paciente_id, motivo)
SELECT
  (SELECT usuario_id FROM usuario   WHERE email  = 'medico@institucion.org'),
  (SELECT paciente_id FROM paciente WHERE cedula = '8-888-8888'),
  'Médico tratante'
WHERE NOT EXISTS (
  SELECT 1 FROM medico_paciente
  WHERE usuario_id  = (SELECT usuario_id  FROM usuario  WHERE email  = 'medico@institucion.org')
    AND paciente_id = (SELECT paciente_id FROM paciente WHERE cedula = '8-888-8888')
);

-- ---------------------------------------------------------------------------
-- 4. Dispositivo → paciente
-- ---------------------------------------------------------------------------
-- La ingesta resuelve el paciente a partir del dispositivo que publica. Sin
-- este vínculo la alerta se crea sin dueño y no hay a quién notificar.

UPDATE dispositivo
   SET paciente_id = (SELECT paciente_id FROM paciente WHERE cedula = '8-888-8888')
 WHERE codigo = 'RPI-01';

-- ---------------------------------------------------------------------------
-- Verificación
-- ---------------------------------------------------------------------------

SELECT
  d.codigo                        AS dispositivo,
  p.nombre                        AS paciente,
  u.nombre                        AS medico_asignado,
  u.email                         AS entrar_con,
  'Medico12345'                   AS contrasena
FROM dispositivo d
LEFT JOIN paciente p        ON p.paciente_id = d.paciente_id
LEFT JOIN medico_paciente mp ON mp.paciente_id = p.paciente_id AND mp.activo = TRUE
LEFT JOIN usuario u          ON u.usuario_id = mp.usuario_id
WHERE d.codigo = 'RPI-01';
