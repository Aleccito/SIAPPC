-- Datos mínimos para que la aplicación arranque usable. Sin esto el esquema
-- queda vacío y nadie puede iniciar sesión: `POST /users` exige un admin
-- autenticado, así que el primer usuario tiene que entrar por aquí.
--
-- Corre solo en el primer arranque del contenedor, cuando el volumen está
-- vacío, después de `01-schema.sql`.
--
-- ADVERTENCIA: la contraseña de abajo es pública, está en el repositorio. Sirve
-- para desarrollo. Antes de exponer esto a cualquier red, cambia la contraseña
-- del admin y borra este usuario si no lo necesitas.

-- El primer hospital. Va aquí y no en una constante del código porque de él
-- cuelgan por clave foránea `unidad`, `usuario`, `paciente` y `dispositivo`:
-- el hospital de un registro es un dato de la base, no un número escrito en el
-- frontend. Todo lo que se siembra debajo pertenece a este.
--
-- Es hospital_id = 1 por ser la primera fila, y de ahí lo toman las cuentas y
-- unidades del seed. La aplicación NO asume ese 1 en ningún sitio: cada alta
-- usa el hospital de la sesión (ver src/plugins/auth.ts).
INSERT INTO hospital (nombre, direccion, telefono)
VALUES ('Hospital Santo Tomás', 'Sin dirección registrada', NULL);

INSERT INTO unidad (hospital_id, nombre) VALUES
  (1, 'UCI'),
  (1, 'Trauma'),
  (1, 'Admisión'),
  (1, 'Piso 3'),
  (1, 'TI');

-- Variables medibles y su unidad. La unidad vive aquí y no en `sensor`: es un
-- dato de la variable, no del equipo que la mide. Los códigos son los que
-- publica la Raspberry en el tema MQTT; una variable nueva la da de alta la
-- propia ingesta la primera vez que llega (ver src/services/mqttIngest.ts).
INSERT INTO variable (codigo, unidad) VALUES
  ('hr', 'lpm'),
  ('spo2', '%'),
  ('pa', 'mmHg'),
  ('temp', '°C');

-- Roles base. `es_sistema` los marca como no editables: la interfaz los muestra
-- con el candado y la matriz en solo lectura. Los roles personalizados que cree
-- un administrador entran sin esa marca.
INSERT INTO rol (nombre, etiqueta, descripcion, es_sistema) VALUES
  ('medico', 'Médico', 'Personal médico con acceso clínico completo', TRUE),
  ('enfermero', 'Enfermero', 'Personal de enfermería a cargo de pacientes', TRUE),
  ('administrativo', 'Administrativo', 'Gestión operativa, sin acceso clínico de edición', TRUE),
  ('admin', 'Administrador', 'Administrador del sistema', TRUE);

-- Un renglón por módulo: las cuatro acciones son columnas de `rol_permiso`.
INSERT INTO permiso (modulo, nombre, descripcion) VALUES
  ('pacientes', 'Gestión de Pacientes', 'Altas, listado y ficha del paciente'),
  ('historia_clinica', 'Historia Clínica', 'Antecedentes y evolución'),
  ('notas_soap', 'Notas SOAP', 'Notas clínicas estructuradas'),
  ('monitoreo', 'Monitoreo', 'Signos vitales en tiempo real'),
  ('dispositivos', 'Dispositivos', 'Sensores y equipos conectados'),
  ('alertas', 'Alertas', 'Umbrales y eventos críticos'),
  ('reportes', 'Reportes', 'Resúmenes clínicos y de turno'),
  ('configuracion', 'Configuración', 'Parámetros del sistema'),
  ('usuarios', 'Usuarios', 'Cuentas, roles y accesos'),
  ('auditoria', 'Auditoría', 'Bitácora de acciones'),
  ('admisiones', 'Admisión', 'Camas, ingresos, egresos y citas');

