# Inventario de lo tocable (recorrido automático)

Generado por el recorrido del médico contra el backend local (REVISION-MEDICO.md, sección 2). Para cada pantalla, cada botón, enlace, pestaña, fila o tarjeta que se puede tocar y qué pasó al tocarlo. Las fichas del paciente se recorrieron con DEMO-0002; DEMO-0011 y DEMO-0009 solo con captura y revisión de datos.

- **No se toca:** escribe en la base, llama a la IA o cierra la sesión. Esas acciones se probaron en el recorrido guiado.
- **NADA:** no navegó, no abrió nada, no mostró aviso y no cambió el texto de la pantalla. Incluye falsos positivos: la pestaña en la que ya se está, la página 1, y los interruptores que solo cambian el estilo (síntomas, severidad, pronóstico).
- **Ya no está en pantalla:** cambió con el clic anterior (un acordeón, un contador en vivo), no es un fallo.
- El menú lateral no se repite en cada pantalla.

## /MedAyudaSoporte

| Elemento | Qué hizo |
|---|---|
| Notificaciones (170 sin leer) | navega a /MedNotificacionesCentro |
| Uso del SistemaGuías generales y primeros pasos | despliega/pliega |
| Monitoreo y AlertasConfiguración y gestión de umbrales clínicos | despliega/pliega |
| Notas SOAP e Historia ClínicaDocumentación y registro clínico estructu | despliega/pliega |
| Problemas Técnicos / ConectividadDiagnósticos de red y sensores inalám | cambia la pantalla |
| ¿Cómo confirmo una alerta? | ya no está en pantalla |
| ¿Qué hago si un sensor se desconecta? | despliega/pliega |
| ¿Cómo registro una nota SOAP? | ya no está en pantalla |
| ¿Puedo modificar umbrales de un paciente? | ya no está en pantalla |
| ¿Cómo genero un reporte de turno? | ya no está en pantalla |
| ¿Dónde veo el historial de signos vitales? | ya no está en pantalla |
| +52 800 123 4567 | NADA |
| Contactar Soporte Técnico | abre: Contactar Soporte Técnico |

## /MedPerfilMiPerfil

| Elemento | Qué hizo |
|---|---|
| Notificaciones (170 sin leer) | navega a /MedNotificacionesCentro |

## /MedTurnoResumenRecibido

| Elemento | Qué hizo |
|---|---|
| Buscar paciente, HC... | navega a /MedBusquedaGlobal |
| Notificaciones (170 sin leer) | navega a /MedNotificacionesCentro |
| Ver a Teodoro Lasso Mejía | navega a /MedPacienteResumen?paciente=DEMO-0006 |
| Ver Paciente | navega a /MedPacienteResumen?paciente=DEMO-0006 |
| Ver a Darío Vallejo Pinto | navega a /MedPacienteResumen?paciente=DEMO-0004 |
| Ver a Ileana Montenegro Sáez | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Ver a Yamileth Orozco Arce | navega a /MedPacienteResumen?paciente=DEMO-0005 |
| Ver a Anselmo Ruiz Cardoza | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Ver a Rogelio Batista Quintero | navega a /MedPacienteResumen?paciente=DEMO-0001 |
| Ver a Marisol Caicedo Rey | navega a /MedPacienteResumen?paciente=DEMO-0009 |
| Ver a 5252 | navega a /MedPacienteResumen?paciente=235235 |
| Ver a Cristian Barrios Tello | navega a /MedPacienteResumen?paciente=DEMO-0008 |
| Ver a Elías Ferrer Domínguez | navega a /MedPacienteResumen?paciente=DEMO-0010 |
| Ver a Graciela Arosemena Villa | navega a /MedPacienteResumen?paciente=DEMO-0011 |
| Ver a Hugo Delgado Pérez | navega a /MedPacienteResumen?paciente=DEMO-0012 |
| Ver a Luz Divina Aguirre Mora | navega a /MedPacienteResumen?paciente=DEMO-0015 |
| Ver a Nicolás Bernal Cruz | navega a /MedPacienteResumen?paciente=DEMO-0014 |
| Ver a Paloma Esquivel Núñez | navega a /MedPacienteResumen?paciente=DEMO-0007 |
| Ver a Rosa Amelia Chong Lee | navega a /MedPacienteResumen?paciente=DEMO-0013 |
| Troponina de 3 h y decidir cardioversión - Teodoro Lasso Mejía | NADA |
| TC de abdomen o quirófano - Darío Vallejo Pinto | NADA |
| Decidir trombólisis con Cardiología - Ileana Montenegro Sáez | NADA |
| Decidir Fab antidigoxina o marcapasos - Yamileth Orozco Arce | NADA |
| Gasometría de control en 1 h - Anselmo Ruiz Cardoza | NADA |
| Ecografía renal y lactato de control - Rogelio Batista Quintero | NADA |
| Control de electrolitos y peso - Marisol Caicedo Rey | NADA |
| Reevaluación - 5252 | NADA |
| Marcar como Leído ✓ | no se toca (escribe, IA o sesión) |

