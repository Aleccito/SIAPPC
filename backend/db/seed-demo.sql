-- Datos de PRUEBA, ficticios. No contienen personas reales: nombres, cédulas (DEMO-xxxx) y cuadros clínicos son inventados.
-- Generado por un script; las lecturas son de los últimos 40 minutos respecto al momento de aplicarlo.
-- Aplicar una sola vez sobre la base con el seed base: falla si las cédulas DEMO-* ya existen.
SET NAMES utf8mb4;
START TRANSACTION;
INSERT IGNORE INTO variable (codigo, unidad) VALUES ('resp', 'rpm');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='UCI' AND hospital_id=1), 'UCI-01', 'UCI', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='UCI' AND hospital_id=1), 'UCI-02', 'UCI', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='UCI' AND hospital_id=1), 'UCI-03', 'UCI', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='UCI' AND hospital_id=1), 'UCI-04', 'UCI', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='UCI' AND hospital_id=1), 'UCI-05', 'UCI', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='UCI' AND hospital_id=1), 'UCI-06', 'UCI', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Trauma' AND hospital_id=1), 'TR-01', 'Trauma', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Trauma' AND hospital_id=1), 'TR-02', 'Trauma', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Trauma' AND hospital_id=1), 'TR-03', 'Trauma', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Trauma' AND hospital_id=1), 'TR-04', 'Trauma', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Trauma' AND hospital_id=1), 'TR-05', 'Trauma', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-01', 'Hospitalización', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-02', 'Hospitalización', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-03', 'Hospitalización', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-04', 'Hospitalización', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-05', 'Hospitalización', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-06', 'Hospitalización', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-07', 'Hospitalización', 'disponible');
INSERT INTO cama (unidad_id, codigo, tipo, estado) VALUES ((SELECT unidad_id FROM unidad WHERE nombre='Piso 3' AND hospital_id=1), 'P3-08', 'Hospitalización', 'disponible');

