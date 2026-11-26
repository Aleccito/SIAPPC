-- Cinco monitores de demo SIN paciente (DEMO-DEV-16 a DEMO-DEV-20), para asignarlos desde la app principal al admitir
-- a alguien (Pacientes → "Asignar monitor"). Quedan en `inactivo`: no transmiten hasta que se asignan; entonces el
-- publicador de demo (tools/telemetria-demo) los empieza a simular y el backend los pasa a `activo`.
-- En el hospital de los demás equipos de demo. Se puede correr varias veces: solo agrega los que falten (el código del
-- equipo es único).
SET NAMES utf8mb4;
SET @hospital = COALESCE((SELECT hospital_id FROM dispositivo WHERE codigo = 'DEMO-DEV-01'), (SELECT MIN(hospital_id) FROM hospital));
INSERT IGNORE INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado)
SELECT @hospital, NULL, m.codigo, 'Monitor de prueba', 'simulado', 'inactivo'
  FROM (SELECT 'DEMO-DEV-16' AS codigo UNION ALL SELECT 'DEMO-DEV-17' UNION ALL SELECT 'DEMO-DEV-18'
        UNION ALL SELECT 'DEMO-DEV-19' UNION ALL SELECT 'DEMO-DEV-20') AS m;
SELECT ROW_COUNT() AS monitores_libres_nuevos;