-- Matriz de permisos de los roles base.
INSERT INTO rol_permiso (rol_id, permiso_id, puede_ver, puede_crear, puede_editar, puede_eliminar)
SELECT r.rol_id, p.permiso_id, m.ver, m.crear, m.editar, m.eliminar
FROM (
  SELECT 'medico' AS rol, 'pacientes' AS modulo, TRUE AS ver, TRUE AS crear, TRUE AS editar, FALSE AS eliminar
  UNION ALL SELECT 'medico', 'historia_clinica', TRUE, TRUE, TRUE, FALSE
  UNION ALL SELECT 'medico', 'notas_soap', TRUE, TRUE, TRUE, FALSE
  UNION ALL SELECT 'medico', 'monitoreo', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'medico', 'dispositivos', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'medico', 'alertas', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'medico', 'reportes', TRUE, TRUE, FALSE, FALSE
  -- El médico ve la agenda y la ocupación; darlas de alta es de Admisión.
  UNION ALL SELECT 'medico', 'admisiones', TRUE, FALSE, FALSE, FALSE

  UNION ALL SELECT 'enfermero', 'pacientes', TRUE, FALSE, TRUE, FALSE
  -- Enfermería lee el expediente y las notas SOAP, y no las escribe. Lo único
  -- que puede escribir de la historia son las observaciones, y eso no es otra
  -- casilla: es que PATCH /historia/:id/observaciones pide `ver` en vez de
  -- `editar` (ver src/routes/historia.ts). Un hospital que quiera darle más —o
  -- quitarle la lectura de las notas— mueve estas casillas, sin tocar código.
  UNION ALL SELECT 'enfermero', 'historia_clinica', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'enfermero', 'notas_soap', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'enfermero', 'monitoreo', TRUE, TRUE, TRUE, FALSE
  UNION ALL SELECT 'enfermero', 'dispositivos', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'enfermero', 'alertas', TRUE, FALSE, TRUE, FALSE
  UNION ALL SELECT 'enfermero', 'reportes', TRUE, TRUE, FALSE, FALSE
  -- Enfermería edita para mover la cama a limpieza o mantenimiento cuando el
  -- paciente sale. No admite ni agenda: eso es de Admisión.
  UNION ALL SELECT 'enfermero', 'admisiones', TRUE, FALSE, TRUE, FALSE

  UNION ALL SELECT 'administrativo', 'pacientes', TRUE, TRUE, TRUE, FALSE
  UNION ALL SELECT 'administrativo', 'monitoreo', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'administrativo', 'dispositivos', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'administrativo', 'alertas', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'administrativo', 'reportes', TRUE, TRUE, FALSE, FALSE
  UNION ALL SELECT 'administrativo', 'configuracion', TRUE, FALSE, FALSE, FALSE
  -- El módulo propio del rol: ingresos, egresos, camas y citas. Es lo que le
  -- da razón de entrar al sistema.
  UNION ALL SELECT 'administrativo', 'admisiones', TRUE, TRUE, TRUE, TRUE

  UNION ALL SELECT 'admin', 'pacientes', TRUE, TRUE, TRUE, TRUE
  -- El administrador del sistema NO es personal clínico: sobre el expediente y
  -- las notas SOAP solo lee, para poder auditar. Darle `crear`/`editar` haría
  -- que una cuenta técnica pudiera firmar contenido clínico, que es justo lo
  -- que la firma tiene que impedir.
  UNION ALL SELECT 'admin', 'historia_clinica', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'admin', 'notas_soap', TRUE, FALSE, FALSE, FALSE
  UNION ALL SELECT 'admin', 'monitoreo', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', 'dispositivos', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', 'alertas', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', 'reportes', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', 'configuracion', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', 'usuarios', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', 'auditoria', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', 'admisiones', TRUE, TRUE, TRUE, TRUE
) AS m
JOIN rol r ON r.nombre = m.rol
JOIN permiso p ON p.modulo = m.modulo;

-- Contraseña: Admin12345 (bcrypt, 10 rondas)
INSERT INTO usuario (hospital_id, rol_id, unidad_id, nombre, tipo_personal, email, password_hash)
VALUES (
  1,
  (SELECT rol_id FROM rol WHERE nombre = 'admin'),
  (SELECT unidad_id FROM unidad WHERE nombre = 'TI'),
  'Ana García',
  'administrativo',
  'admin@institucion.org',
  '$2a$10$gMDaMR31u1IVELJbU342y.TazcwR2WsCRM9abROyo71ViH3nYJB16'
);