-- Rogelio Batista Quintero
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Rogelio Batista Quintero', 'DEMO-0001', '1958-03-14', 'M', 'O+', 'Familiar de prueba (555-0101)', 'inService', 'Fiebre alta, confusión y dolor lumbar de 3 días', NOW() - INTERVAL 20 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0001'), 'Ingresa por cuadro séptico de probable foco urinario. Hipotenso al ingreso.', NOW() - INTERVAL 20 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'personal', 'Diabetes mellitus tipo 2 desde hace 12 años', NULL, 2013, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'personal', 'Hipertensión arterial', NULL, 2008, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'familiar', 'Diabetes mellitus', 'Madre', NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'Penicilina', 'Urticaria generalizada', 'moderada', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'Metformina', '850 mg', 'oral', 'cada 12 h', 'Diabetes tipo 2', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'Enalapril', '10 mg', 'oral', 'cada 24 h', 'Hipertensión', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'Ceftriaxona', '2 g', 'intravenosa', 'cada 24 h', 'Cobertura empírica', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'N39.0', 'Infección de vías urinarias complicada', 'presuntivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0001'), 'A41.9', 'Sepsis, no especificada', 'diferencial', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0001'), (SELECT cama_id FROM cama WHERE codigo='UCI-01'), 'urgencia', 'activo', 'Fiebre alta, confusión y dolor lumbar de 3 días', NOW() - INTERVAL 20 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='UCI-01';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0001'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0001'), 'DEMO-DEV-01', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 20 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-01'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-01' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 100, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-01-hr-0', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-01-hr-1', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-01-hr-2', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-01-hr-3', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-01-hr-4', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-01-hr-5', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-01-hr-6', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-01-hr-7', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-01-hr-8', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-01-hr-9', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-01-hr-10', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-01-hr-11', 256), TRUE),
  (@sid, 104, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-01-hr-12', 256), TRUE),
  (@sid, 108, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-01-hr-13', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-01-hr-14', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-01-hr-15', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-01-hr-16', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-01-hr-17', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-01-hr-18', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-01-hr-19', 256), TRUE),
  (@sid, 116, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-01-hr-20', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-01-hr-21', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-01-hr-22', 256), TRUE),
  (@sid, 121, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-01-hr-23', 256), TRUE),
  (@sid, 121, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-01-hr-24', 256), TRUE),
  (@sid, 122, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-01-hr-25', 256), TRUE),
  (@sid, 124, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-01-hr-26', 256), TRUE),
  (@sid, 122, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-01-hr-27', 256), TRUE),
  (@sid, 125, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-01-hr-28', 256), TRUE),
  (@sid, 127, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-01-hr-29', 256), TRUE),
  (@sid, 127, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-01-hr-30', 256), TRUE),
  (@sid, 126, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-01-hr-31', 256), TRUE),
  (@sid, 127, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-01-hr-32', 256), TRUE),
  (@sid, 130, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-01-hr-33', 256), TRUE),
  (@sid, 129, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-01-hr-34', 256), TRUE),
  (@sid, 131, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-01-hr-35', 256), TRUE),
  (@sid, 130, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-01-hr-36', 256), TRUE),
  (@sid, 130, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-01-hr-37', 256), TRUE),
  (@sid, 133, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-01-hr-38', 256), TRUE),
  (@sid, 133, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-01-hr-39', 256), TRUE),
  (@sid, 132, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-01-hr-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 121 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-23', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 121 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-24', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 122 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-25', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 124 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-26', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 122 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-27', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 125 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 127 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-29', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 127 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 126 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 127 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 130 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 129 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 131 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 130 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 130 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 133 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 133 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 132 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-hr-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-01'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-01' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 94, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-01-spo2-0', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-01-spo2-1', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-01-spo2-2', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-01-spo2-3', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-01-spo2-4', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-01-spo2-5', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-01-spo2-6', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-01-spo2-7', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-01-spo2-8', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-01-spo2-9', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-01-spo2-10', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-01-spo2-11', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-01-spo2-12', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-01-spo2-13', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-01-spo2-14', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-01-spo2-15', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-01-spo2-16', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-01-spo2-17', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-01-spo2-18', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-01-spo2-19', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-01-spo2-20', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-01-spo2-21', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-01-spo2-22', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-01-spo2-23', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-01-spo2-24', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-01-spo2-25', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-01-spo2-26', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-01-spo2-27', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-01-spo2-28', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-01-spo2-29', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-01-spo2-30', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-01-spo2-31', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-01-spo2-32', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-01-spo2-33', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-01-spo2-34', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-01-spo2-35', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-01-spo2-36', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-01-spo2-37', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-01-spo2-38', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-01-spo2-39', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-01-spo2-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-29', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-01-spo2-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-01'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-01' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 17, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-01-resp-0', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-01-resp-1', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-01-resp-2', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-01-resp-3', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-01-resp-4', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-01-resp-5', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-01-resp-6', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-01-resp-7', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-01-resp-8', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-01-resp-9', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-01-resp-10', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-01-resp-11', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-01-resp-12', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-01-resp-13', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-01-resp-14', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-01-resp-15', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-01-resp-16', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-01-resp-17', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-01-resp-18', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-01-resp-19', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-01-resp-20', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-01-resp-21', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-01-resp-22', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-01-resp-23', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-01-resp-24', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-01-resp-25', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-01-resp-26', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-01-resp-27', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-01-resp-28', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-01-resp-29', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-01-resp-30', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-01-resp-31', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-01-resp-32', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-01-resp-33', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-01-resp-34', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-01-resp-35', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-01-resp-36', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-01-resp-37', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-01-resp-38', 256), TRUE),
  (@sid, 29, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-01-resp-39', 256), TRUE),
  (@sid, 30, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-01-resp-40', 256), TRUE);

-- Ileana Montenegro Sáez
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Ileana Montenegro Sáez', 'DEMO-0002', '1971-09-02', 'F', 'A+', 'Familiar de prueba (555-0102)', 'inService', 'Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera', NOW() - INTERVAL 12 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0002'), 'Postoperatoria de reducción de fractura de cadera. Disnea de inicio súbito.', NOW() - INTERVAL 12 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0002'), 'quirurgico', 'Osteosíntesis de cadera derecha hace 5 días', NULL, 2026, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0002'), 'habito', 'Tabaquismo, 10 cigarrillos al día', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0002'), 'Enoxaparina', '40 mg', 'subcutánea', 'cada 24 h', 'Profilaxis tromboembólica', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0002'), 'Paracetamol', '1 g', 'oral', 'cada 8 h', 'Dolor', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0002'), 'S72.0', 'Fractura de cuello de fémur', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0002'), 'I26.9', 'Tromboembolia pulmonar', 'presuntivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0002'), (SELECT cama_id FROM cama WHERE codigo='UCI-02'), 'urgencia', 'activo', 'Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera', NOW() - INTERVAL 12 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='UCI-02';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0002'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0002'), 'DEMO-DEV-02', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 12 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-02'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-02' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 88, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-02-hr-0', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-02-hr-1', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-02-hr-2', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-02-hr-3', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-02-hr-4', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-02-hr-5', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-02-hr-6', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-02-hr-7', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-02-hr-8', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-02-hr-9', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-02-hr-10', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-02-hr-11', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-02-hr-12', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-02-hr-13', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-02-hr-14', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-02-hr-15', 256), TRUE),
  (@sid, 104, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-02-hr-16', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-02-hr-17', 256), TRUE),
  (@sid, 105, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-02-hr-18', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-02-hr-19', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-02-hr-20', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-02-hr-21', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-02-hr-22', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-02-hr-23', 256), TRUE),
  (@sid, 115, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-02-hr-24', 256), TRUE),
  (@sid, 116, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-02-hr-25', 256), TRUE),
  (@sid, 119, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-02-hr-26', 256), TRUE),
  (@sid, 119, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-02-hr-27', 256), TRUE),
  (@sid, 120, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-02-hr-28', 256), TRUE),
  (@sid, 120, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-02-hr-29', 256), TRUE),
  (@sid, 120, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-02-hr-30', 256), TRUE),
  (@sid, 123, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-02-hr-31', 256), TRUE),
  (@sid, 123, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-02-hr-32', 256), TRUE),
  (@sid, 126, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-02-hr-33', 256), TRUE),
  (@sid, 127, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-02-hr-34', 256), TRUE),
  (@sid, 124, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-02-hr-35', 256), TRUE),
  (@sid, 127, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-02-hr-36', 256), TRUE),
  (@sid, 126, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-02-hr-37', 256), TRUE),
  (@sid, 130, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-02-hr-38', 256), TRUE),
  (@sid, 128, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-02-hr-39', 256), TRUE),
  (@sid, 126, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-02-hr-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 123 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 123 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 126 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 127 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 124 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 127 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 126 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 130 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 128 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 126 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-hr-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-02'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-02' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 94, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-02-spo2-0', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-02-spo2-1', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-02-spo2-2', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-02-spo2-3', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-02-spo2-4', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-02-spo2-5', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-02-spo2-6', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-02-spo2-7', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-02-spo2-8', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-02-spo2-9', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-02-spo2-10', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-02-spo2-11', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-02-spo2-12', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-02-spo2-13', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-02-spo2-14', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-02-spo2-15', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-02-spo2-16', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-02-spo2-17', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-02-spo2-18', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-02-spo2-19', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-02-spo2-20', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-02-spo2-21', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-02-spo2-22', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-02-spo2-23', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-02-spo2-24', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-02-spo2-25', 256), TRUE),
  (@sid, 86, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-02-spo2-26', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-02-spo2-27', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-02-spo2-28', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-02-spo2-29', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-02-spo2-30', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-02-spo2-31', 256), TRUE),
  (@sid, 84, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-02-spo2-32', 256), TRUE),
  (@sid, 84, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-02-spo2-33', 256), TRUE),
  (@sid, 84, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-02-spo2-34', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-02-spo2-35', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-02-spo2-36', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-02-spo2-37', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-02-spo2-38', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-02-spo2-39', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-02-spo2-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-18', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-19', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-20', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-21', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-22', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-23', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-24', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-25', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 86% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-26', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-27', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-29', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 84% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 84% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 84% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 83% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 83% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 83% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 83% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 83% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 83% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-spo2-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-02'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-02' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 16, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-02-resp-0', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-02-resp-1', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-02-resp-2', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-02-resp-3', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-02-resp-4', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-02-resp-5', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-02-resp-6', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-02-resp-7', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-02-resp-8', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-02-resp-9', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-02-resp-10', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-02-resp-11', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-02-resp-12', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-02-resp-13', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-02-resp-14', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-02-resp-15', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-02-resp-16', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-02-resp-17', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-02-resp-18', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-02-resp-19', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-02-resp-20', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-02-resp-21', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-02-resp-22', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-02-resp-23', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-02-resp-24', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-02-resp-25', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-02-resp-26', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-02-resp-27', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-02-resp-28', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-02-resp-29', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-02-resp-30', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-02-resp-31', 256), TRUE),
  (@sid, 29, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-02-resp-32', 256), TRUE),
  (@sid, 29, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-02-resp-33', 256), TRUE),
  (@sid, 30, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-02-resp-34', 256), TRUE),
  (@sid, 29, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-02-resp-35', 256), TRUE),
  (@sid, 31, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-02-resp-36', 256), TRUE),
  (@sid, 31, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-02-resp-37', 256), TRUE),
  (@sid, 31, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-02-resp-38', 256), TRUE),
  (@sid, 31, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-02-resp-39', 256), TRUE),
  (@sid, 31, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-02-resp-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'resp_fuera_de_rango', 'alta', 'Respiración estimada 31 rpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-resp-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'resp_fuera_de_rango', 'alta', 'Respiración estimada 31 rpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-resp-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'resp_fuera_de_rango', 'alta', 'Respiración estimada 31 rpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-resp-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'resp_fuera_de_rango', 'alta', 'Respiración estimada 31 rpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-resp-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'resp_fuera_de_rango', 'alta', 'Respiración estimada 31 rpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-02-resp-40', 256);

-- Anselmo Ruiz Cardoza
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Anselmo Ruiz Cardoza', 'DEMO-0003', '1953-11-27', 'M', 'B+', 'Familiar de prueba (555-0103)', 'inService', 'Tos con expectoración purulenta y dificultad para respirar', NOW() - INTERVAL 30 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0003'), 'Reagudización de enfermedad pulmonar crónica. Usa oxígeno suplementario.', NOW() - INTERVAL 30 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0003'), 'personal', 'EPOC diagnosticado hace 15 años', NULL, 2011, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0003'), 'habito', 'Tabaquismo, 40 paquetes-año', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0003'), 'Sulfonamidas', 'Erupción cutánea', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0003'), 'Salbutamol', '2 inhalaciones', 'inhalada', 'cada 6 h', 'Broncodilatador', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0003'), 'Tiotropio', '18 mcg', 'inhalada', 'cada 24 h', 'EPOC', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0003'), 'Prednisona', '40 mg', 'oral', 'cada 24 h', 'Reagudización', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0003'), 'J44.1', 'EPOC con exacerbación aguda', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0003'), (SELECT cama_id FROM cama WHERE codigo='UCI-03'), 'urgencia', 'activo', 'Tos con expectoración purulenta y dificultad para respirar', NOW() - INTERVAL 30 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='UCI-03';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0003'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0003'), 'DEMO-DEV-03', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 30 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-03'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-03' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 100, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-03-hr-0', 256), TRUE),
  (@sid, 102, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-03-hr-1', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-03-hr-2', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-03-hr-3', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-03-hr-4', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-03-hr-5', 256), TRUE),
  (@sid, 102, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-03-hr-6', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-03-hr-7', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-03-hr-8', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-03-hr-9', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-03-hr-10', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-03-hr-11', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-03-hr-12', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-03-hr-13', 256), TRUE),
  (@sid, 104, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-03-hr-14', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-03-hr-15', 256), TRUE),
  (@sid, 105, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-03-hr-16', 256), TRUE),
  (@sid, 104, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-03-hr-17', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-03-hr-18', 256), TRUE),
  (@sid, 107, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-03-hr-19', 256), TRUE),
  (@sid, 107, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-03-hr-20', 256), TRUE),
  (@sid, 105, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-03-hr-21', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-03-hr-22', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-03-hr-23', 256), TRUE),
  (@sid, 107, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-03-hr-24', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-03-hr-25', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-03-hr-26', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-03-hr-27', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-03-hr-28', 256), TRUE),
  (@sid, 108, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-03-hr-29', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-03-hr-30', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-03-hr-31', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-03-hr-32', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-03-hr-33', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-03-hr-34', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-03-hr-35', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-03-hr-36', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-03-hr-37', 256), TRUE),
  (@sid, 114, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-03-hr-38', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-03-hr-39', 256), TRUE),
  (@sid, 114, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-03-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-03'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-03' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 90, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-03-spo2-0', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-03-spo2-1', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-03-spo2-2', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-03-spo2-3', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-03-spo2-4', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-03-spo2-5', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-03-spo2-6', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-03-spo2-7', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-03-spo2-8', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-03-spo2-9', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-03-spo2-10', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-03-spo2-11', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-03-spo2-12', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-03-spo2-13', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-03-spo2-14', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-03-spo2-15', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-03-spo2-16', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-03-spo2-17', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-03-spo2-18', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-03-spo2-19', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-03-spo2-20', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-03-spo2-21', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-03-spo2-22', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-03-spo2-23', 256), TRUE),
  (@sid, 86, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-03-spo2-24', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-03-spo2-25', 256), TRUE),
  (@sid, 86, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-03-spo2-26', 256), TRUE),
  (@sid, 86, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-03-spo2-27', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-03-spo2-28', 256), TRUE),
  (@sid, 86, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-03-spo2-29', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-03-spo2-30', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-03-spo2-31', 256), TRUE),
  (@sid, 86, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-03-spo2-32', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-03-spo2-33', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-03-spo2-34', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-03-spo2-35', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-03-spo2-36', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-03-spo2-37', 256), TRUE),
  (@sid, 84, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-03-spo2-38', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-03-spo2-39', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-03-spo2-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-6', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-7', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-8', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-10', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-11', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-12', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-13', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-14', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-15', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-16', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-17', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-18', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-19', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-20', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-21', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-22', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-23', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 86% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-24', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-25', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 86% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-26', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 86% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-27', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 87% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 86% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-29', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 86% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'critica', 'SpO2 84% crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 85% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-03-spo2-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-03'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-03' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 22, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-03-resp-0', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-03-resp-1', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-03-resp-2', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-03-resp-3', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-03-resp-4', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-03-resp-5', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-03-resp-6', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-03-resp-7', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-03-resp-8', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-03-resp-9', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-03-resp-10', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-03-resp-11', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-03-resp-12', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-03-resp-13', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-03-resp-14', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-03-resp-15', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-03-resp-16', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-03-resp-17', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-03-resp-18', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-03-resp-19', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-03-resp-20', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-03-resp-21', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-03-resp-22', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-03-resp-23', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-03-resp-24', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-03-resp-25', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-03-resp-26', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-03-resp-27', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-03-resp-28', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-03-resp-29', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-03-resp-30', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-03-resp-31', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-03-resp-32', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-03-resp-33', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-03-resp-34', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-03-resp-35', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-03-resp-36', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-03-resp-37', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-03-resp-38', 256), TRUE),
  (@sid, 29, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-03-resp-39', 256), TRUE),
  (@sid, 28, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-03-resp-40', 256), TRUE);

-- Darío Vallejo Pinto
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Darío Vallejo Pinto', 'DEMO-0004', '1996-06-19', 'M', 'O-', 'Familiar de prueba (555-0104)', 'inService', 'Accidente de motocicleta, dolor abdominal y deformidad de muslo', NOW() - INTERVAL 3 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0004'), 'Politraumatizado. Abdomen doloroso a la palpación, fractura de fémur izquierdo.', NOW() - INTERVAL 3 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0004'), 'personal', 'Sin antecedentes patológicos conocidos', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0004'), 'Látex', 'Dermatitis de contacto', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0004'), 'Morfina', '3 mg', 'intravenosa', 'según dolor', 'Analgesia', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0004'), 'Ácido tranexámico', '1 g', 'intravenosa', 'dosis única', 'Control de sangrado', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0004'), 'S36.9', 'Traumatismo abdominal cerrado', 'presuntivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0004'), 'S72.9', 'Fractura de fémur', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0004'), (SELECT cama_id FROM cama WHERE codigo='TR-01'), 'urgencia', 'activo', 'Accidente de motocicleta, dolor abdominal y deformidad de muslo', NOW() - INTERVAL 3 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='TR-01';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0004'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0004'), 'DEMO-DEV-04', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 3 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-04'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-04' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 100, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-04-hr-0', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-04-hr-1', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-04-hr-2', 256), TRUE),
  (@sid, 101, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-04-hr-3', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-04-hr-4', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-04-hr-5', 256), TRUE),
  (@sid, 102, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-04-hr-6', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-04-hr-7', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-04-hr-8', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-04-hr-9', 256), TRUE),
  (@sid, 108, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-04-hr-10', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-04-hr-11', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-04-hr-12', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-04-hr-13', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-04-hr-14', 256), TRUE),
  (@sid, 115, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-04-hr-15', 256), TRUE),
  (@sid, 119, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-04-hr-16', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-04-hr-17', 256), TRUE),
  (@sid, 121, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-04-hr-18', 256), TRUE),
  (@sid, 122, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-04-hr-19', 256), TRUE),
  (@sid, 122, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-04-hr-20', 256), TRUE),
  (@sid, 124, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-04-hr-21', 256), TRUE),
  (@sid, 127, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-04-hr-22', 256), TRUE),
  (@sid, 129, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-04-hr-23', 256), TRUE),
  (@sid, 133, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-04-hr-24', 256), TRUE),
  (@sid, 131, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-04-hr-25', 256), TRUE),
  (@sid, 136, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-04-hr-26', 256), TRUE),
  (@sid, 136, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-04-hr-27', 256), TRUE),
  (@sid, 139, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-04-hr-28', 256), TRUE),
  (@sid, 138, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-04-hr-29', 256), TRUE),
  (@sid, 141, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-04-hr-30', 256), TRUE),
  (@sid, 144, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-04-hr-31', 256), TRUE),
  (@sid, 143, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-04-hr-32', 256), TRUE),
  (@sid, 143, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-04-hr-33', 256), TRUE),
  (@sid, 147, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-04-hr-34', 256), TRUE),
  (@sid, 144, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-04-hr-35', 256), TRUE),
  (@sid, 148, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-04-hr-36', 256), TRUE),
  (@sid, 145, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-04-hr-37', 256), TRUE),
  (@sid, 148, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-04-hr-38', 256), TRUE),
  (@sid, 146, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-04-hr-39', 256), TRUE),
  (@sid, 149, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-04-hr-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 121 bpm fuera de rango', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-18', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 122 bpm fuera de rango', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-19', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 122 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-20', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 124 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-21', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 127 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-22', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 129 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-23', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 133 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-24', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 131 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-25', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 136 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-26', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 136 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-27', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 139 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 138 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-29', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 141 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 144 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 143 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 143 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 147 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 144 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 148 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 145 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 148 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 146 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 149 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-04-hr-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-04'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-04' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 96, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-04-spo2-0', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-04-spo2-1', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-04-spo2-2', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-04-spo2-3', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-04-spo2-4', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-04-spo2-5', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-04-spo2-6', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-04-spo2-7', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-04-spo2-8', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-04-spo2-9', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-04-spo2-10', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-04-spo2-11', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-04-spo2-12', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-04-spo2-13', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-04-spo2-14', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-04-spo2-15', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-04-spo2-16', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-04-spo2-17', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-04-spo2-18', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-04-spo2-19', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-04-spo2-20', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-04-spo2-21', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-04-spo2-22', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-04-spo2-23', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-04-spo2-24', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-04-spo2-25', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-04-spo2-26', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-04-spo2-27', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-04-spo2-28', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-04-spo2-29', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-04-spo2-30', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-04-spo2-31', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-04-spo2-32', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-04-spo2-33', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-04-spo2-34', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-04-spo2-35', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-04-spo2-36', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-04-spo2-37', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-04-spo2-38', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-04-spo2-39', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-04-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-04'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-04' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 19, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-04-resp-0', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-04-resp-1', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-04-resp-2', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-04-resp-3', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-04-resp-4', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-04-resp-5', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-04-resp-6', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-04-resp-7', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-04-resp-8', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-04-resp-9', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-04-resp-10', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-04-resp-11', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-04-resp-12', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-04-resp-13', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-04-resp-14', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-04-resp-15', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-04-resp-16', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-04-resp-17', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-04-resp-18', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-04-resp-19', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-04-resp-20', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-04-resp-21', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-04-resp-22', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-04-resp-23', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-04-resp-24', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-04-resp-25', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-04-resp-26', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-04-resp-27', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-04-resp-28', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-04-resp-29', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-04-resp-30', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-04-resp-31', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-04-resp-32', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-04-resp-33', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-04-resp-34', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-04-resp-35', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-04-resp-36', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-04-resp-37', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-04-resp-38', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-04-resp-39', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-04-resp-40', 256), TRUE);

-- Yamileth Orozco Arce
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Yamileth Orozco Arce', 'DEMO-0005', '1944-12-08', 'F', 'AB+', 'Familiar de prueba (555-0105)', 'inService', 'Mareo, debilidad y casi desmayo', NOW() - INTERVAL 9 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0005'), 'Adulta mayor con fibrilación auricular crónica en tratamiento con digoxina.', NOW() - INTERVAL 9 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'personal', 'Fibrilación auricular crónica', NULL, 2015, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'personal', 'Insuficiencia cardíaca', NULL, 2019, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'Antiinflamatorios no esteroideos', 'Broncoespasmo', 'moderada', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'Digoxina', '0.25 mg', 'oral', 'cada 24 h', 'Control de frecuencia', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'Bisoprolol', '5 mg', 'oral', 'cada 24 h', 'Control de frecuencia', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'Furosemida', '40 mg', 'oral', 'cada 24 h', 'Insuficiencia cardíaca', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'Warfarina', '5 mg', 'oral', 'cada 24 h', 'Anticoagulación', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'R00.1', 'Bradicardia, no especificada', 'presuntivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0005'), 'I48', 'Fibrilación auricular', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0005'), (SELECT cama_id FROM cama WHERE codigo='UCI-04'), 'urgencia', 'activo', 'Mareo, debilidad y casi desmayo', NOW() - INTERVAL 9 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='UCI-04';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0005'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0005'), 'DEMO-DEV-05', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 9 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-05'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-05' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 61, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-05-hr-0', 256), TRUE),
  (@sid, 61, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-05-hr-1', 256), TRUE),
  (@sid, 59, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-05-hr-2', 256), TRUE),
  (@sid, 58, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-05-hr-3', 256), TRUE),
  (@sid, 58, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-05-hr-4', 256), TRUE),
  (@sid, 60, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-05-hr-5', 256), TRUE),
  (@sid, 59, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-05-hr-6', 256), TRUE),
  (@sid, 60, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-05-hr-7', 256), TRUE),
  (@sid, 56, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-05-hr-8', 256), TRUE),
  (@sid, 58, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-05-hr-9', 256), TRUE),
  (@sid, 57, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-05-hr-10', 256), TRUE),
  (@sid, 54, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-05-hr-11', 256), TRUE),
  (@sid, 54, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-05-hr-12', 256), TRUE),
  (@sid, 53, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-05-hr-13', 256), TRUE),
  (@sid, 53, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-05-hr-14', 256), TRUE),
  (@sid, 52, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-05-hr-15', 256), TRUE),
  (@sid, 50, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-05-hr-16', 256), TRUE),
  (@sid, 50, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-05-hr-17', 256), TRUE),
  (@sid, 49, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-05-hr-18', 256), TRUE),
  (@sid, 50, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-05-hr-19', 256), TRUE),
  (@sid, 49, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-05-hr-20', 256), TRUE),
  (@sid, 47, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-05-hr-21', 256), TRUE),
  (@sid, 47, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-05-hr-22', 256), TRUE),
  (@sid, 44, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-05-hr-23', 256), TRUE),
  (@sid, 46, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-05-hr-24', 256), TRUE),
  (@sid, 42, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-05-hr-25', 256), TRUE),
  (@sid, 42, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-05-hr-26', 256), TRUE),
  (@sid, 43, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-05-hr-27', 256), TRUE),
  (@sid, 42, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-05-hr-28', 256), TRUE),
  (@sid, 39, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-05-hr-29', 256), TRUE),
  (@sid, 42, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-05-hr-30', 256), TRUE),
  (@sid, 39, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-05-hr-31', 256), TRUE),
  (@sid, 40, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-05-hr-32', 256), TRUE),
  (@sid, 37, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-05-hr-33', 256), TRUE),
  (@sid, 38, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-05-hr-34', 256), TRUE),
  (@sid, 39, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-05-hr-35', 256), TRUE),
  (@sid, 37, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-05-hr-36', 256), TRUE),
  (@sid, 38, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-05-hr-37', 256), TRUE),
  (@sid, 34, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-05-hr-38', 256), TRUE),
  (@sid, 38, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-05-hr-39', 256), TRUE),
  (@sid, 35, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-05-hr-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 49 bpm fuera de rango', 'reconocida', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-18', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 49 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-20', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 47 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-21', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 47 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-22', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 44 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-23', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 46 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-24', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 42 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-25', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 42 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-26', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 43 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-27', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 42 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 39 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-29', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 42 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 39 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 40 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 37 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 38 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 39 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 37 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 38 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 34 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 38 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 35 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-05-hr-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-05'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-05' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 96, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-05-spo2-0', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-05-spo2-1', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-05-spo2-2', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-05-spo2-3', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-05-spo2-4', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-05-spo2-5', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-05-spo2-6', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-05-spo2-7', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-05-spo2-8', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-05-spo2-9', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-05-spo2-10', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-05-spo2-11', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-05-spo2-12', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-05-spo2-13', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-05-spo2-14', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-05-spo2-15', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-05-spo2-16', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-05-spo2-17', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-05-spo2-18', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-05-spo2-19', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-05-spo2-20', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-05-spo2-21', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-05-spo2-22', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-05-spo2-23', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-05-spo2-24', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-05-spo2-25', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-05-spo2-26', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-05-spo2-27', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-05-spo2-28', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-05-spo2-29', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-05-spo2-30', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-05-spo2-31', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-05-spo2-32', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-05-spo2-33', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-05-spo2-34', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-05-spo2-35', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-05-spo2-36', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-05-spo2-37', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-05-spo2-38', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-05-spo2-39', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-05-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-05'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-05' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 15, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-05-resp-0', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-05-resp-1', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-05-resp-2', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-05-resp-3', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-05-resp-4', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-05-resp-5', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-05-resp-6', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-05-resp-7', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-05-resp-8', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-05-resp-9', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-05-resp-10', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-05-resp-11', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-05-resp-12', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-05-resp-13', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-05-resp-14', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-05-resp-15', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-05-resp-16', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-05-resp-17', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-05-resp-18', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-05-resp-19', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-05-resp-20', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-05-resp-21', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-05-resp-22', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-05-resp-23', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-05-resp-24', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-05-resp-25', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-05-resp-26', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-05-resp-27', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-05-resp-28', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-05-resp-29', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-05-resp-30', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-05-resp-31', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-05-resp-32', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-05-resp-33', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-05-resp-34', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-05-resp-35', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-05-resp-36', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-05-resp-37', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-05-resp-38', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-05-resp-39', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-05-resp-40', 256), TRUE);

-- Teodoro Lasso Mejía
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Teodoro Lasso Mejía', 'DEMO-0006', '1966-05-30', 'M', 'A-', 'Familiar de prueba (555-0106)', 'inService', 'Palpitaciones y opresión en el pecho', NOW() - INTERVAL 6 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0006'), 'Inicio brusco de palpitaciones durante esfuerzo. Sudoración fría.', NOW() - INTERVAL 6 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'personal', 'Hipertensión arterial', NULL, 2014, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'personal', 'Dislipidemia', NULL, 2017, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'familiar', 'Infarto de miocardio a los 52 años', 'Padre', NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'Atorvastatina', '40 mg', 'oral', 'cada 24 h', 'Dislipidemia', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'Amlodipino', '5 mg', 'oral', 'cada 24 h', 'Hipertensión', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'Ácido acetilsalicílico', '100 mg', 'oral', 'cada 24 h', 'Prevención cardiovascular', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'I47.9', 'Taquicardia paroxística', 'presuntivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0006'), 'R07.4', 'Dolor torácico', 'diferencial', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0006'), (SELECT cama_id FROM cama WHERE codigo='UCI-05'), 'urgencia', 'activo', 'Palpitaciones y opresión en el pecho', NOW() - INTERVAL 6 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='UCI-05';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0006'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0006'), 'DEMO-DEV-06', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 6 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-06'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-06' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 89, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-06-hr-0', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-06-hr-1', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-06-hr-2', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-06-hr-3', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-06-hr-4', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-06-hr-5', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-06-hr-6', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-06-hr-7', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-06-hr-8', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-06-hr-9', 256), TRUE),
  (@sid, 100, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-06-hr-10', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-06-hr-11', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-06-hr-12', 256), TRUE),
  (@sid, 102, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-06-hr-13', 256), TRUE),
  (@sid, 107, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-06-hr-14', 256), TRUE),
  (@sid, 108, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-06-hr-15', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-06-hr-16', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-06-hr-17', 256), TRUE),
  (@sid, 116, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-06-hr-18', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-06-hr-19', 256), TRUE),
  (@sid, 120, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-06-hr-20', 256), TRUE),
  (@sid, 122, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-06-hr-21', 256), TRUE),
  (@sid, 124, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-06-hr-22', 256), TRUE),
  (@sid, 126, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-06-hr-23', 256), TRUE),
  (@sid, 128, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-06-hr-24', 256), TRUE),
  (@sid, 130, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-06-hr-25', 256), TRUE),
  (@sid, 133, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-06-hr-26', 256), TRUE),
  (@sid, 137, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-06-hr-27', 256), TRUE),
  (@sid, 136, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-06-hr-28', 256), TRUE),
  (@sid, 141, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-06-hr-29', 256), TRUE),
  (@sid, 143, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-06-hr-30', 256), TRUE),
  (@sid, 144, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-06-hr-31', 256), TRUE),
  (@sid, 144, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-06-hr-32', 256), TRUE),
  (@sid, 148, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-06-hr-33', 256), TRUE),
  (@sid, 148, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-06-hr-34', 256), TRUE),
  (@sid, 147, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-06-hr-35', 256), TRUE),
  (@sid, 152, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-06-hr-36', 256), TRUE),
  (@sid, 151, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-06-hr-37', 256), TRUE),
  (@sid, 153, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-06-hr-38', 256), TRUE),
  (@sid, 151, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-06-hr-39', 256), TRUE),
  (@sid, 150, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-06-hr-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 122 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-21', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 124 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-22', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 126 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-23', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 128 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-24', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 130 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-25', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 133 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-26', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 137 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-27', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'alta', 'Frecuencia cardiaca 136 bpm fuera de rango', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 141 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-29', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 143 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 144 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-31', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 144 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 148 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 148 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-34', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 147 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-35', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 152 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 151 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 153 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 151 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'hr_fuera_de_rango', 'critica', 'Frecuencia cardiaca 150 bpm fuera de rango crítico', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-06-hr-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-06'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-06' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 96, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-06-spo2-0', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-06-spo2-1', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-06-spo2-2', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-06-spo2-3', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-06-spo2-4', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-06-spo2-5', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-06-spo2-6', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-06-spo2-7', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-06-spo2-8', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-06-spo2-9', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-06-spo2-10', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-06-spo2-11', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-06-spo2-12', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-06-spo2-13', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-06-spo2-14', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-06-spo2-15', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-06-spo2-16', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-06-spo2-17', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-06-spo2-18', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-06-spo2-19', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-06-spo2-20', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-06-spo2-21', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-06-spo2-22', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-06-spo2-23', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-06-spo2-24', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-06-spo2-25', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-06-spo2-26', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-06-spo2-27', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-06-spo2-28', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-06-spo2-29', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-06-spo2-30', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-06-spo2-31', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-06-spo2-32', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-06-spo2-33', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-06-spo2-34', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-06-spo2-35', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-06-spo2-36', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-06-spo2-37', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-06-spo2-38', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-06-spo2-39', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-06-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-06'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-06' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 16, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-06-resp-0', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-06-resp-1', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-06-resp-2', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-06-resp-3', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-06-resp-4', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-06-resp-5', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-06-resp-6', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-06-resp-7', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-06-resp-8', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-06-resp-9', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-06-resp-10', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-06-resp-11', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-06-resp-12', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-06-resp-13', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-06-resp-14', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-06-resp-15', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-06-resp-16', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-06-resp-17', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-06-resp-18', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-06-resp-19', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-06-resp-20', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-06-resp-21', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-06-resp-22', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-06-resp-23', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-06-resp-24', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-06-resp-25', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-06-resp-26', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-06-resp-27', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-06-resp-28', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-06-resp-29', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-06-resp-30', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-06-resp-31', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-06-resp-32', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-06-resp-33', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-06-resp-34', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-06-resp-35', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-06-resp-36', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-06-resp-37', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-06-resp-38', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-06-resp-39', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-06-resp-40', 256), TRUE);

-- Paloma Esquivel Núñez
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Paloma Esquivel Núñez', 'DEMO-0007', '1987-02-11', 'F', 'O+', 'Familiar de prueba (555-0107)', 'inService', 'Fiebre y tos con dolor al respirar', NOW() - INTERVAL 52 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0007'), 'Neumonía adquirida en la comunidad, en mejoría con antibiótico.', NOW() - INTERVAL 52 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0007'), 'personal', 'Asma leve en la infancia', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0007'), 'Ibuprofeno', 'Náuseas y erupción', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0007'), 'Amoxicilina con ácido clavulánico', '875/125 mg', 'oral', 'cada 12 h', 'Neumonía', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0007'), 'Paracetamol', '500 mg', 'oral', 'cada 8 h', 'Fiebre', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0007'), 'J18.9', 'Neumonía, no especificada', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0007'), (SELECT cama_id FROM cama WHERE codigo='P3-01'), 'urgencia', 'activo', 'Fiebre y tos con dolor al respirar', NOW() - INTERVAL 52 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='P3-01';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0007'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0007'), 'DEMO-DEV-07', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 52 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-07'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-07' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 95, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-07-hr-0', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-07-hr-1', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-07-hr-2', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-07-hr-3', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-07-hr-4', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-07-hr-5', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-07-hr-6', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-07-hr-7', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-07-hr-8', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-07-hr-9', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-07-hr-10', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-07-hr-11', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-07-hr-12', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-07-hr-13', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-07-hr-14', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-07-hr-15', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-07-hr-16', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-07-hr-17', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-07-hr-18', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-07-hr-19', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-07-hr-20', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-07-hr-21', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-07-hr-22', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-07-hr-23', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-07-hr-24', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-07-hr-25', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-07-hr-26', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-07-hr-27', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-07-hr-28', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-07-hr-29', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-07-hr-30', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-07-hr-31', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-07-hr-32', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-07-hr-33', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-07-hr-34', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-07-hr-35', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-07-hr-36', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-07-hr-37', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-07-hr-38', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-07-hr-39', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-07-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-07'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-07' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 92, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-07-spo2-0', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-07-spo2-1', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-07-spo2-2', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-07-spo2-3', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-07-spo2-4', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-07-spo2-5', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-07-spo2-6', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-07-spo2-7', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-07-spo2-8', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-07-spo2-9', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-07-spo2-10', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-07-spo2-11', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-07-spo2-12', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-07-spo2-13', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-07-spo2-14', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-07-spo2-15', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-07-spo2-16', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-07-spo2-17', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-07-spo2-18', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-07-spo2-19', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-07-spo2-20', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-07-spo2-21', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-07-spo2-22', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-07-spo2-23', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-07-spo2-24', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-07-spo2-25', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-07-spo2-26', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-07-spo2-27', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-07-spo2-28', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-07-spo2-29', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-07-spo2-30', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-07-spo2-31', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-07-spo2-32', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-07-spo2-33', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-07-spo2-34', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-07-spo2-35', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-07-spo2-36', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-07-spo2-37', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-07-spo2-38', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-07-spo2-39', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-07-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-07'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-07' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 25, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-07-resp-0', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-07-resp-1', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-07-resp-2', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-07-resp-3', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-07-resp-4', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-07-resp-5', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-07-resp-6', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-07-resp-7', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-07-resp-8', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-07-resp-9', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-07-resp-10', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-07-resp-11', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-07-resp-12', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-07-resp-13', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-07-resp-14', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-07-resp-15', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-07-resp-16', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-07-resp-17', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-07-resp-18', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-07-resp-19', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-07-resp-20', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-07-resp-21', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-07-resp-22', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-07-resp-23', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-07-resp-24', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-07-resp-25', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-07-resp-26', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-07-resp-27', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-07-resp-28', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-07-resp-29', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-07-resp-30', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-07-resp-31', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-07-resp-32', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-07-resp-33', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-07-resp-34', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-07-resp-35', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-07-resp-36', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-07-resp-37', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-07-resp-38', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-07-resp-39', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-07-resp-40', 256), TRUE);

-- Cristian Barrios Tello
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Cristian Barrios Tello', 'DEMO-0008', '1979-08-23', 'M', 'B+', 'Familiar de prueba (555-0108)', 'inService', 'Dolor abdominal intenso con vómitos', NOW() - INTERVAL 40 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0008'), 'Pancreatitis aguda. Ayuno e hidratación intravenosa.', NOW() - INTERVAL 40 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0008'), 'habito', 'Consumo frecuente de alcohol', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0008'), 'quirurgico', 'Apendicectomía', NULL, 2001, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0008'), 'Tramadol', '50 mg', 'intravenosa', 'cada 8 h', 'Dolor', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0008'), 'Omeprazol', '40 mg', 'intravenosa', 'cada 24 h', 'Protección gástrica', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0008'), 'Solución Hartmann', '125 mL/h', 'intravenosa', 'continua', 'Hidratación', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0008'), 'K85.9', 'Pancreatitis aguda', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0008'), (SELECT cama_id FROM cama WHERE codigo='P3-02'), 'urgencia', 'activo', 'Dolor abdominal intenso con vómitos', NOW() - INTERVAL 40 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='P3-02';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0008'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0008'), 'DEMO-DEV-08', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 40 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-08'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-08' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 103, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-08-hr-0', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-08-hr-1', 256), TRUE),
  (@sid, 105, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-08-hr-2', 256), TRUE),
  (@sid, 104, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-08-hr-3', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-08-hr-4', 256), TRUE),
  (@sid, 104, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-08-hr-5', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-08-hr-6', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-08-hr-7', 256), TRUE),
  (@sid, 103, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-08-hr-8', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-08-hr-9', 256), TRUE),
  (@sid, 105, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-08-hr-10', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-08-hr-11', 256), TRUE),
  (@sid, 108, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-08-hr-12', 256), TRUE),
  (@sid, 107, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-08-hr-13', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-08-hr-14', 256), TRUE),
  (@sid, 105, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-08-hr-15', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-08-hr-16', 256), TRUE),
  (@sid, 106, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-08-hr-17', 256), TRUE),
  (@sid, 105, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-08-hr-18', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-08-hr-19', 256), TRUE),
  (@sid, 108, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-08-hr-20', 256), TRUE),
  (@sid, 108, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-08-hr-21', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-08-hr-22', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-08-hr-23', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-08-hr-24', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-08-hr-25', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-08-hr-26', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-08-hr-27', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-08-hr-28', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-08-hr-29', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-08-hr-30', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-08-hr-31', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-08-hr-32', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-08-hr-33', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-08-hr-34', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-08-hr-35', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-08-hr-36', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-08-hr-37', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-08-hr-38', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-08-hr-39', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-08-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-08'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-08' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 95, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-08-spo2-0', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-08-spo2-1', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-08-spo2-2', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-08-spo2-3', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-08-spo2-4', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-08-spo2-5', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-08-spo2-6', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-08-spo2-7', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-08-spo2-8', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-08-spo2-9', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-08-spo2-10', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-08-spo2-11', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-08-spo2-12', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-08-spo2-13', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-08-spo2-14', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-08-spo2-15', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-08-spo2-16', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-08-spo2-17', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-08-spo2-18', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-08-spo2-19', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-08-spo2-20', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-08-spo2-21', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-08-spo2-22', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-08-spo2-23', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-08-spo2-24', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-08-spo2-25', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-08-spo2-26', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-08-spo2-27', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-08-spo2-28', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-08-spo2-29', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-08-spo2-30', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-08-spo2-31', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-08-spo2-32', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-08-spo2-33', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-08-spo2-34', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-08-spo2-35', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-08-spo2-36', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-08-spo2-37', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-08-spo2-38', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-08-spo2-39', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-08-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-08'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-08' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 20, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-08-resp-0', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-08-resp-1', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-08-resp-2', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-08-resp-3', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-08-resp-4', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-08-resp-5', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-08-resp-6', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-08-resp-7', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-08-resp-8', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-08-resp-9', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-08-resp-10', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-08-resp-11', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-08-resp-12', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-08-resp-13', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-08-resp-14', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-08-resp-15', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-08-resp-16', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-08-resp-17', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-08-resp-18', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-08-resp-19', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-08-resp-20', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-08-resp-21', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-08-resp-22', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-08-resp-23', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-08-resp-24', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-08-resp-25', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-08-resp-26', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-08-resp-27', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-08-resp-28', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-08-resp-29', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-08-resp-30', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-08-resp-31', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-08-resp-32', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-08-resp-33', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-08-resp-34', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-08-resp-35', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-08-resp-36', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-08-resp-37', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-08-resp-38', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-08-resp-39', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-08-resp-40', 256), TRUE);

-- Marisol Caicedo Rey
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Marisol Caicedo Rey', 'DEMO-0009', '1961-10-04', 'F', 'A+', 'Familiar de prueba (555-0109)', 'inService', 'Hinchazón de piernas y falta de aire al acostarse', NOW() - INTERVAL 26 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0009'), 'Insuficiencia cardíaca descompensada. Edema de miembros inferiores.', NOW() - INTERVAL 26 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0009'), 'personal', 'Insuficiencia cardíaca con fracción de eyección reducida', NULL, 2020, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0009'), 'personal', 'Hipertensión arterial', NULL, 2005, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0009'), 'Yodo', 'Prurito', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0009'), 'Furosemida', '40 mg', 'intravenosa', 'cada 12 h', 'Congestión', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0009'), 'Carvedilol', '6.25 mg', 'oral', 'cada 12 h', 'Insuficiencia cardíaca', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0009'), 'Losartán', '50 mg', 'oral', 'cada 24 h', 'Hipertensión', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0009'), 'I50.9', 'Insuficiencia cardíaca', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0009'), (SELECT cama_id FROM cama WHERE codigo='P3-03'), 'programado', 'activo', 'Hinchazón de piernas y falta de aire al acostarse', NOW() - INTERVAL 26 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='P3-03';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0009'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0009'), 'DEMO-DEV-09', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 26 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-09'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-09' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 83, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-09-hr-0', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-09-hr-1', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-09-hr-2', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-09-hr-3', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-09-hr-4', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-09-hr-5', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-09-hr-6', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-09-hr-7', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-09-hr-8', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-09-hr-9', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-09-hr-10', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-09-hr-11', 256), TRUE),
  (@sid, 85, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-09-hr-12', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-09-hr-13', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-09-hr-14', 256), TRUE),
  (@sid, 86, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-09-hr-15', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-09-hr-16', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-09-hr-17', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-09-hr-18', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-09-hr-19', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-09-hr-20', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-09-hr-21', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-09-hr-22', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-09-hr-23', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-09-hr-24', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-09-hr-25', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-09-hr-26', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-09-hr-27', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-09-hr-28', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-09-hr-29', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-09-hr-30', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-09-hr-31', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-09-hr-32', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-09-hr-33', 256), TRUE),
  (@sid, 94, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-09-hr-34', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-09-hr-35', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-09-hr-36', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-09-hr-37', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-09-hr-38', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-09-hr-39', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-09-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-09'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-09' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 92, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-09-spo2-0', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-09-spo2-1', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-09-spo2-2', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-09-spo2-3', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-09-spo2-4', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-09-spo2-5', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-09-spo2-6', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-09-spo2-7', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-09-spo2-8', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-09-spo2-9', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-09-spo2-10', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-09-spo2-11', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-09-spo2-12', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-09-spo2-13', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-09-spo2-14', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-09-spo2-15', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-09-spo2-16', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-09-spo2-17', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-09-spo2-18', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-09-spo2-19', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-09-spo2-20', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-09-spo2-21', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-09-spo2-22', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-09-spo2-23', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-09-spo2-24', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-09-spo2-25', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-09-spo2-26', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-09-spo2-27', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-09-spo2-28', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-09-spo2-29', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-09-spo2-30', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-09-spo2-31', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-09-spo2-32', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-09-spo2-33', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-09-spo2-34', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-09-spo2-35', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-09-spo2-36', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-09-spo2-37', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-09-spo2-38', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-09-spo2-39', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-09-spo2-40', 256), TRUE);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-28', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-30', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-32', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-33', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-36', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-37', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 88% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-38', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-39', 256);
INSERT INTO alerta (lectura_id, tipo, severidad, mensaje, estado, fecha_hora) SELECT lectura_id, 'spo2_bajo', 'alta', 'SpO2 89% bajo', 'abierta', fecha_hora FROM lectura WHERE hash_sha256=SHA2('demo-DEMO-DEV-09-spo2-40', 256);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-09'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-09' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 19, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-09-resp-0', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-09-resp-1', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-09-resp-2', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-09-resp-3', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-09-resp-4', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-09-resp-5', 256), TRUE),
  (@sid, 19, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-09-resp-6', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-09-resp-7', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-09-resp-8', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-09-resp-9', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-09-resp-10', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-09-resp-11', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-09-resp-12', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-09-resp-13', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-09-resp-14', 256), TRUE),
  (@sid, 20, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-09-resp-15', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-09-resp-16', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-09-resp-17', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-09-resp-18', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-09-resp-19', 256), TRUE),
  (@sid, 22, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-09-resp-20', 256), TRUE),
  (@sid, 21, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-09-resp-21', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-09-resp-22', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-09-resp-23', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-09-resp-24', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-09-resp-25', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-09-resp-26', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-09-resp-27', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-09-resp-28', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-09-resp-29', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-09-resp-30', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-09-resp-31', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-09-resp-32', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-09-resp-33', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-09-resp-34', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-09-resp-35', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-09-resp-36', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-09-resp-37', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-09-resp-38', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-09-resp-39', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-09-resp-40', 256), TRUE);

-- Elías Ferrer Domínguez
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Elías Ferrer Domínguez', 'DEMO-0010', '2009-04-16', 'M', 'O+', 'Familiar de prueba (555-0110)', 'inService', 'Crisis de silbidos en el pecho tras ejercicio', NOW() - INTERVAL 8 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0010'), 'Crisis asmática moderada, responde parcialmente a broncodilatador.', NOW() - INTERVAL 8 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0010'), 'personal', 'Asma desde los 5 años', NULL, 2014, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0010'), 'familiar', 'Asma', 'Hermana', NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0010'), 'Polvo y ácaros', 'Rinitis y sibilancias', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0010'), 'Salbutamol', '4 inhalaciones', 'inhalada', 'cada 4 h', 'Crisis asmática', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0010'), 'Budesonida', '200 mcg', 'inhalada', 'cada 12 h', 'Control del asma', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0010'), 'J45.9', 'Asma', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0010'), (SELECT cama_id FROM cama WHERE codigo='P3-04'), 'urgencia', 'activo', 'Crisis de silbidos en el pecho tras ejercicio', NOW() - INTERVAL 8 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='P3-04';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0010'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0010'), 'DEMO-DEV-10', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 8 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-10'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-10' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 108, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-10-hr-0', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-10-hr-1', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-10-hr-2', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-10-hr-3', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-10-hr-4', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-10-hr-5', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-10-hr-6', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-10-hr-7', 256), TRUE),
  (@sid, 109, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-10-hr-8', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-10-hr-9', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-10-hr-10', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-10-hr-11', 256), TRUE),
  (@sid, 112, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-10-hr-12', 256), TRUE),
  (@sid, 110, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-10-hr-13', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-10-hr-14', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-10-hr-15', 256), TRUE),
  (@sid, 111, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-10-hr-16', 256), TRUE),
  (@sid, 115, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-10-hr-17', 256), TRUE),
  (@sid, 114, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-10-hr-18', 256), TRUE),
  (@sid, 115, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-10-hr-19', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-10-hr-20', 256), TRUE),
  (@sid, 113, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-10-hr-21', 256), TRUE),
  (@sid, 115, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-10-hr-22', 256), TRUE),
  (@sid, 115, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-10-hr-23', 256), TRUE),
  (@sid, 114, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-10-hr-24', 256), TRUE),
  (@sid, 116, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-10-hr-25', 256), TRUE),
  (@sid, 117, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-10-hr-26', 256), TRUE),
  (@sid, 114, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-10-hr-27', 256), TRUE),
  (@sid, 117, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-10-hr-28', 256), TRUE),
  (@sid, 115, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-10-hr-29', 256), TRUE),
  (@sid, 117, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-10-hr-30', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-10-hr-31', 256), TRUE),
  (@sid, 117, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-10-hr-32', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-10-hr-33', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-10-hr-34', 256), TRUE),
  (@sid, 119, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-10-hr-35', 256), TRUE),
  (@sid, 118, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-10-hr-36', 256), TRUE),
  (@sid, 116, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-10-hr-37', 256), TRUE),
  (@sid, 117, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-10-hr-38', 256), TRUE),
  (@sid, 117, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-10-hr-39', 256), TRUE),
  (@sid, 117, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-10-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-10'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-10' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 93, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-10-spo2-0', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-10-spo2-1', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-10-spo2-2', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-10-spo2-3', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-10-spo2-4', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-10-spo2-5', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-10-spo2-6', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-10-spo2-7', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-10-spo2-8', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-10-spo2-9', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-10-spo2-10', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-10-spo2-11', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-10-spo2-12', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-10-spo2-13', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-10-spo2-14', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-10-spo2-15', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-10-spo2-16', 256), TRUE),
  (@sid, 93, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-10-spo2-17', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-10-spo2-18', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-10-spo2-19', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-10-spo2-20', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-10-spo2-21', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-10-spo2-22', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-10-spo2-23', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-10-spo2-24', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-10-spo2-25', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-10-spo2-26', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-10-spo2-27', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-10-spo2-28', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-10-spo2-29', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-10-spo2-30', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-10-spo2-31', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-10-spo2-32', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-10-spo2-33', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-10-spo2-34', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-10-spo2-35', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-10-spo2-36', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-10-spo2-37', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-10-spo2-38', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-10-spo2-39', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-10-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-10'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-10' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 25, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-10-resp-0', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-10-resp-1', 256), TRUE),
  (@sid, 27, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-10-resp-2', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-10-resp-3', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-10-resp-4', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-10-resp-5', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-10-resp-6', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-10-resp-7', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-10-resp-8', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-10-resp-9', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-10-resp-10', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-10-resp-11', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-10-resp-12', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-10-resp-13', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-10-resp-14', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-10-resp-15', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-10-resp-16', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-10-resp-17', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-10-resp-18', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-10-resp-19', 256), TRUE),
  (@sid, 26, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-10-resp-20', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-10-resp-21', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-10-resp-22', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-10-resp-23', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-10-resp-24', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-10-resp-25', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-10-resp-26', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-10-resp-27', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-10-resp-28', 256), TRUE),
  (@sid, 23, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-10-resp-29', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-10-resp-30', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-10-resp-31', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-10-resp-32', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-10-resp-33', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-10-resp-34', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-10-resp-35', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-10-resp-36', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-10-resp-37', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-10-resp-38', 256), TRUE),
  (@sid, 24, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-10-resp-39', 256), TRUE),
  (@sid, 25, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-10-resp-40', 256), TRUE);

-- Graciela Arosemena Villa
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Graciela Arosemena Villa', 'DEMO-0011', '1974-01-29', 'F', 'AB-', 'Familiar de prueba (555-0111)', 'inService', 'Postoperatorio de colecistectomía laparoscópica', NOW() - INTERVAL 22 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0011'), 'Evolución sin complicaciones. Tolera dieta líquida.', NOW() - INTERVAL 22 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0011'), 'quirurgico', 'Cesárea', NULL, 2003, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0011'), 'ginecoobstetrico', 'Dos embarazos, dos partos', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0011'), 'Tramadol', 'Mareo intenso', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0011'), 'Paracetamol', '1 g', 'oral', 'cada 8 h', 'Dolor posoperatorio', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0011'), 'Cefazolina', '1 g', 'intravenosa', 'cada 8 h', 'Profilaxis', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0011'), 'K80.2', 'Colelitiasis', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0011'), (SELECT cama_id FROM cama WHERE codigo='P3-05'), 'programado', 'activo', 'Postoperatorio de colecistectomía laparoscópica', NOW() - INTERVAL 22 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='P3-05';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0011'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0011'), 'DEMO-DEV-11', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 22 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-11'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-11' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 77, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-11-hr-0', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-11-hr-1', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-11-hr-2', 256), TRUE),
  (@sid, 76, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-11-hr-3', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-11-hr-4', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-11-hr-5', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-11-hr-6', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-11-hr-7', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-11-hr-8', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-11-hr-9', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-11-hr-10', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-11-hr-11', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-11-hr-12', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-11-hr-13', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-11-hr-14', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-11-hr-15', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-11-hr-16', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-11-hr-17', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-11-hr-18', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-11-hr-19', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-11-hr-20', 256), TRUE),
  (@sid, 81, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-11-hr-21', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-11-hr-22', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-11-hr-23', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-11-hr-24', 256), TRUE),
  (@sid, 81, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-11-hr-25', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-11-hr-26', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-11-hr-27', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-11-hr-28', 256), TRUE),
  (@sid, 81, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-11-hr-29', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-11-hr-30', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-11-hr-31', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-11-hr-32', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-11-hr-33', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-11-hr-34', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-11-hr-35', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-11-hr-36', 256), TRUE),
  (@sid, 81, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-11-hr-37', 256), TRUE),
  (@sid, 81, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-11-hr-38', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-11-hr-39', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-11-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-11'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-11' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 97, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-11-spo2-0', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-11-spo2-1', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-11-spo2-2', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-11-spo2-3', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-11-spo2-4', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-11-spo2-5', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-11-spo2-6', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-11-spo2-7', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-11-spo2-8', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-11-spo2-9', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-11-spo2-10', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-11-spo2-11', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-11-spo2-12', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-11-spo2-13', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-11-spo2-14', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-11-spo2-15', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-11-spo2-16', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-11-spo2-17', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-11-spo2-18', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-11-spo2-19', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-11-spo2-20', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-11-spo2-21', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-11-spo2-22', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-11-spo2-23', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-11-spo2-24', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-11-spo2-25', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-11-spo2-26', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-11-spo2-27', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-11-spo2-28', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-11-spo2-29', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-11-spo2-30', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-11-spo2-31', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-11-spo2-32', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-11-spo2-33', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-11-spo2-34', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-11-spo2-35', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-11-spo2-36', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-11-spo2-37', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-11-spo2-38', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-11-spo2-39', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-11-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-11'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-11' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 17, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-11-resp-0', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-11-resp-1', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-11-resp-2', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-11-resp-3', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-11-resp-4', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-11-resp-5', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-11-resp-6', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-11-resp-7', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-11-resp-8', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-11-resp-9', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-11-resp-10', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-11-resp-11', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-11-resp-12', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-11-resp-13', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-11-resp-14', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-11-resp-15', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-11-resp-16', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-11-resp-17', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-11-resp-18', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-11-resp-19', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-11-resp-20', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-11-resp-21', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-11-resp-22', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-11-resp-23', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-11-resp-24', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-11-resp-25', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-11-resp-26', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-11-resp-27', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-11-resp-28', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-11-resp-29', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-11-resp-30', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-11-resp-31', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-11-resp-32', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-11-resp-33', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-11-resp-34', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-11-resp-35', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-11-resp-36', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-11-resp-37', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-11-resp-38', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-11-resp-39', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-11-resp-40', 256), TRUE);

-- Hugo Delgado Pérez
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Hugo Delgado Pérez', 'DEMO-0012', '1990-07-12', 'M', 'A+', 'Familiar de prueba (555-0112)', 'inService', 'Caída en bicicleta con dolor en pierna derecha', NOW() - INTERVAL 14 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0012'), 'Fractura cerrada de tibia, inmovilizada.', NOW() - INTERVAL 14 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0012'), 'personal', 'Sin antecedentes de importancia', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0012'), 'Ketorolaco', '30 mg', 'intravenosa', 'cada 8 h', 'Dolor', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0012'), 'S82.2', 'Fractura de la diáfisis de la tibia', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0012'), (SELECT cama_id FROM cama WHERE codigo='TR-02'), 'urgencia', 'activo', 'Caída en bicicleta con dolor en pierna derecha', NOW() - INTERVAL 14 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='TR-02';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0012'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0012'), 'DEMO-DEV-12', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 14 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-12'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-12' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 73, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-12-hr-0', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-12-hr-1', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-12-hr-2', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-12-hr-3', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-12-hr-4', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-12-hr-5', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-12-hr-6', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-12-hr-7', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-12-hr-8', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-12-hr-9', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-12-hr-10', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-12-hr-11', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-12-hr-12', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-12-hr-13', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-12-hr-14', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-12-hr-15', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-12-hr-16', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-12-hr-17', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-12-hr-18', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-12-hr-19', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-12-hr-20', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-12-hr-21', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-12-hr-22', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-12-hr-23', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-12-hr-24', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-12-hr-25', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-12-hr-26', 256), TRUE),
  (@sid, 75, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-12-hr-27', 256), TRUE),
  (@sid, 75, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-12-hr-28', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-12-hr-29', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-12-hr-30', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-12-hr-31', 256), TRUE),
  (@sid, 75, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-12-hr-32', 256), TRUE),
  (@sid, 75, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-12-hr-33', 256), TRUE),
  (@sid, 76, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-12-hr-34', 256), TRUE),
  (@sid, 75, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-12-hr-35', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-12-hr-36', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-12-hr-37', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-12-hr-38', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-12-hr-39', 256), TRUE),
  (@sid, 73, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-12-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-12'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-12' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 98, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-12-spo2-0', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-12-spo2-1', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-12-spo2-2', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-12-spo2-3', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-12-spo2-4', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-12-spo2-5', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-12-spo2-6', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-12-spo2-7', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-12-spo2-8', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-12-spo2-9', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-12-spo2-10', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-12-spo2-11', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-12-spo2-12', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-12-spo2-13', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-12-spo2-14', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-12-spo2-15', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-12-spo2-16', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-12-spo2-17', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-12-spo2-18', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-12-spo2-19', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-12-spo2-20', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-12-spo2-21', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-12-spo2-22', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-12-spo2-23', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-12-spo2-24', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-12-spo2-25', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-12-spo2-26', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-12-spo2-27', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-12-spo2-28', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-12-spo2-29', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-12-spo2-30', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-12-spo2-31', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-12-spo2-32', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-12-spo2-33', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-12-spo2-34', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-12-spo2-35', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-12-spo2-36', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-12-spo2-37', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-12-spo2-38', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-12-spo2-39', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-12-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-12'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-12' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 13, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-12-resp-0', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-12-resp-1', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-12-resp-2', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-12-resp-3', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-12-resp-4', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-12-resp-5', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-12-resp-6', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-12-resp-7', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-12-resp-8', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-12-resp-9', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-12-resp-10', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-12-resp-11', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-12-resp-12', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-12-resp-13', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-12-resp-14', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-12-resp-15', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-12-resp-16', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-12-resp-17', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-12-resp-18', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-12-resp-19', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-12-resp-20', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-12-resp-21', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-12-resp-22', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-12-resp-23', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-12-resp-24', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-12-resp-25', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-12-resp-26', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-12-resp-27', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-12-resp-28', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-12-resp-29', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-12-resp-30', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-12-resp-31', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-12-resp-32', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-12-resp-33', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-12-resp-34', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-12-resp-35', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-12-resp-36', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-12-resp-37', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-12-resp-38', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-12-resp-39', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-12-resp-40', 256), TRUE);

-- Rosa Amelia Chong Lee
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Rosa Amelia Chong Lee', 'DEMO-0013', '1949-05-05', 'F', 'O+', 'Familiar de prueba (555-0113)', 'inService', 'Caída en casa con dolor en muñeca izquierda', NOW() - INTERVAL 18 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0013'), 'Fractura de radio distal. Osteoporosis conocida.', NOW() - INTERVAL 18 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0013'), 'personal', 'Osteoporosis', NULL, 2016, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0013'), 'personal', 'Hipotiroidismo', NULL, 2010, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0013'), 'Codeína', 'Náuseas y vómitos', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0013'), 'Levotiroxina', '75 mcg', 'oral', 'cada 24 h', 'Hipotiroidismo', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0013'), 'Calcio con vitamina D', '600 mg', 'oral', 'cada 24 h', 'Osteoporosis', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0013'), 'S52.5', 'Fractura del extremo distal del radio', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0013'), (SELECT cama_id FROM cama WHERE codigo='TR-03'), 'urgencia', 'activo', 'Caída en casa con dolor en muñeca izquierda', NOW() - INTERVAL 18 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='TR-03';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0013'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0013'), 'DEMO-DEV-13', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 18 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-13'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-13' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 68, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-13-hr-0', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-13-hr-1', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-13-hr-2', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-13-hr-3', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-13-hr-4', 256), TRUE),
  (@sid, 67, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-13-hr-5', 256), TRUE),
  (@sid, 67, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-13-hr-6', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-13-hr-7', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-13-hr-8', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-13-hr-9', 256), TRUE),
  (@sid, 67, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-13-hr-10', 256), TRUE),
  (@sid, 67, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-13-hr-11', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-13-hr-12', 256), TRUE),
  (@sid, 67, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-13-hr-13', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-13-hr-14', 256), TRUE),
  (@sid, 67, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-13-hr-15', 256), TRUE),
  (@sid, 67, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-13-hr-16', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-13-hr-17', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-13-hr-18', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-13-hr-19', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-13-hr-20', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-13-hr-21', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-13-hr-22', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-13-hr-23', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-13-hr-24', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-13-hr-25', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-13-hr-26', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-13-hr-27', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-13-hr-28', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-13-hr-29', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-13-hr-30', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-13-hr-31', 256), TRUE),
  (@sid, 72, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-13-hr-32', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-13-hr-33', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-13-hr-34', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-13-hr-35', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-13-hr-36', 256), TRUE),
  (@sid, 68, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-13-hr-37', 256), TRUE),
  (@sid, 70, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-13-hr-38', 256), TRUE),
  (@sid, 69, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-13-hr-39', 256), TRUE),
  (@sid, 71, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-13-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-13'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-13' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 96, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-13-spo2-0', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-13-spo2-1', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-13-spo2-2', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-13-spo2-3', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-13-spo2-4', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-13-spo2-5', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-13-spo2-6', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-13-spo2-7', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-13-spo2-8', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-13-spo2-9', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-13-spo2-10', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-13-spo2-11', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-13-spo2-12', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-13-spo2-13', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-13-spo2-14', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-13-spo2-15', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-13-spo2-16', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-13-spo2-17', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-13-spo2-18', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-13-spo2-19', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-13-spo2-20', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-13-spo2-21', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-13-spo2-22', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-13-spo2-23', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-13-spo2-24', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-13-spo2-25', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-13-spo2-26', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-13-spo2-27', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-13-spo2-28', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-13-spo2-29', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-13-spo2-30', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-13-spo2-31', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-13-spo2-32', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-13-spo2-33', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-13-spo2-34', 256), TRUE),
  (@sid, 95, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-13-spo2-35', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-13-spo2-36', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-13-spo2-37', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-13-spo2-38', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-13-spo2-39', 256), TRUE),
  (@sid, 96, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-13-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-13'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-13' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 16, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-13-resp-0', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-13-resp-1', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-13-resp-2', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-13-resp-3', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-13-resp-4', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-13-resp-5', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-13-resp-6', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-13-resp-7', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-13-resp-8', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-13-resp-9', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-13-resp-10', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-13-resp-11', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-13-resp-12', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-13-resp-13', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-13-resp-14', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-13-resp-15', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-13-resp-16', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-13-resp-17', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-13-resp-18', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-13-resp-19', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-13-resp-20', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-13-resp-21', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-13-resp-22', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-13-resp-23', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-13-resp-24', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-13-resp-25', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-13-resp-26', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-13-resp-27', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-13-resp-28', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-13-resp-29', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-13-resp-30', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-13-resp-31', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-13-resp-32', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-13-resp-33', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-13-resp-34', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-13-resp-35', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-13-resp-36', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-13-resp-37', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-13-resp-38', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-13-resp-39', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-13-resp-40', 256), TRUE);

-- Nicolás Bernal Cruz
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Nicolás Bernal Cruz', 'DEMO-0014', '1984-09-21', 'M', 'B-', 'Familiar de prueba (555-0114)', 'inService', 'Episodio de hipoglucemia con pérdida de conciencia breve', NOW() - INTERVAL 16 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0014'), 'Diabetes tipo 1. Glucemia normalizada, en observación.', NOW() - INTERVAL 16 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0014'), 'personal', 'Diabetes mellitus tipo 1 desde los 14 años', NULL, 1998, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0014'), 'Insulina glargina', '24 UI', 'subcutánea', 'cada 24 h', 'Diabetes tipo 1', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0014'), 'Insulina lispro', 'según esquema', 'subcutánea', 'con comidas', 'Diabetes tipo 1', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0014'), 'E16.2', 'Hipoglucemia, no especificada', 'definitivo', 'resuelto', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0014'), (SELECT cama_id FROM cama WHERE codigo='P3-06'), 'urgencia', 'activo', 'Episodio de hipoglucemia con pérdida de conciencia breve', NOW() - INTERVAL 16 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='P3-06';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0014'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0014'), 'DEMO-DEV-14', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 16 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-14'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-14' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 84, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-14-hr-0', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-14-hr-1', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-14-hr-2', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-14-hr-3', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-14-hr-4', 256), TRUE),
  (@sid, 83, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-14-hr-5', 256), TRUE),
  (@sid, 81, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-14-hr-6', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-14-hr-7', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-14-hr-8', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-14-hr-9', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-14-hr-10', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-14-hr-11', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-14-hr-12', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-14-hr-13', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-14-hr-14', 256), TRUE),
  (@sid, 82, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-14-hr-15', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-14-hr-16', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-14-hr-17', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-14-hr-18', 256), TRUE),
  (@sid, 81, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-14-hr-19', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-14-hr-20', 256), TRUE),
  (@sid, 80, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-14-hr-21', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-14-hr-22', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-14-hr-23', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-14-hr-24', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-14-hr-25', 256), TRUE),
  (@sid, 76, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-14-hr-26', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-14-hr-27', 256), TRUE),
  (@sid, 79, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-14-hr-28', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-14-hr-29', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-14-hr-30', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-14-hr-31', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-14-hr-32', 256), TRUE),
  (@sid, 76, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-14-hr-33', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-14-hr-34', 256), TRUE),
  (@sid, 75, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-14-hr-35', 256), TRUE),
  (@sid, 78, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-14-hr-36', 256), TRUE),
  (@sid, 74, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-14-hr-37', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-14-hr-38', 256), TRUE),
  (@sid, 77, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-14-hr-39', 256), TRUE),
  (@sid, 76, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-14-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-14'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-14' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 99, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-14-spo2-0', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-14-spo2-1', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-14-spo2-2', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-14-spo2-3', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-14-spo2-4', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-14-spo2-5', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-14-spo2-6', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-14-spo2-7', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-14-spo2-8', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-14-spo2-9', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-14-spo2-10', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-14-spo2-11', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-14-spo2-12', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-14-spo2-13', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-14-spo2-14', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-14-spo2-15', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-14-spo2-16', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-14-spo2-17', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-14-spo2-18', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-14-spo2-19', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-14-spo2-20', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-14-spo2-21', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-14-spo2-22', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-14-spo2-23', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-14-spo2-24', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-14-spo2-25', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-14-spo2-26', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-14-spo2-27', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-14-spo2-28', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-14-spo2-29', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-14-spo2-30', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-14-spo2-31', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-14-spo2-32', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-14-spo2-33', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-14-spo2-34', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-14-spo2-35', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-14-spo2-36', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-14-spo2-37', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-14-spo2-38', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-14-spo2-39', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-14-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-14'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-14' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 14, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-14-resp-0', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-14-resp-1', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-14-resp-2', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-14-resp-3', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-14-resp-4', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-14-resp-5', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-14-resp-6', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-14-resp-7', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-14-resp-8', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-14-resp-9', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-14-resp-10', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-14-resp-11', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-14-resp-12', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-14-resp-13', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-14-resp-14', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-14-resp-15', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-14-resp-16', 256), TRUE),
  (@sid, 13, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-14-resp-17', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-14-resp-18', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-14-resp-19', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-14-resp-20', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-14-resp-21', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-14-resp-22', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-14-resp-23', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-14-resp-24', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-14-resp-25', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-14-resp-26', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-14-resp-27', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-14-resp-28', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-14-resp-29', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-14-resp-30', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-14-resp-31', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-14-resp-32', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-14-resp-33', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-14-resp-34', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-14-resp-35', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-14-resp-36', 256), TRUE),
  (@sid, 14, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-14-resp-37', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-14-resp-38', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-14-resp-39', 256), TRUE),
  (@sid, 15, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-14-resp-40', 256), TRUE);

-- Luz Divina Aguirre Mora
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Luz Divina Aguirre Mora', 'DEMO-0015', '1998-12-03', 'F', 'O+', 'Familiar de prueba (555-0115)', 'inService', 'Embarazo de 30 semanas con dolor abdominal leve, observación', NOW() - INTERVAL 10 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0015'), 'Embarazo de 30 semanas, sin sangrado ni pérdida de líquido. Monitoreo fetal normal.', NOW() - INTERVAL 10 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0015'), 'ginecoobstetrico', 'Primer embarazo', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0015'), 'Ácido fólico', '5 mg', 'oral', 'cada 24 h', 'Embarazo', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0015'), 'Hierro', '60 mg', 'oral', 'cada 24 h', 'Prevención de anemia', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0015'), 'O26.8', 'Dolor abdominal asociado al embarazo', 'presuntivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0015'), (SELECT cama_id FROM cama WHERE codigo='P3-07'), 'urgencia', 'activo', 'Embarazo de 30 semanas con dolor abdominal leve, observación', NOW() - INTERVAL 10 HOUR, (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
UPDATE cama SET estado='ocupada' WHERE codigo='P3-07';
INSERT INTO medico_paciente (usuario_id, paciente_id, motivo) VALUES ((SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0015'), 'Médico tratante');
INSERT INTO dispositivo (hospital_id, paciente_id, codigo, modelo, microcontrolador, estado, fecha_instalacion) VALUES (1, (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0015'), 'DEMO-DEV-15', 'Monitor de prueba', 'simulado', 'activo', NOW() - INTERVAL 10 HOUR);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-15'), 'simulado', 'hr', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-15' AND s.variable_medida='hr');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 88, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-15-hr-0', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-15-hr-1', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-15-hr-2', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-15-hr-3', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-15-hr-4', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-15-hr-5', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-15-hr-6', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-15-hr-7', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-15-hr-8', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-15-hr-9', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-15-hr-10', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-15-hr-11', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-15-hr-12', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-15-hr-13', 256), TRUE),
  (@sid, 87, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-15-hr-14', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-15-hr-15', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-15-hr-16', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-15-hr-17', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-15-hr-18', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-15-hr-19', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-15-hr-20', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-15-hr-21', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-15-hr-22', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-15-hr-23', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-15-hr-24', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-15-hr-25', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-15-hr-26', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-15-hr-27', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-15-hr-28', 256), TRUE),
  (@sid, 92, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-15-hr-29', 256), TRUE),
  (@sid, 88, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-15-hr-30', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-15-hr-31', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-15-hr-32', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-15-hr-33', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-15-hr-34', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-15-hr-35', 256), TRUE),
  (@sid, 90, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-15-hr-36', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-15-hr-37', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-15-hr-38', 256), TRUE),
  (@sid, 91, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-15-hr-39', 256), TRUE),
  (@sid, 89, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-15-hr-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-15'), 'simulado', 'spo2', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-15' AND s.variable_medida='spo2');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 98, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-15-spo2-0', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-15-spo2-1', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-15-spo2-2', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-15-spo2-3', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-15-spo2-4', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-15-spo2-5', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-15-spo2-6', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-15-spo2-7', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-15-spo2-8', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-15-spo2-9', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-15-spo2-10', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-15-spo2-11', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-15-spo2-12', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-15-spo2-13', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-15-spo2-14', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-15-spo2-15', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-15-spo2-16', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-15-spo2-17', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-15-spo2-18', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-15-spo2-19', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-15-spo2-20', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-15-spo2-21', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-15-spo2-22', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-15-spo2-23', 256), TRUE),
  (@sid, 97, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-15-spo2-24', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-15-spo2-25', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-15-spo2-26', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-15-spo2-27', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-15-spo2-28', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-15-spo2-29', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-15-spo2-30', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-15-spo2-31', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-15-spo2-32', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-15-spo2-33', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-15-spo2-34', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-15-spo2-35', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-15-spo2-36', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-15-spo2-37', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-15-spo2-38', 256), TRUE),
  (@sid, 98, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-15-spo2-39', 256), TRUE),
  (@sid, 99, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-15-spo2-40', 256), TRUE);
INSERT INTO sensor (dispositivo_id, modelo, variable_medida, estado) VALUES ((SELECT dispositivo_id FROM dispositivo WHERE codigo='DEMO-DEV-15'), 'simulado', 'resp', 'activo');
SET @sid = (SELECT s.sensor_id FROM sensor s JOIN dispositivo d ON d.dispositivo_id=s.dispositivo_id WHERE d.codigo='DEMO-DEV-15' AND s.variable_medida='resp');
INSERT INTO lectura (sensor_id, valor, fecha_hora, hash_sha256, sincronizada) VALUES
  (@sid, 18, NOW(3) - INTERVAL 2400 SECOND, SHA2('demo-DEMO-DEV-15-resp-0', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2340 SECOND, SHA2('demo-DEMO-DEV-15-resp-1', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2280 SECOND, SHA2('demo-DEMO-DEV-15-resp-2', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2220 SECOND, SHA2('demo-DEMO-DEV-15-resp-3', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 2160 SECOND, SHA2('demo-DEMO-DEV-15-resp-4', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 2100 SECOND, SHA2('demo-DEMO-DEV-15-resp-5', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 2040 SECOND, SHA2('demo-DEMO-DEV-15-resp-6', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1980 SECOND, SHA2('demo-DEMO-DEV-15-resp-7', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1920 SECOND, SHA2('demo-DEMO-DEV-15-resp-8', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1860 SECOND, SHA2('demo-DEMO-DEV-15-resp-9', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1800 SECOND, SHA2('demo-DEMO-DEV-15-resp-10', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1740 SECOND, SHA2('demo-DEMO-DEV-15-resp-11', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1680 SECOND, SHA2('demo-DEMO-DEV-15-resp-12', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1620 SECOND, SHA2('demo-DEMO-DEV-15-resp-13', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1560 SECOND, SHA2('demo-DEMO-DEV-15-resp-14', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1500 SECOND, SHA2('demo-DEMO-DEV-15-resp-15', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1440 SECOND, SHA2('demo-DEMO-DEV-15-resp-16', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1380 SECOND, SHA2('demo-DEMO-DEV-15-resp-17', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1320 SECOND, SHA2('demo-DEMO-DEV-15-resp-18', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1260 SECOND, SHA2('demo-DEMO-DEV-15-resp-19', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1200 SECOND, SHA2('demo-DEMO-DEV-15-resp-20', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 1140 SECOND, SHA2('demo-DEMO-DEV-15-resp-21', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 1080 SECOND, SHA2('demo-DEMO-DEV-15-resp-22', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 1020 SECOND, SHA2('demo-DEMO-DEV-15-resp-23', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 960 SECOND, SHA2('demo-DEMO-DEV-15-resp-24', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 900 SECOND, SHA2('demo-DEMO-DEV-15-resp-25', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 840 SECOND, SHA2('demo-DEMO-DEV-15-resp-26', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 780 SECOND, SHA2('demo-DEMO-DEV-15-resp-27', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 720 SECOND, SHA2('demo-DEMO-DEV-15-resp-28', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 660 SECOND, SHA2('demo-DEMO-DEV-15-resp-29', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 600 SECOND, SHA2('demo-DEMO-DEV-15-resp-30', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 540 SECOND, SHA2('demo-DEMO-DEV-15-resp-31', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 480 SECOND, SHA2('demo-DEMO-DEV-15-resp-32', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 420 SECOND, SHA2('demo-DEMO-DEV-15-resp-33', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 360 SECOND, SHA2('demo-DEMO-DEV-15-resp-34', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 300 SECOND, SHA2('demo-DEMO-DEV-15-resp-35', 256), TRUE),
  (@sid, 16, NOW(3) - INTERVAL 240 SECOND, SHA2('demo-DEMO-DEV-15-resp-36', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 180 SECOND, SHA2('demo-DEMO-DEV-15-resp-37', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 120 SECOND, SHA2('demo-DEMO-DEV-15-resp-38', 256), TRUE),
  (@sid, 18, NOW(3) - INTERVAL 60 SECOND, SHA2('demo-DEMO-DEV-15-resp-39', 256), TRUE),
  (@sid, 17, NOW(3) - INTERVAL 0 SECOND, SHA2('demo-DEMO-DEV-15-resp-40', 256), TRUE);

-- Ignacio Peralta Gómez
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Ignacio Peralta Gómez', 'DEMO-0016', '1967-03-09', 'M', 'A+', 'Familiar de prueba (555-0116)', 'waiting', 'Dolor abdominal en fosa ilíaca derecha desde ayer', NOW() - INTERVAL 1 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0016'), 'En espera de valoración médica.', NOW() - INTERVAL 1 HOUR);

-- Beatriz Sandoval Mora
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Beatriz Sandoval Mora', 'DEMO-0017', '1992-10-17', 'F', 'O+', 'Familiar de prueba (555-0117)', 'waiting', 'Cefalea intensa con náuseas desde esta mañana', NOW() - INTERVAL 2 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0017'), 'En espera de valoración médica.', NOW() - INTERVAL 2 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0017'), 'personal', 'Migraña', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO alergia (expediente_id, sustancia, reaccion, severidad, estado, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0017'), 'Dipirona', 'Erupción', 'leve', 'activa', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));

-- Joaquín Medina Salas
INSERT INTO paciente (hospital_id, nombre, cedula, fecha_nacimiento, sexo, tipo_sangre, contacto_emergencia, estado, motivo_consulta, fecha_llegada) VALUES (1, 'Joaquín Medina Salas', 'DEMO-0018', '1981-06-25', 'M', 'B+', 'Familiar de prueba (555-0118)', 'discharged', 'Lumbalgia aguda', NOW() - INTERVAL 70 HOUR);
INSERT INTO expediente_clinico (paciente_id, observaciones, fecha_apertura) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0018'), 'Alta con tratamiento ambulatorio.', NOW() - INTERVAL 70 HOUR);
INSERT INTO antecedente (expediente_id, tipo, descripcion, parentesco, anio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0018'), 'personal', 'Lumbalgia recurrente', NULL, NULL, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO medicamento_paciente (expediente_id, nombre, dosis, via, frecuencia, indicacion, estado, fecha_inicio, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0018'), 'Naproxeno', '500 mg', 'oral', 'cada 12 h', 'Dolor lumbar', 'activo', CURDATE() - INTERVAL 1 DAY, (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO diagnostico_clinico (expediente_id, cie10, descripcion, tipo, estado, fecha_diagnostico, registrado_por) VALUES ((SELECT e.expediente_id FROM expediente_clinico e JOIN paciente p ON p.paciente_id=e.paciente_id WHERE p.cedula='DEMO-0018'), 'M54.5', 'Lumbalgia', 'definitivo', 'activo', CURDATE(), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'));
INSERT INTO ingreso (paciente_id, cama_id, tipo, estado, motivo, fecha_ingreso, fecha_egreso, resumen_egreso, registrado_por) VALUES ((SELECT paciente_id FROM paciente WHERE cedula='DEMO-0018'), NULL, 'urgencia', 'egresado', 'Lumbalgia aguda', NOW() - INTERVAL 70 HOUR, NOW() - INTERVAL 48 HOUR, 'Egreso con tratamiento ambulatorio.', (SELECT usuario_id FROM usuario WHERE email='administrativo@institucion.org'));
-- Una nota SOAP firmada por paciente, acorde a su motivo de consulta.
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0001'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Fiebre de 39 °C, confusión y dolor lumbar desde hace 3 días; disuria previa.', 'FC 118, PA 92/58, FR 24, T 39.2 °C. Puñopercusión derecha positiva. Desorientado en tiempo.', 'Probable sepsis de origen urinario (pielonefritis complicada) en diabético.', 'Hemocultivos y urocultivo, lactato, cristaloides 30 ml/kg, ceftriaxona IV, control de glucemia y diuresis horaria.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0001'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0002'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Disnea súbita y dolor pleurítico, 5 días tras artroplastia de cadera.', 'FC 112, SpO2 89 % aire ambiente, FR 26. Pantorrilla izquierda edematizada.', 'Sospecha alta de tromboembolia pulmonar posoperatoria.', 'Angio-TC de tórax, dímero D, oxígeno a SpO2 > 92 %, valorar anticoagulación según riesgo de sangrado.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0002'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0003'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Tos con esputo purulento y disnea progresiva; EPOC conocido.', 'SpO2 86 %, FR 28, sibilancias difusas y uso de musculatura accesoria.', 'Exacerbación de EPOC de probable causa infecciosa.', 'Gasometría, Rx de tórax, broncodilatadores nebulizados, prednisona, antibiótico y O2 controlado (meta 88–92 %).', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0003'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0004'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Accidente de motocicleta; dolor abdominal y en muslo derecho.', 'FC 124, PA 98/60. Abdomen doloroso con defensa. Deformidad de fémur derecho.', 'Politraumatismo: posible lesión intraabdominal y fractura diafisaria de fémur.', 'FAST, TC corporal, reserva de hemoderivados, inmovilización y valoración por cirugía y ortopedia.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0004'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0005'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Mareo, debilidad y casi síncope; anticoagulada con warfarina, toma digoxina.', 'FC 42, ritmo irregular. PA 100/62. Sin focalidad neurológica.', 'Bradicardia sintomática; descartar intoxicación digitálica.', 'ECG, digoxinemia, electrolitos, INR; suspender digoxina, monitor continuo, atropina disponible.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0005'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0006'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Palpitaciones y opresión torácica de 2 horas.', 'FC 148 irregular, PA 128/80. Sin signos de insuficiencia cardíaca.', 'Fibrilación auricular con respuesta ventricular rápida; descartar SCA.', 'ECG seriado, troponinas, control de frecuencia, valorar anticoagulación (CHA2DS2-VASc).', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0006'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0007'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Fiebre y tos con dolor pleurítico de 4 días.', 'T 38.6 °C, FR 22, SpO2 93 %. Crepitantes en base derecha.', 'Neumonía adquirida en la comunidad, CURB-65 bajo.', 'Rx de tórax, hemograma, PCR, continuar amoxicilina/clavulánico, antipiréticos e hidratación.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0007'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0008'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Dolor abdominal intenso en epigastrio irradiado en cinturón, con vómitos.', 'FC 110, abdomen distendido y doloroso, sin irritación peritoneal franca.', 'Probable pancreatitis aguda.', 'Lipasa, perfil hepático, ecografía abdominal, hidratación IV, analgesia y ayuno inicial.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0008'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0009'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Edema de piernas y ortopnea de 1 semana.', 'FR 24, SpO2 91 %, crepitantes bibasales, ingurgitación yugular, edema ++.', 'Insuficiencia cardíaca descompensada.', 'BNP, Rx de tórax, ecocardiograma, furosemida IV, restricción hídrica y balance diario.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0009'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0010'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Silbidos en el pecho tras ejercicio; asma conocida.', 'FR 26, SpO2 92 %, sibilancias espiratorias, habla en frases cortas.', 'Crisis asmática moderada.', 'Salbutamol nebulizado seriado, corticoide sistémico, reevaluar flujo pico en 1 hora.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0010'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0011'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Posoperatorio inmediato de colecistectomía laparoscópica; dolor leve en heridas.', 'Signos vitales estables, heridas limpias, tolera líquidos.', 'Evolución posoperatoria favorable.', 'Analgesia, progresar dieta, deambulación temprana, alta prevista en 24 h.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0011'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0012'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Caída en bicicleta con dolor en pierna derecha.', 'Dolor a la palpación de tibia derecha, sin compromiso neurovascular distal.', 'Probable fractura de tibia sin compromiso vascular.', 'Rx de pierna derecha, inmovilización, analgesia y valoración por ortopedia.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0012'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0013'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Caída en casa apoyando la mano; dolor en muñeca izquierda.', 'Deformidad en dorso de tenedor, pulso radial presente.', 'Probable fractura distal de radio en paciente con osteoporosis.', 'Rx de muñeca, reducción e inmovilización, analgesia, revisar riesgo de caídas.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0013'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0014'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Pérdida de conciencia breve por hipoglucemia; diabético con insulina.', 'Glucemia capilar inicial 42 mg/dl; tras dextrosa 118 mg/dl, consciente y orientado.', 'Hipoglucemia grave resuelta, probable error de dosis de insulina.', 'Glucemia capilar cada hora, dieta, revisar esquema de insulina y educación al paciente.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0014'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0015'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Embarazo de 30 semanas con dolor abdominal leve.', 'PA 118/74, FCF 140 lpm, sin sangrado ni pérdida de líquido.', 'Dolor abdominal leve sin datos de trabajo de parto pretérmino.', 'Monitoreo fetal, examen de orina, observación y valoración por ginecología.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0015'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0016'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Dolor en fosa ilíaca derecha desde ayer, náuseas.', 'T 37.9 °C, McBurney positivo, Blumberg dudoso.', 'Sospecha de apendicitis aguda.', 'Hemograma, PCR, ecografía abdominal, ayuno y valoración por cirugía.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0016'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0017'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Cefalea intensa con náuseas desde esta mañana.', 'PA 132/84, sin rigidez de nuca ni focalidad neurológica.', 'Cefalea primaria probable; descartar signos de alarma.', 'Analgesia, antiemético, reevaluar en 1 hora; TC de cráneo si aparecen signos de alarma.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0017'));
INSERT INTO nota_soap (paciente_id, usuario_id, fecha_hora, subjetivo, objetivo, analisis, plan, estado, firmada_por, firmada_en) SELECT (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0018'), (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR, 'Lumbalgia aguda tras levantar peso; sin irradiación.', 'Contractura paravertebral lumbar, Lasègue negativo, sin déficit neurológico.', 'Lumbalgia mecánica aguda sin signos de alarma.', 'AINE, calor local, actividad según tolerancia; alta con indicaciones.', 'firmada', (SELECT usuario_id FROM usuario WHERE email='medico@institucion.org'), NOW() - INTERVAL 2 HOUR FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM nota_soap n WHERE n.paciente_id = (SELECT paciente_id FROM paciente WHERE cedula='DEMO-0018'));
COMMIT;