## /MedTurnoHistorial

| Elemento | Qué hizo |
|---|---|
| Buscar entrega, médico, cama... | navega a /MedBusquedaGlobal |
| Notificaciones (175 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Entrega | navega a /MedTurnoEntregaHandoff |
| Historial de Entregas | NADA |
| Fecha:Últimos 7 días | abre: ventana/menú |
| Turno:Todos los turnos | abre: ventana/menú |
| Ver resumen de la entrega del 14 Ago 2026, 06:55 | navega a /MedTurnoResumenRecibido |
| Ver Resumen | navega a /MedTurnoResumenRecibido |
| Ver resumen de la entrega del 13 Ago 2026, 22:50 | navega a /MedTurnoResumenRecibido |
| Ver resumen de la entrega del 13 Ago 2026, 14:45 | navega a /MedTurnoResumenRecibido |
| Ver resumen de la entrega del 13 Ago 2026, 06:50 | navega a /MedTurnoResumenRecibido |
| Ver resumen de la entrega del 12 Ago 2026, 22:45 | navega a /MedTurnoResumenRecibido |
| Ver resumen de la entrega del 12 Ago 2026, 14:55 | navega a /MedTurnoResumenRecibido |
| Anterior | NADA |
| 1 | NADA |
| 2 | cambia la pantalla |
| 3 | cambia la pantalla |
| 4 | cambia la pantalla |
| Siguiente | cambia la pantalla |

## /MedTurnoEntregaHandoff

| Elemento | Qué hizo |
|---|---|
| Generar Reporte | aviso: Reporte de turno generado |
| Notificaciones (176 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Entrega | NADA |
| Historial de Entregas | navega a /MedTurnoHistorial |
| Ver a Teodoro Lasso Mejía, cama UCI-05 | navega a /MedPacienteResumen?paciente=DEMO-0006 |
| Ver a Darío Vallejo Pinto, cama TR-01 | navega a /MedPacienteResumen?paciente=DEMO-0004 |
| Ver a Ileana Montenegro Sáez, cama UCI-02 | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Ver a Yamileth Orozco Arce, cama UCI-04 | navega a /MedPacienteResumen?paciente=DEMO-0005 |
| Ver a Anselmo Ruiz Cardoza, cama UCI-03 | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Ver a Rogelio Batista Quintero, cama UCI-01 | navega a /MedPacienteResumen?paciente=DEMO-0001 |
| Ver a Marisol Caicedo Rey, cama P3-03 | navega a /MedPacienteResumen?paciente=DEMO-0009 |
| Ver a 5252, cama C-01 | navega a /MedPacienteResumen?paciente=235235 |
| Guardar Borrador | no se toca (escribe, IA o sesión) |
| Confirmar Entrega de Turno | no se toca (escribe, IA o sesión) |

## /MedReportesPanel

| Elemento | Qué hizo |
|---|---|
| Generar Nuevo Reporte | abre: Generar nuevo reporte |
| Notificaciones (176 sin leer) | navega a /MedNotificacionesCentro |
| Resumen | NADA |
| Historial de Entregas | cambia la pantalla |
| Informes del Sistema | cambia la pantalla |
| Reporte de Entrega de TurnoGenera el reporte general de handoff con el | navega a /MedTurnoEntregaHandoff |
| Vista previa: Evolución Clínica de Rogelio Batista Quintero | abre: Evolución Clínica — Rogelio Batista Quintero |
| Entregar | no se toca (escribe, IA o sesión) |
| Vista previa: Alta Médica de Paloma Esquivel Núñez | no se toca (escribe, IA o sesión) |
| Vista previa: Interconsulta de Teodoro Lasso Mejía | abre: Interconsulta — Teodoro Lasso Mejía |
| Vista previa de Evolucion_Clinica_Montenegro_DEMO-0002.pdf | abre: Evolucion_Clinica_Montenegro_DEMO-0002.pdf |
| Ver | abre: Evolucion_Clinica_Montenegro_DEMO-0002.pdf |
| Descargar | aviso: Descargando Evolucion_Clinica_Montenegro_DEMO-0002.pdf |
| Vista previa de Interconsulta_Vallejo_DEMO-0004.pdf | abre: Interconsulta_Vallejo_DEMO-0004.pdf |
| Vista previa de Resumen_Ocupacion_UCI.xlsx | abre: Resumen_Ocupacion_UCI.xlsx |
| Vista previa de Evolucion_Clinica_Ruiz_DEMO-0003.pdf | abre: Evolucion_Clinica_Ruiz_DEMO-0003.pdf |
| Vista previa de Evolucion_Clinica_Barrios_DEMO-0008.pdf | abre: Evolucion_Clinica_Barrios_DEMO-0008.pdf |
| Anterior | NADA |
| 1 | NADA |
| 2 | cambia la pantalla |
| Siguiente | cambia la pantalla |
| Configurar y Generar | abre: Generar nuevo reporte |

## /MedDispositivoDetalle?cama=UCI-02

| Elemento | Qué hizo |
|---|---|
| Volver a Dispositivos | navega a /MedDispositivosMonitores |
| Notificaciones (176 sin leer) | navega a /MedNotificacionesCentro |
| Solicitar calibración | no se toca (escribe, IA o sesión) |
| Reportar falla | no se toca (escribe, IA o sesión) |
| Ver paciente | navega a /MedPacienteResumen?paciente=DEMO-0002 |

## /MedDispositivosMonitores

| Elemento | Qué hizo |
|---|---|
| Notificaciones (176 sin leer) | navega a /MedNotificacionesCentro |
| EstadoTodos | abre: ventana/menú |
| CamaTodas las camas | abre: ventana/menú |
| Ver detalle del monitor de la cama C-01 | navega a /MedDispositivoDetalle?cama=C-01 |
| Ver Detalle | navega a /MedDispositivoDetalle?cama=C-01 |
| Ver detalle del monitor de la cama P3-01 | navega a /MedDispositivoDetalle?cama=P3-01 |
| Ver detalle del monitor de la cama P3-02 | navega a /MedDispositivoDetalle?cama=P3-02 |
| Ver detalle del monitor de la cama P3-03 | navega a /MedDispositivoDetalle?cama=P3-03 |
| Ver detalle del monitor de la cama P3-04 | navega a /MedDispositivoDetalle?cama=P3-04 |
| Ver detalle del monitor de la cama P3-05 | navega a /MedDispositivoDetalle?cama=P3-05 |
| Ver detalle del monitor de la cama P3-06 | navega a /MedDispositivoDetalle?cama=P3-06 |
| Ver detalle del monitor de la cama P3-07 | navega a /MedDispositivoDetalle?cama=P3-07 |
| Anterior | NADA |
| 1 | NADA |
| 2 | cambia la pantalla |
| Siguiente | cambia la pantalla |

## /MedBusquedaGlobal?q=tromboembolia

| Elemento | Qué hizo |
|---|---|
| Notificaciones (176 sin leer) | navega a /MedNotificacionesCentro |
| Todos (1) | NADA |
| Pacientes (0) | cambia la pantalla |
| Notas SOAP (1) | NADA |
| Documentos (0) | cambia la pantalla |
| Ver Nota | navega a /MedPacienteNotasSoapDetalle?paciente=DEMO-0002&nota=2 |

## /MedAsistenteIa?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Notificaciones (176 sin leer) | navega a /MedNotificacionesCentro |
| Paciente de la consulta | abre: ventana/menú |
| Diferenciales | no se toca (escribe, IA o sesión) |
| Banderas rojas | no se toca (escribe, IA o sesión) |
| Estudios | no se toca (escribe, IA o sesión) |
| Alergias e interacciones | no se toca (escribe, IA o sesión) |
| Manejo inicial | no se toca (escribe, IA o sesión) |

## /Notificaciones

| Elemento | Qué hizo |
|---|---|
| Marcar todas como leídas | no se toca (escribe, IA o sesión) |
| Tipo: Todas | abre: ventana/menú |
| Notificaciones (50 sin leer) | navega a /MedNotificacionesCentro |
| Alerta Temprana: Teodoro Lasso Mejía - Cama UCI-05Frecuencia cardíaca  | navega a /MedAlertasCentro |
| Alerta Temprana: Rogelio Batista Quintero - Cama UCI-01Frecuencia card | navega a /MedAlertasCentro |
| Alerta Temprana: Darío Vallejo Pinto - Cama TR-01Frecuencia cardíaca 1 | navega a /MedAlertasCentro |
| Alerta Temprana: Anselmo Ruiz Cardoza - Cama UCI-03SpO2 89% bajo. Vigi | navega a /MedAlertasCentro |
| Alerta Temprana: Ileana Montenegro Sáez - Cama UCI-02SpO2 89% bajo. Vi | navega a /MedAlertasCentro |
| Alerta Temprana: Ileana Montenegro Sáez - Cama UCI-02SpO2 88% bajo. Vi | navega a /MedAlertasCentro |
| Alerta Temprana: Yamileth Orozco Arce - Cama UCI-04Frecuencia cardíaca | navega a /MedAlertasCentro |

## /MedNotificacionesCentro

| Elemento | Qué hizo |
|---|---|
| Marcar todas como leídas | no se toca (escribe, IA o sesión) |
| Tipo: Todas | abre: ventana/menú |
| Notificaciones (50 sin leer) | NADA |
| Alerta Temprana: Teodoro Lasso Mejía - Cama UCI-05Frecuencia cardíaca  | navega a /MedAlertasCentro |
| Alerta Temprana: Rogelio Batista Quintero - Cama UCI-01Frecuencia card | navega a /MedAlertasCentro |
| Alerta Temprana: Anselmo Ruiz Cardoza - Cama UCI-03SpO2 89% bajo. Vigi | navega a /MedAlertasCentro |
| Alerta Temprana: Ileana Montenegro Sáez - Cama UCI-02SpO2 89% bajo. Vi | navega a /MedAlertasCentro |
| Alerta Temprana: Darío Vallejo Pinto - Cama TR-01Frecuencia cardíaca 1 | navega a /MedAlertasCentro |
| Alerta Temprana: Yamileth Orozco Arce - Cama UCI-04Frecuencia cardíaca | navega a /MedAlertasCentro |
| Alerta Temprana: Rogelio Batista Quintero - Cama UCI-01SpO2 89% bajo.  | navega a /MedAlertasCentro |

## /MedAlertasConfirmacionAtencion?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Severidad: Todas | abre: Confirmar Atención de Alerta |
| Estado: Activas | abre: Confirmar Atención de Alerta |
| Hoy, 24 Nov 2026 | abre: Confirmar Atención de Alerta |
| Notificaciones (162 sin leer) | navega a /MedNotificacionesCentro |
| Silenciar | no se toca (escribe, IA o sesión) |
| Atender | navega a /MedAlertasConfirmacionAtencion |
| Ver a Darío Vallejo Pinto | navega a /MedPacienteResumen?paciente=DEMO-0004 |
| Ver a Anselmo Ruiz Cardoza | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Ver a Ileana Montenegro Sáez | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Ver a Yamileth Orozco Arce | navega a /MedPacienteResumen?paciente=DEMO-0005 |

## /MedAlertasCentro

| Elemento | Qué hizo |
|---|---|
| Severidad: Todas | abre: ventana/menú |
| Estado: Activas | abre: ventana/menú |
| Hoy, 24 Nov 2026 | abre: ventana/menú |
| Notificaciones (163 sin leer) | navega a /MedNotificacionesCentro |
| Silenciar | no se toca (escribe, IA o sesión) |
| Atender | navega a /MedAlertasConfirmacionAtencion |
| Ver a Darío Vallejo Pinto | navega a /MedPacienteResumen?paciente=DEMO-0004 |
| Ver a Anselmo Ruiz Cardoza | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Ver a Ileana Montenegro Sáez | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Ver a Yamileth Orozco Arce | navega a /MedPacienteResumen?paciente=DEMO-0005 |

## /MedMonitoreoComparativa

| Elemento | Qué hizo |
|---|---|
| Buscar paciente, cama o HC... | navega a /MedBusquedaGlobal |
| Notificaciones (163 sin leer) | navega a /MedNotificacionesCentro |
| Paciente A: Teodoro Lasso Mejía | abre: ventana/menú |
| Paciente B: Rogelio Batista Quintero | abre: ventana/menú |
| + Agregar Paciente | no se toca (escribe, IA o sesión) |
| Últimas 4h | NADA |
| 12h | cambia la pantalla |
| 24h | cambia la pantalla |
| Exportar | aviso: Comparativa exportada (PDF) |

## /MedMonitoreoListaUci

| Elemento | Qué hizo |
|---|---|
| Unidad | abre: ventana/menú |
| Grid | navega a /MedMonitoreoGridUci |
| Lista | cambia la pantalla |
| Notificaciones (163 sin leer) | navega a /MedNotificacionesCentro |
| Ver a Rogelio Batista Quintero, cama UCI-01 | navega a /MedPacienteResumen?paciente=DEMO-0001 |
| Ver a Ileana Montenegro Sáez, cama UCI-02 | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Ver a Anselmo Ruiz Cardoza, cama UCI-03 | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Ver a Yamileth Orozco Arce, cama UCI-04 | navega a /MedPacienteResumen?paciente=DEMO-0005 |
| Ver a Teodoro Lasso Mejía, cama UCI-05 | navega a /MedPacienteResumen?paciente=DEMO-0006 |

## /MedMonitoreoGridUci

| Elemento | Qué hizo |
|---|---|
| Unidad | abre: ventana/menú |
| Grid | NADA |
| Lista | navega a /MedMonitoreoListaUci |
| Notificaciones (163 sin leer) | navega a /MedNotificacionesCentro |
| Ver paciente de la cama UCI-01 | navega a /MedPacienteResumen?paciente=DEMO-0001 |
| Ver paciente de la cama UCI-02 | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Ver paciente de la cama UCI-03 | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Ver paciente de la cama UCI-04 | navega a /MedPacienteResumen?paciente=DEMO-0005 |
| Ver paciente de la cama UCI-05 | navega a /MedPacienteResumen?paciente=DEMO-0006 |

## /MedPacientesLista

| Elemento | Qué hizo |
|---|---|
| Notificaciones (163 sin leer) | navega a /MedNotificacionesCentro |
| UnidadTodas | abre: ventana/menú |
| EstadoTodos | abre: ventana/menú |
| Rango de AdmisiónCualquier fecha | abre: ventana/menú |
| Ordenar pacientes | abre: ventana/menú |
| Ver a Teodoro Lasso Mejía | navega a /MedPacienteResumen?paciente=DEMO-0006 |
| Más opciones de Teodoro Lasso Mejía | abre: ventana/menú |
| Ver a Darío Vallejo Pinto | navega a /MedPacienteResumen?paciente=DEMO-0004 |
| Más opciones de Darío Vallejo Pinto | abre: ventana/menú |
| Ver a Ileana Montenegro Sáez | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Más opciones de Ileana Montenegro Sáez | abre: ventana/menú |
| Ver a Yamileth Orozco Arce | navega a /MedPacienteResumen?paciente=DEMO-0005 |
| Más opciones de Yamileth Orozco Arce | abre: ventana/menú |
| Ver a Anselmo Ruiz Cardoza | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Más opciones de Anselmo Ruiz Cardoza | abre: ventana/menú |
| Anterior | NADA |
| 1 | NADA |
| 2 | cambia la pantalla |
| 3 | cambia la pantalla |
| 4 | cambia la pantalla |
| Siguiente | cambia la pantalla |
| SpO2 < 90% — Saturación baja (89)Cama UCI-02hace 2 min | navega a /MedAlertasCentro |
| FC > 120 lpm — Taquicardia (122)Cama UCI-05hace 7 min | ya no está en pantalla |
| FC > 120 lpm — Taquicardia (121)Cama UCI-01hace 8 min | navega a /MedAlertasCentro |
| FC > 120 lpm — Taquicardia (121)Cama TR-01hace 8 min | ya no está en pantalla |

## /MedDashboardPrincipal

| Elemento | Qué hizo |
|---|---|
| Buscar paciente por nombre o HC... | navega a /MedBusquedaGlobal |
| Notificaciones (163 sin leer) | navega a /MedNotificacionesCentro |
| Pacientes Asignados16 | navega a /MedPacientesLista |
| Alertas Críticas5 | navega a /MedAlertasCentro |
| Pendientes Evaluación16 | NADA |
| Unidad | abre: ventana/menú |
| Estado | abre: ventana/menú |
| Ver a Teodoro Lasso Mejía | navega a /MedPacienteResumen?paciente=DEMO-0006 |
| Ver perfil de Teodoro Lasso Mejía | navega a /MedPacienteResumen?paciente=DEMO-0006 |
| Monitoreo de Teodoro Lasso Mejía | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0006 |
| Nota SOAP de Teodoro Lasso Mejía | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0006 |
| Historia clínica de Teodoro Lasso Mejía | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0006 |
| Ver a Darío Vallejo Pinto | navega a /MedPacienteResumen?paciente=DEMO-0004 |
| Ver perfil de Darío Vallejo Pinto | navega a /MedPacienteResumen?paciente=DEMO-0004 |
| Monitoreo de Darío Vallejo Pinto | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0004 |
| Nota SOAP de Darío Vallejo Pinto | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0004 |
| Historia clínica de Darío Vallejo Pinto | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0004 |
| Ver a Ileana Montenegro Sáez | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Ver perfil de Ileana Montenegro Sáez | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Monitoreo de Ileana Montenegro Sáez | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Nota SOAP de Ileana Montenegro Sáez | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Historia clínica de Ileana Montenegro Sáez | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Ver a Yamileth Orozco Arce | navega a /MedPacienteResumen?paciente=DEMO-0005 |
| Ver perfil de Yamileth Orozco Arce | navega a /MedPacienteResumen?paciente=DEMO-0005 |
| Monitoreo de Yamileth Orozco Arce | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0005 |
| Nota SOAP de Yamileth Orozco Arce | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0005 |
| Historia clínica de Yamileth Orozco Arce | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0005 |
| Ver a Anselmo Ruiz Cardoza | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Ver perfil de Anselmo Ruiz Cardoza | navega a /MedPacienteResumen?paciente=DEMO-0003 |
| Monitoreo de Anselmo Ruiz Cardoza | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0003 |
| Nota SOAP de Anselmo Ruiz Cardoza | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0003 |
| Historia clínica de Anselmo Ruiz Cardoza | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0003 |
| Ver a Rogelio Batista Quintero | navega a /MedPacienteResumen?paciente=DEMO-0001 |
| Ver perfil de Rogelio Batista Quintero | navega a /MedPacienteResumen?paciente=DEMO-0001 |
| Monitoreo de Rogelio Batista Quintero | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0001 |
| Nota SOAP de Rogelio Batista Quintero | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0001 |
| Historia clínica de Rogelio Batista Quintero | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0001 |
| Ver todos → | navega a /MedPacientesLista |
| Tendencias de Teodoro Lasso Mejía | navega a /MedPacienteTendenciasVitales?paciente=DEMO-0006 |
| Tendencias de Darío Vallejo Pinto | navega a /MedPacienteTendenciasVitales?paciente=DEMO-0004 |

## /MedPacienteResumen?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver al Mapa | navega a /MedMonitoreoGridUci?unidad=UCI |
| Notificaciones (164 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | cambia la pantalla |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| ⚙Configurar Umbrales | navega a /MedPacienteConfigUmbrales?paciente=DEMO-0002 |
| Generar ideas | no se toca (escribe, IA o sesión) |
| Atender | navega a /MedAlertasConfirmacionAtencion?paciente=DEMO-0002 |

## /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Notificaciones (165 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | NADA |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| + Agregar Diagnóstico | no se toca (escribe, IA o sesión) |
| Plegar Datos Personales y Demográficos | despliega/pliega |
| Ver datos completos → | navega a /MedPacienteDatosPersonales?paciente=DEMO-0002 |
| Plegar Antecedentes Patológicos Diagnosticados | despliega/pliega |
| Ver historial completo de antecedentes → | navega a /MedPacienteAntecedentes?paciente=DEMO-0002 |
| Plegar Interrogatorio por Aparatos y Sistemas | despliega/pliega |
| Ver interrogatorio completo → | navega a /MedPacienteInterrogatorioAparatos?paciente=DEMO-0002 |
| Plegar Exploración Física | despliega/pliega |
| Ver exploración completa → | navega a /MedPacienteExploracionFisica?paciente=DEMO-0002 |
| Plegar Alergias y Reacciones Adversas | despliega/pliega |
| Plegar Medicamentos y Tratamientos Actuales | despliega/pliega |
| Plegar Diagnósticos y Problemas Activos | despliega/pliega |
| Ver diagnósticos → | navega a /MedPacienteDiagnosticosActivos?paciente=DEMO-0002 |
| Plegar Historial de Hospitalizaciones e Intervenciones | despliega/pliega |
| Ver historial completo → | navega a /MedPacienteHistorialHospitalizaciones?paciente=DEMO-0002 |
| Plegar Nota de Ingreso / Admisión | despliega/pliega |
| Ver nota de ingreso → | navega a /MedPacienteNotaIngreso?paciente=DEMO-0002 |
| Plegar Indicaciones Médicas | despliega/pliega |
| Ver indicaciones médicas → | navega a /MedPacienteIndicacionesMedicas?paciente=DEMO-0002 |
| Plegar Documentos Clínicos Adjuntos | despliega/pliega |
| Ver documentos → | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |

## /MedPacienteAntecedentes?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notificaciones (168 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Heredofamiliares | NADA |
| Personales Patológicos | cambia la pantalla |
| No Patológicos | cambia la pantalla |
| Gineco-obstétricos | cambia la pantalla |
| + Agregar Antecedente | no se toca (escribe, IA o sesión) |
| Ver sección → | cambia la pantalla |

## /MedPacienteDatosPersonales?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteAntecedentes?paciente=DEMO-0002 |
| Notificaciones (168 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |

## /MedPacienteDiagnosticosActivos?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteDatosPersonales?paciente=DEMO-0002 |
| Notificaciones (168 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| + Nuevo Diagnóstico | navega a /MedPacienteRegistroDiagnostico?paciente=DEMO-0002 |
| Editar Tromboembolia pulmonar | navega a /MedPacienteRegistroDiagnostico?paciente=DEMO-0002&diagnostico=4 |
| Editar Fractura de cuello de fémur | navega a /MedPacienteRegistroDiagnostico?paciente=DEMO-0002&diagnostico=3 |
| Actualizar Nota | no se toca (escribe, IA o sesión) |

## /MedPacienteRegistroDiagnostico?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteDiagnosticosActivos?paciente=DEMO-0002 |
| Notificaciones (168 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Tipo de Diagnóstico | abre: ventana/menú |
| Código CIE-10: sin elegir | abre: ventana/menú |
| Leve | NADA |
| Moderada | NADA |
| Severa | NADA |
| Crítica | NADA |
| Fecha de registro: 24 Nov 2026. Cambiar fecha | NADA |
| Subir estudios adjuntos | no se toca (escribe, IA o sesión) |
| Cancelar | no se toca (escribe, IA o sesión) |
| Registrar Diagnóstico | no se toca (escribe, IA o sesión) |
| Generar ideas | no se toca (escribe, IA o sesión) |

## /MedPacienteDocumentosClinicos?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteRegistroDiagnostico?paciente=DEMO-0002 |
| Notificaciones (169 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | NADA |
| Todos | NADA |
| Laboratorio | NADA |
| Imagen | NADA |
| Consentimiento | NADA |
| Otro | NADA |
| Subir documento | no se toca (escribe, IA o sesión) |
| Subir documento | no se toca (escribe, IA o sesión) |

## /MedPacienteExploracionFisica?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Notificaciones (172 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Evaluación primaria pendiente: este paciente todavía no tiene exploración física. / Reporte de Ileana M |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Cabeza y cuello | cambia la pantalla |
| Tórax | NADA |
| Abdomen | cambia la pantalla |
| Extremidades superiores | cambia la pantalla |
| Extremidades inferiores | cambia la pantalla |
| Neurológico | cambia la pantalla |
| INSPECCIÓN: Normal. Cambiar | cambia la pantalla |
| PALPACIÓN: Normal. Cambiar | cambia la pantalla |
| PERCUSIÓN: Normal. Cambiar | cambia la pantalla |
| AUSCULTACIÓN: Normal. Cambiar | cambia la pantalla |
| Guardar | no se toca (escribe, IA o sesión) |

## /MedPacienteHistorialHospitalizaciones?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteExploracionFisica?paciente=DEMO-0002 |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |

## /MedPacienteIndicacionesMedicas?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteHistorialHospitalizaciones?paciente=DEMO-0002 |
| Nueva Indicación | abre: Nueva indicación |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| + Agregar Solución | no se toca (escribe, IA o sesión) |
| Revisar interacciones con IA | no se toca (escribe, IA o sesión) |
| + Agregar Medicamento | no se toca (escribe, IA o sesión) |

## /MedPacienteInterrogatorioAparatos?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteIndicacionesMedicas?paciente=DEMO-0002 |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Plegar Aparato Respiratorio | despliega/pliega |
| Disnea | NADA |
| Tos | NADA |
| Expectoración | NADA |
| Hemoptisis | NADA |
| Dolor torácico | NADA |
| Sibilancias | NADA |
| Plegar Aparato Cardiovascular | despliega/pliega |
| Dolor precordial | NADA |
| Palpitaciones | NADA |
| Edema | NADA |
| Disnea de esfuerzo | NADA |
| Claudicación | NADA |
| Síncope | NADA |
| Desplegar Aparato Digestivo | despliega/pliega |
| Desplegar Aparato Genitourinario | despliega/pliega |
| Plegar Sistema Músculo-esquelético | despliega/pliega |
| Artralgias | NADA |
| Mialgias | NADA |
| Rigidez | NADA |
| Debilidad | NADA |
| Dolor | NADA |
| Deformidad | NADA |
| Desplegar Sistema Neurológico | despliega/pliega |
| Desplegar Sistema Endocrino | despliega/pliega |
| Desplegar Piel y Anexos | despliega/pliega |
| Guardar Interrogatorio | no se toca (escribe, IA o sesión) |

## /MedPacienteNotaIngreso?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteInterrogatorioAparatos?paciente=DEMO-0002 |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| + Agregar Diagnóstico | no se toca (escribe, IA o sesión) |
| + Agregar indicación | no se toca (escribe, IA o sesión) |
| BuenoEvolución favorable esperada | NADA |
| ReservadoEvolución incierta sujeta a monitoreo | NADA |
| GraveAlto riesgo de complicaciones inminentes | NADA |
| Guardar Nota de Ingreso | no se toca (escribe, IA o sesión) |

## /MedPacienteMonitoreoDetallado?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteNotaIngreso?paciente=DEMO-0002 |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | NADA |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Ver tendencias de signos vitales | navega a /MedPacienteTendenciasVitales?paciente=DEMO-0002 |
| Generar ideas | no se toca (escribe, IA o sesión) |

## /MedPacienteNotasSoapHistorial?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | NADA |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Filtrar notas: Todas | abre: ventana/menú |
| Nota del 24 Nov 2026, 14:12, Dr. Carlos Méndez | NADA |
| Abrir el detalle de la nota del 24 Nov 2026, 14:12 | navega a /MedPacienteNotasSoapDetalle?paciente=DEMO-0002&nota=2 |

## /MedPacienteNotasSoapDetalle?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Nota SOAP — Detalle |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Filtrar notas: Todas | abre: Nota SOAP — Detalle |
| Nota del 24 Nov 2026, 14:12, Dr. Carlos Méndez | NADA |
| Abrir el detalle de la nota del 24 Nov 2026, 14:12 | navega a /MedPacienteNotasSoapDetalle?paciente=DEMO-0002&nota=2 |

## /MedPacienteNotasSoapNueva?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteNotasSoapDetalle?paciente=DEMO-0002 |
| Notificaciones (173 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | NADA |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Nueva Nota SOAP |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |

## /MedPacienteTendenciasVitales?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Notificaciones (174 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Volver a Monitoreo en Vivo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| 6h | cambia la pantalla |
| 12h | cambia la pantalla |
| 24h | NADA |
| 48h | cambia la pantalla |
| 7d | cambia la pantalla |

## /MedPacienteConfigUmbrales?paciente=DEMO-0002

| Elemento | Qué hizo |
|---|---|
| Volver | navega a /MedPacienteTendenciasVitales?paciente=DEMO-0002 |
| Notificaciones (174 sin leer) | navega a /MedNotificacionesCentro |
| Nueva Nota SOAP | navega a /MedPacienteNotasSoapNueva?paciente=DEMO-0002 |
| Generar Reporte | aviso: Reporte de Ileana Montenegro Sáez generado |
| Consultar IA | abre: Consultar IA |
| Resumen | navega a /MedPacienteResumen?paciente=DEMO-0002 |
| Historia Clínica | navega a /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0002 |
| Notas SOAP | navega a /MedPacienteNotasSoapHistorial?paciente=DEMO-0002 |
| Monitoreo | navega a /MedPacienteMonitoreoDetallado?paciente=DEMO-0002 |
| Documentos | navega a /MedPacienteDocumentosClinicos?paciente=DEMO-0002 |
| Severidad por defecto de FC (Frecuencia Cardíaca) | abre: ventana/menú |
| Severidad por defecto de SpO2 (Saturación) | abre: ventana/menú |
| Severidad por defecto de PA Sistólica | abre: ventana/menú |
| Severidad por defecto de PA Diastólica | abre: ventana/menú |
| Severidad por defecto de Temp (Temperatura) | abre: ventana/menú |
| Severidad por defecto de FR (Frecuencia Resp.) | abre: ventana/menú |
| Restablecer valores sugeridos | no se toca (escribe, IA o sesión) |
| Guardar Configuración | no se toca (escribe, IA o sesión) |

## Pantallas solo con captura

- /MedPacienteResumen?paciente=DEMO-0011
- /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0011
- /MedPacienteAntecedentes?paciente=DEMO-0011
- /MedPacienteDatosPersonales?paciente=DEMO-0011
- /MedPacienteDiagnosticosActivos?paciente=DEMO-0011
- /MedPacienteRegistroDiagnostico?paciente=DEMO-0011
- /MedPacienteDocumentosClinicos?paciente=DEMO-0011
- /MedPacienteExploracionFisica?paciente=DEMO-0011
- /MedPacienteHistorialHospitalizaciones?paciente=DEMO-0011
- /MedPacienteIndicacionesMedicas?paciente=DEMO-0011
- /MedPacienteInterrogatorioAparatos?paciente=DEMO-0011
- /MedPacienteNotaIngreso?paciente=DEMO-0011
- /MedPacienteMonitoreoDetallado?paciente=DEMO-0011
- /MedPacienteNotasSoapHistorial?paciente=DEMO-0011
- /MedPacienteNotasSoapDetalle?paciente=DEMO-0011
- /MedPacienteNotasSoapNueva?paciente=DEMO-0011
- /MedPacienteTendenciasVitales?paciente=DEMO-0011
- /MedPacienteConfigUmbrales?paciente=DEMO-0011
- /MedPacienteResumen?paciente=DEMO-0009
- /MedPacienteHistoriaClinicaGeneral?paciente=DEMO-0009
- /MedPacienteAntecedentes?paciente=DEMO-0009
- /MedPacienteDatosPersonales?paciente=DEMO-0009
- /MedPacienteDiagnosticosActivos?paciente=DEMO-0009
- /MedPacienteRegistroDiagnostico?paciente=DEMO-0009
- /MedPacienteDocumentosClinicos?paciente=DEMO-0009
- /MedPacienteExploracionFisica?paciente=DEMO-0009
- /MedPacienteHistorialHospitalizaciones?paciente=DEMO-0009
- /MedPacienteIndicacionesMedicas?paciente=DEMO-0009
- /MedPacienteInterrogatorioAparatos?paciente=DEMO-0009
- /MedPacienteNotaIngreso?paciente=DEMO-0009
- /MedPacienteMonitoreoDetallado?paciente=DEMO-0009
- /MedPacienteNotasSoapHistorial?paciente=DEMO-0009
- /MedPacienteNotasSoapDetalle?paciente=DEMO-0009
- /MedPacienteNotasSoapNueva?paciente=DEMO-0009
- /MedPacienteTendenciasVitales?paciente=DEMO-0009
- /MedPacienteConfigUmbrales?paciente=DEMO-0009
