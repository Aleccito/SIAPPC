-- ThermoTrace / Monitoreo Hospitalario - MariaDB 11.4
--
-- Solo DDL. El nombre de la base viene de DB_NAME en el entorno: Docker la crea
-- con MARIADB_DATABASE y se conecta directo a ella. No agregues CREATE DATABASE
-- ni USE aquí, o el nombre queda quemado en dos lugares.
--
-- Este archivo es el esquema **completo y actual**, y corre una sola vez: en el
-- primer arranque del contenedor, cuando el volumen está vacío. Sobre una base
-- que ya tiene tablas falla, y eso es correcto — para cambiar el esquema de una
-- base existente se agrega un archivo en `db/migrations/`, no se toca esto.
--
-- Al agregar una migración hay que hacer las dos cosas: reflejar el cambio aquí
-- (para instalaciones nuevas) y registrarla al final, en el INSERT sobre
-- `migracion` (para que no se vuelva a aplicar sobre una base recién creada).
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE hospital (
  hospital_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(150) NOT NULL,
  direccion   VARCHAR(255),
  telefono    VARCHAR(30),
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (hospital_id),
  UNIQUE KEY uq_hospital_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE rol (
  rol_id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- `nombre` es la llave estable que usa el código; `etiqueta` es lo que ve el
  -- usuario. Separarlas deja renombrar un rol sin romper ninguna consulta.
  nombre      VARCHAR(60) NOT NULL,
  etiqueta    VARCHAR(80) NOT NULL,
  descripcion VARCHAR(255),
  -- Los roles base del sistema no se editan ni se borran desde la interfaz:
  -- la matriz de permisos los muestra en solo lectura.
  es_sistema  BOOLEAN NOT NULL DEFAULT FALSE,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (rol_id),
  UNIQUE KEY uq_rol_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE permiso (
  permiso_id  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(80) NOT NULL,
  modulo      VARCHAR(60) NOT NULL,
  descripcion VARCHAR(255),
  PRIMARY KEY (permiso_id),
  UNIQUE KEY uq_permiso_modulo_nombre (modulo, nombre)
) ENGINE=InnoDB;

CREATE TABLE rol_permiso (
  rol_permiso_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  rol_id         INT UNSIGNED NOT NULL,
  permiso_id     INT UNSIGNED NOT NULL,
  -- Las cuatro columnas son las cuatro casillas de la matriz de permisos.
  puede_ver      BOOLEAN NOT NULL DEFAULT FALSE,
  puede_crear    BOOLEAN NOT NULL DEFAULT FALSE,
  puede_editar   BOOLEAN NOT NULL DEFAULT FALSE,
  puede_eliminar BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (rol_permiso_id),
  UNIQUE KEY uq_rol_permiso (rol_id, permiso_id),
  KEY ix_rol_permiso_permiso (permiso_id),
  CONSTRAINT fk_rolperm_rol FOREIGN KEY (rol_id)
    REFERENCES rol (rol_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rolperm_permiso FOREIGN KEY (permiso_id)
    REFERENCES permiso (permiso_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Unidad física o servicio donde trabaja el personal: UCI, Trauma, Admisión,
-- Piso 3, TI. No es lo mismo que `especializacion`, que es clínica.
CREATE TABLE unidad (
  unidad_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hospital_id INT UNSIGNED NOT NULL,
  nombre      VARCHAR(80) NOT NULL,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (unidad_id),
  UNIQUE KEY uq_unidad_hospital_nombre (hospital_id, nombre),
  CONSTRAINT fk_unidad_hospital FOREIGN KEY (hospital_id)
    REFERENCES hospital (hospital_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE usuario (
  usuario_id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hospital_id          INT UNSIGNED NOT NULL,
  rol_id               INT UNSIGNED NOT NULL,
  unidad_id            INT UNSIGNED NULL,
  nombre               VARCHAR(150) NOT NULL,
  tipo_personal        VARCHAR(50) NOT NULL,
  registro_profesional VARCHAR(60),
  email                VARCHAR(150) NOT NULL,
  password_hash        CHAR(60) NOT NULL,
  telefono             VARCHAR(30),
  -- Alimenta la columna "Última Actividad" sin escanear `auditoria`.
  ultimo_acceso        DATETIME NULL,
  -- FALSE es "Suspendido" en la interfaz: la cuenta existe pero no entra.
  activo               BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (usuario_id),
  UNIQUE KEY uq_usuario_email (email),
  UNIQUE KEY uq_usuario_registro (registro_profesional),
  KEY ix_usuario_hospital (hospital_id),
  KEY ix_usuario_rol (rol_id),
  KEY ix_usuario_unidad (unidad_id),
  CONSTRAINT fk_usuario_hospital FOREIGN KEY (hospital_id)
    REFERENCES hospital (hospital_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id)
    REFERENCES rol (rol_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_unidad FOREIGN KEY (unidad_id)
    REFERENCES unidad (unidad_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE especializacion (
  especializacion_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre             VARCHAR(120) NOT NULL,
  area               VARCHAR(80),
  PRIMARY KEY (especializacion_id),
  UNIQUE KEY uq_especializacion_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE usuario_especializacion (
  usuario_especializacion_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id                 INT UNSIGNED NOT NULL,
  especializacion_id         INT UNSIGNED NOT NULL,
  fecha_obtencion            DATE,
  certificado                VARCHAR(255),
  PRIMARY KEY (usuario_especializacion_id),
  UNIQUE KEY uq_usuario_espec (usuario_id, especializacion_id),
  KEY ix_ue_especializacion (especializacion_id),
  CONSTRAINT fk_ue_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (usuario_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ue_especializacion FOREIGN KEY (especializacion_id)
    REFERENCES especializacion (especializacion_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE paciente (
  paciente_id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hospital_id         INT UNSIGNED NOT NULL,
  nombre              VARCHAR(150) NOT NULL,
  cedula              VARCHAR(30) NOT NULL,
  fecha_nacimiento    DATE NOT NULL,
  sexo                ENUM('M','F','O') NOT NULL,
  tipo_sangre         ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
  contacto_emergencia VARCHAR(150),
  modulo              VARCHAR(10),
  estado              ENUM('waiting','inService','discharged') NOT NULL DEFAULT 'waiting',
  motivo_consulta     VARCHAR(255),
  fecha_llegada       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (paciente_id),
  UNIQUE KEY uq_paciente_cedula (cedula),
  KEY ix_paciente_hospital (hospital_id),
  KEY ix_paciente_estado (estado),
  CONSTRAINT fk_paciente_hospital FOREIGN KEY (hospital_id)
    REFERENCES hospital (hospital_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE medico_paciente (
  medico_paciente_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id         INT UNSIGNED NOT NULL,
  paciente_id        INT UNSIGNED NOT NULL,
  fecha_asignacion   DATE NOT NULL DEFAULT (CURRENT_DATE),
  motivo             VARCHAR(255),
  activo             BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (medico_paciente_id),
  UNIQUE KEY uq_medico_paciente (usuario_id, paciente_id, fecha_asignacion),
  KEY ix_mp_paciente (paciente_id),
  CONSTRAINT fk_mp_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (usuario_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_mp_paciente FOREIGN KEY (paciente_id)
    REFERENCES paciente (paciente_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE historia_clinica (
  historia_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  paciente_id   INT UNSIGNED NOT NULL,
  usuario_id    INT UNSIGNED NOT NULL,
  fecha_hora    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diagnostico   TEXT,
  tratamiento   TEXT,
  observaciones TEXT,
  PRIMARY KEY (historia_id),
  KEY ix_hc_paciente_fecha (paciente_id, fecha_hora),
  KEY ix_hc_usuario (usuario_id),
  CONSTRAINT fk_hc_paciente FOREIGN KEY (paciente_id)
    REFERENCES paciente (paciente_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_hc_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (usuario_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE dispositivo (
  dispositivo_id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hospital_id       INT UNSIGNED NOT NULL,
  paciente_id       INT UNSIGNED NULL,
  codigo            VARCHAR(50) NOT NULL,
  modelo            VARCHAR(80),
  microcontrolador  VARCHAR(80),
  estado            ENUM('activo','inactivo','mantenimiento','baja') NOT NULL DEFAULT 'activo',
  fecha_instalacion DATETIME,
  PRIMARY KEY (dispositivo_id),
  UNIQUE KEY uq_dispositivo_codigo (codigo),
  KEY ix_disp_hospital (hospital_id),
  KEY ix_disp_paciente (paciente_id),
  CONSTRAINT fk_disp_hospital FOREIGN KEY (hospital_id)
    REFERENCES hospital (hospital_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_disp_paciente FOREIGN KEY (paciente_id)
    REFERENCES paciente (paciente_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sensor (
  sensor_id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispositivo_id  INT UNSIGNED NOT NULL,
  modelo          VARCHAR(80),
  variable_medida VARCHAR(60) NOT NULL,
  unidad          VARCHAR(20) NOT NULL,
  estado          ENUM('activo','inactivo','fallo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (sensor_id),
  UNIQUE KEY uq_sensor_disp_var (dispositivo_id, variable_medida),
  CONSTRAINT fk_sensor_dispositivo FOREIGN KEY (dispositivo_id)
    REFERENCES dispositivo (dispositivo_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE lectura (
  lectura_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sensor_id    INT UNSIGNED NOT NULL,
  valor        DECIMAL(12,4) NOT NULL,
  fecha_hora   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  hash_sha256  CHAR(64) NOT NULL,
  sincronizada BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (lectura_id),
  UNIQUE KEY uq_lectura_hash (hash_sha256),
  KEY ix_lectura_sensor_fecha (sensor_id, fecha_hora),
  KEY ix_lectura_pendiente (sincronizada, fecha_hora),
  CONSTRAINT fk_lectura_sensor FOREIGN KEY (sensor_id)
    REFERENCES sensor (sensor_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE alerta (
  alerta_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lectura_id       BIGINT UNSIGNED NOT NULL,
  tipo             VARCHAR(60) NOT NULL,
  severidad        ENUM('baja','media','alta','critica') NOT NULL,
  mensaje          VARCHAR(255),
  estado           ENUM('abierta','reconocida','resuelta') NOT NULL DEFAULT 'abierta',
  fecha_hora       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion DATETIME NULL,
  PRIMARY KEY (alerta_id),
  KEY ix_alerta_lectura (lectura_id),
  KEY ix_alerta_estado_sev (estado, severidad, fecha_hora),
  CONSTRAINT fk_alerta_lectura FOREIGN KEY (lectura_id)
    REFERENCES lectura (lectura_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT ck_alerta_resolucion CHECK (fecha_resolucion IS NULL OR fecha_resolucion >= fecha_hora)
) ENGINE=InnoDB;

CREATE TABLE notificacion (
  notificacion_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  alerta_id       BIGINT UNSIGNED NOT NULL,
  usuario_id      INT UNSIGNED NOT NULL,
  canal           ENUM('email','sms','push','panel') NOT NULL,
  fecha_envio     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado_envio    ENUM('pendiente','enviado','fallido','leido') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (notificacion_id),
  KEY ix_notif_alerta (alerta_id),
  KEY ix_notif_usuario_estado (usuario_id, estado_envio),
  CONSTRAINT fk_notif_alerta FOREIGN KEY (alerta_id)
    REFERENCES alerta (alerta_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (usuario_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE auditoria (
  auditoria_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id   INT UNSIGNED NULL,
  entidad      VARCHAR(60) NOT NULL,
  registro_id  BIGINT UNSIGNED NOT NULL,
  -- LOGIN_BLOCKED lo escribe el límite de intentos de `/auth/login`. No es una
  -- acción del usuario sino un evento de seguridad, y vive aquí para que la
  -- detección de fuerza bruta lea de una sola bitácora.
  accion       ENUM('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','LOGIN_BLOCKED') NOT NULL,
  fecha_hora   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacion  TEXT,
  PRIMARY KEY (auditoria_id),
  KEY ix_audit_entidad_registro (entidad, registro_id),
  KEY ix_audit_usuario_fecha (usuario_id, fecha_hora),
  CONSTRAINT fk_audit_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (usuario_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Qué migraciones de `db/migrations/` ya se aplicaron. `db/migrate.ts` la crea
-- si no existe, así que las bases anteriores a este archivo también funcionan.
CREATE TABLE migracion (
  nombre      VARCHAR(120) NOT NULL,
  aplicada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (nombre)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- Migraciones ya incorporadas al DDL de arriba. Una base creada con este
-- archivo nace al día: `migrate.ts` las ve registradas y no las repite. Sobre
-- una base vieja, en cambio, `migracion` arranca vacía y sí se aplican.
INSERT INTO migracion (nombre) VALUES
  ('001-auditoria-login-blocked.sql');
