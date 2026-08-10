-- Agrega LOGIN_BLOCKED a las acciones de la bitacoría.
--
-- Lo escribe el límite de intentos de `/auth/login` cuando una IP o un correo
-- se pasa de la cuota. Sin este valor el INSERT falla, porque `accion` es un
-- ENUM y MariaDB rechaza lo que no esté en la lista.
--
-- Es la fuente que necesita la detección de fuerza bruta: contar
-- LOGIN_BLOCKED por IP en una ventana de tiempo sale de esta misma tabla.

ALTER TABLE auditoria
  MODIFY COLUMN accion
    ENUM('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','LOGIN_BLOCKED') NOT NULL;
