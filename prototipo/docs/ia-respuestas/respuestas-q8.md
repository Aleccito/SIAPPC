# Q4 y Q8 con la misma versión del backend (texto completo)

MedGemma 4B Q4_K_M y Q8_0 (archivo medgemma-4b-it-bf16_q8_0.gguf) en Ollama local, en CPU, con la segunda vuelta de mejoras (la instrucción del tipo en el mensaje de sistema). Ver REVISION-IA-RESPUESTAS.md, sección 8.

## 1. DEMO-0002 · ¿Gravedad de este paciente?

### Q4_K_M

tiempo total 18.3 s, primer texto a los 12.4 s, 38 palabras, tipo `gravedad`

**Gravedad: moderada** · NEWS2 parcial 6
- FC 109 lpm (último valor)
- SpO2 92 % (último valor)
- Falta para afinarla: peso, función renal y demás laboratorios, presión arterial, Glasgow (estado de conciencia), si recibe oxígeno suplementario.

### Q8_0

tiempo total 29.9 s, primer texto a los 15.2 s, 57 palabras, tipo `gravedad`

**Gravedad: alta · NEWS2 parcial**
- SpO2 88 % (hace menos de 1 min; últimas 6 h entre 88 y 93)
- FC 118 lpm (hace menos de 1 min; últimas 6 h entre 105 y 120)
- Falta para afinarla: peso, función renal y demás laboratorios, presión arterial, Glasgow (estado de conciencia), si recibe oxígeno suplementario.

## 2. DEMO-0002 · ¿Cuáles son los diagnósticos diferenciales más probables?

### Q4_K_M

tiempo total 22.9 s, primer texto a los 10.5 s, 69 palabras, tipo `diferenciales`

1.  **Tromboembolia pulmonar (TEP)** · Dolor torácico, falta de aire súbita, antecedentes quirúrgicos recientes, taquicardia, hipoxemia y edema en la pierna izquierda.

2.  **Insuficiencia cardíaca congestiva (ICC)** · Dolor torácico, falta de aire, taquipnea, edema periférico y antecedentes quirúrgicos recientes.

3.  **Neumonía** · Dolor torácico, falta de aire, fiebre (aunque no está registrada), taquipnea y antecedentes quirúrgicos recientes.

4.  **Pericarditis** · Dolor torácico pleurítico, taquicardia y antecedentes quirúrgicos recientes.

### Q8_0

tiempo total 36.3 s, primer texto a los 11.7 s, 76 palabras, tipo `diferenciales`

1.  **Tromboembolia pulmonar (TEP)** · Dolor torácico, falta de aire súbita, SpO2 bajo, FC elevada, FR elevada, antecedente quirúrgico reciente, puntaje qSOFA 1 positivo.

2.  **Insuficiencia cardíaca congestiva (ICC)** · Dolor torácico, falta de aire, edema en la pantorrilla izquierda, taquicardia y taquipnea.

3.  **Neumotórax espontáneo** · Dolor torácico, falta de aire, SpO2 bajo, aunque menos probable dado el antecedente quirúrgico reciente.

4.  **Pericarditis** · Dolor torácico (aunque no se describe como pleurítico), taquicardia y taquipnea.

## 3. DEMO-0002 · ¿Cuál sería el manejo inicial recomendado?

### Q4_K_M

tiempo total 21.4 s, primer texto a los 11.1 s, 70 palabras, tipo `manejo`

1.  Oxígeno suplementario · Mejora la saturación de oxígeno (SpO2 92% en aire ambiente).
2.  Continuar anticoagulación con Enoxaparina · Mantener la profilaxis tromboembólica pulmonar.
3.  Angio-TC de tórax · Confirmar o descartar la sospecha de TEP.
4.  Valorar anticoagulación según riesgo de sangrado · Evaluar la necesidad de ajustar la dosis de Enoxaparina en función del riesgo de hemorragia, considerando los antecedentes quirúrgicos y el uso concomitante de Enoxaparina.

### Q8_0

tiempo total 26.8 s, primer texto a los 12.4 s, 55 palabras, tipo `manejo`

1.  Oxígeno suplementario · Mejora la saturación de oxígeno (SpO2).
2.  Continuar Enoxaparina 40 mg subcutánea cada 24 h · Mantenimiento de la anticoagulación en caso de TEP.
3.  Angio-TC de tórax · Confirmación o descartamiento de TEP.
4.  Valorar anticoagulación según riesgo de sangrado · Considerar la necesidad de ajustar la dosis de Enoxaparina.

## 4. DEMO-0002 · ¿Cómo han evolucionado sus signos vitales en las últimas horas?

### Q4_K_M

tiempo total 30.3 s, primer texto a los 13.2 s, 95 palabras, tipo `evolucion`

**FC (lpm):** hace 6 h 112.9 → hace 5 h 112.8 → hace 4 h 112.3 → última hora 112.9, estable

**SpO2 (%):** hace 6 h 91.1 → hace 5 h 90.9 → hace 4 h 90.6 → última hora 90.8, estable

**FR (rpm):** hace 6 h 25.8 → hace 5 h 26 → hace 4 h 25.8 → última hora 26, estable

**Temperatura (°C):** hace 6 h 37.6 → hace 5 h 37.6 → hace 4 h 37.7 → última hora 37.6, estable

En conjunto:
Resumen de la serie: sin cambios en 6 h.

### Q8_0

tiempo total 24.9 s, primer texto a los 15.5 s, 32 palabras, tipo `evolucion`

**FC**: 117 lpm → 113 lpm, estable
**SpO2**: 90 % → 90.8 %, estable
**FR**: 26 rpm → 26 rpm, estable
En conjunto:

Resumen de la serie: sin cambios en 6 h.

## 5. DEMO-0002 · ¿Cuál es su última saturación?

### Q4_K_M

tiempo total 6.5 s, primer texto a los 6.2 s, 2 palabras, tipo `dato`

92 %

### Q8_0

tiempo total 6.6 s, primer texto a los 6.1 s, 2 palabras, tipo `dato`

90 %

## 6. DEMO-0002 · ¿Qué dosis de enoxaparina le corresponde?

### Q4_K_M

tiempo total 13.8 s, primer texto a los 11.6 s, 18 palabras, tipo `farmaco`

**Dosis:** No está en el expediente. Necesito el peso del paciente para calcular la dosis adecuada de Enoxaparina.

### Q8_0

tiempo total 17.1 s, primer texto a los 12.3 s, 20 palabras, tipo `farmaco`

Dosis: No está en el expediente. Necesito el peso del paciente para calcular la dosis correcta de Enoxaparina.
Vigilar: Sangrado.

## 7. DEMO-0009 · ¿Qué tiene este paciente?

### Q4_K_M

tiempo total 27.5 s, primer texto a los 10.6 s, 105 palabras, tipo `analisis`

**Gravedad**
*   NEWS2 parcial 6 (riesgo medio, algún parámetro en 3; sin oxígeno suplementario, PA sistólica, conciencia (Glasgow)); qSOFA 1 de 1 criterios evaluables (sin PA sistólica, conciencia (Glasgow)); índice de shock no calculable (sin PA). Gravedad sugerida por el NEWS2: moderada (puede ser mayor: el puntaje es parcial).

**Banderas rojas**
*   SpO2 baja (alta): 1 vez, la última hace 28 min («SpO2 89% bajo»).

**Diferenciales**
*   Descompensación de la insuficiencia cardíaca.

**Estudios**
*   Función renal y peso del paciente.

**Manejo**
*   Continuar el manejo indicado.

**Datos faltantes**
*   Peso, función renal y demás laboratorios, presión arterial, Glasgow (estado de conciencia), si recibe oxígeno suplementario.

### Q8_0

tiempo total 49.2 s, primer texto a los 11.3 s, 128 palabras, tipo `analisis`

**Gravedad**
*   Moderada (NEWS2 parcial 6)

**Banderas rojas**
*   Hipoxemia persistente (SpO2 <94%)

**Diferenciales**
*   Descompensación de la insuficiencia cardíaca: disnea, edema.
*   Hipertensión arterial no controlada.

**Estudios**
*   Análisis de sangre completo (hemograma, bioquímica renal, electrolitos).
*   Evaluación de la función ventricular izquierda (ecocardiografía).
*   Considerar un estudio de gases arteriales si la hipoxemia persiste.

**Manejo**
*   Evaluar y ajustar la diuresis con furosemida según respuesta clínica y función renal.
*   Monitorizar estrechamente la saturación de oxígeno y considerar suplementación con oxígeno si es necesario para mantener SpO2 >90%.
*   Considerar un tratamiento adicional para la disnea, como nebulizaciones con broncodilatadores o morfina (si no hay contraindicaciones).

**Datos faltantes**
*   Peso del paciente.
*   Función renal (creatinina, BUN).
*   Presión arterial sistólica.
*   Glasgow Coma Scale (GCS)

## 8. DEMO-0009 · ¿Qué estudios de laboratorio e imagen solicitarías?

### Q4_K_M

tiempo total 19 s, primer texto a los 11 s, 59 palabras, tipo `estudios`

- **Hemograma completo** · Evaluación de la anemia y posible infección.
- **Ionograma** · Evaluar el equilibrio electrolítico, especialmente potasio y sodio, dada la furosemida.
- **Función renal (creatinina sérica y BUN)** · Monitorizar la función renal en relación con la furosemida y evaluar la insuficiencia cardíaca.
- **Troponinas** · Evaluar posible isquemia miocárdica secundaria a la insuficiencia cardíaca.

### Q8_0

tiempo total 22 s, primer texto a los 11.4 s, 42 palabras, tipo `estudios`

- **Análisis de sangre completo** · Evaluación general del estado inflamatorio, función renal y electrolitos.
- **Troponina I** · Evaluar posible isquemia miocárdica.
- **Ecocardiograma transtorácico** · Evaluar la fracción de eyección, la morfología ventricular y la presencia de otras patologías cardíacas.

## 9. DEMO-0009 · Revisa alergias e interacciones de sus medicamentos activos.

### Q4_K_M

tiempo total 20.3 s, primer texto a los 10.9 s, 56 palabras, tipo `farmaco`

*   **Furosemida:** Alergia leve a yodo (prurito). Interacción potencial con losartán (puede disminuir la eficacia del losartán). Indicación: Insuficiencia cardíaca, edema.
*   **Carvedilol:** No hay alergias conocidas ni interacciones relevantes en este paciente. Indicación: Hipertensión arterial, insuficiencia cardíaca.
*   **Losartán:** No hay alergias conocidas ni interacciones relevantes en este paciente. Indicación: Hipertensión arterial.

Sin interacciones relevantes.

### Q8_0

tiempo total 18.1 s, primer texto a los 11.3 s, 21 palabras, tipo `farmaco`

**Furosemida:** **No** · No hay interacciones relevantes.
**Carvedilol:** **No** · No hay interacciones relevantes.
**Losartán:** **No** · No hay interacciones relevantes.

## 10. DEMO-0009 · Hazme un resumen para entregar el turno.

### Q4_K_M

tiempo total 34.1 s, primer texto a los 12.9 s, 136 palabras, tipo `turno`

- **Situación:** Insuficiencia cardíaca, no especificada [I50.9] (presuntivo); Insuficiencia cardíaca [I50.9] (definitivo). NEWS2 parcial 6 (riesgo medio, algún parámetro en 3; sin oxígeno suplementario, PA sistólica, conciencia (Glasgow)); qSOFA 1 de 1 criterios evaluables (sin PA sistólica, conciencia (Glasgow)). Gravedad sugerida por el NEWS2: moderada.
- **Cambios recientes:** Sin cambios significativos en los signos vitales (FC, SpO2, FR, temperatura) durante las últimas 6 horas. La SpO2 ha estado entre 89 y 94%.
- **Tratamiento actual:** Furosemida 40 mg intravenosa cada 12 h; Carvedilol 6.25 mg oral cada 12 h; Losartán 50 mg oral cada 24 h.
- **Pendientes:** Evaluar la función renal y el peso del paciente para ajustar la dosis de furosemida si es necesario. Monitorizar la SpO2 y la PA sistólica.
- **Datos que faltan:** Peso, función renal y demás laboratorios (incluyendo presión arterial).

### Q8_0

tiempo total 49.1 s, primer texto a los 13.9 s, 132 palabras, tipo `turno`

- **Situación:** Insuficiencia cardíaca, no especificada [I50.9] (presuntivo); Insuficiencia cardíaca [I50.9] (definitivo). NEWS2 parcial 5 (riesgo medio; sin oxígeno suplementario, PA sistólica, conciencia (Glasgow)); qSOFA 1 de 1 criterios evaluables (sin PA sistólica, conciencia (Glasgow)). Gravedad sugerida por el NEWS2: moderada (puede ser mayor: el puntaje es parcial).
- **Cambios recientes:** Sin cambios en los signos vitales y saturación de oxígeno durante las últimas 6 horas.
- **Tratamiento actual:** Furosemida 40 mg intravenosa cada 12 h; Carvedilol 6.25 mg oral cada 12 h; Losartán 50 mg oral cada 24 h.
- **Pendientes:** Vigilar la función renal y el peso del paciente, ya que no están en el expediente. Considerar la necesidad de ajustar la diurética según los resultados de laboratorio.
- **Datos que faltan:** Peso, función renal y demás laboratorios (electrolitos, troponina).

## 11. DEMO-0009 · ¿Qué medicamentos tiene indicados?

### Q4_K_M

tiempo total 7.7 s, primer texto a los 3.8 s, 24 palabras, tipo `dato`

*   Furosemida 40 mg intravenosa cada 12 h
*   Carvedilol 6.25 mg oral cada 12 h
*   Losartán 50 mg oral cada 24 h

### Q8_0

tiempo total 11.3 s, primer texto a los 4.2 s, 24 palabras, tipo `dato`

*   Furosemida 40 mg intravenosa cada 12 h
*   Carvedilol 6.25 mg oral cada 12 h
*   Losartán 50 mg oral cada 24 h

## 12. DEMO-0011 · ¿Está grave?

### Q4_K_M

tiempo total 21.9 s, primer texto a los 8.5 s, 90 palabras, tipo `gravedad`

**Gravedad: baja** · NEWS2 parcial 0
- FC 80 lpm (hace menos de 1 min; últimas 6 h entre 76 y 84)
- SpO2 96 % (hace menos de 1 min; últimas 6 h entre 95 y 99)
- FR 16 rpm (hace menos de 1 min; últimas 6 h entre 14 y 18)
- Temperatura 37.1 °C (hace menos de 1 min; últimas 6 h entre 36.9 y 37.5)
- Falta para afinarla: peso, función renal y demás laboratorios, presión arterial, Glasgow (estado de conciencia), si recibe oxígeno suplementario.

### Q8_0

tiempo total 32.7 s, primer texto a los 9.2 s, 88 palabras, tipo `gravedad`

**Gravedad: baja · NEWS2 0**
- FC 77 lpm (hace menos de 1 min; últimas 6 h entre 76 y 84)
- SpO2 96 % (hace menos de 1 min; últimas 6 h entre 95 y 99)
- FR 15 rpm (hace menos de 1 min; últimas 6 h entre 14 y 18)
- Temperatura 37.4 °C (hace menos de 1 min; últimas 6 h entre 36.9 y 37.5)
Falta para afinarla: peso, función renal y demás laboratorios, presión arterial, Glasgow (estado de conciencia), si recibe oxígeno suplementario.

## 13. DEMO-0011 · ¿Qué banderas rojas debo vigilar en este paciente?

### Q4_K_M

tiempo total 19.7 s, primer texto a los 8.1 s, 75 palabras, tipo `banderas`

- **FC > 90 lpm** · Taquicardia, posible respuesta a dolor o hipovolemia.
- **SpO2 < 95 %** · Hipoxemia, posible neumonía o atelectasia.
- **FR > 30 rpm** · Taquipnea, posible disnea o ansiedad.
- **Temperatura > 38 °C** · Fiebre, posible infección.
- **Glasgow < 8** · Alteración del estado de conciencia, posible hipoxia cerebral o edema cerebral.
- **Signos de shock (hipotensión, taquicardia, alteración del estado mental)** · Shock séptico o hipovolémico.

### Q8_0

tiempo total 12.9 s, primer texto a los 8.5 s, 17 palabras, tipo `banderas`

- **Mareo intenso** · Mareo posológico (Tramadol)
- **Dolor leve en heridas** · Infección de la herida

## 14. DEMO-0011 · ¿Puedo darle tramadol para el dolor?

### Q4_K_M

tiempo total 10.3 s, primer texto a los 8.9 s, 8 palabras, tipo `farmaco`

**No** · Alergia conocida al tramadol (mareos intensos).

### Q8_0

tiempo total 11.7 s, primer texto a los 9.3 s, 8 palabras, tipo `farmaco`

**No** · Alergia conocida a Tramadol (mareos intensos).

## 15. DEMO-0011 · ¿Qué alergias tiene?

### Q4_K_M

tiempo total 4.2 s, primer texto a los 3.1 s, 9 palabras, tipo `dato`

La paciente presenta alergia a Tramadol (leve: Mareo intenso).

### Q8_0

tiempo total 4.7 s, primer texto a los 3.4 s, 4 palabras, tipo `dato`

Tramadol (leve: Mareo intenso)

## 16. DEMO-0002 · (ideas a pedido)

### Q4_K_M

tiempo total 20.6 s

1. **Tromboembolia pulmonar** · Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera; SpO2 90 % (hace menos de 1 min; últimas 6 h entre 88 y 93); FC 113 lpm (hace menos de 1 min; últimas 6 h entre 105 y 120); sospecha alta de tromboembolia pulmonar posoperatoria.

### Q8_0

tiempo total 48.4 s

1. **Tromboembolia pulmonar** · Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera; SpO2 91 % (hace menos de 1 min; últimas 6 h entre 88 y 93); FC 110 lpm (hace menos de 1 min; últimas 6 h entre 105 y 120).
2. **Fractura de cuello de fémur** · Fractura de cuello de fémur [S72.0] (definitivo); Trombosis venosa profunda (TVP) asociada a fracturas óseas, especialmente en pacientes postoperatorios; riesgo aumentado de complicaciones tromboembólicas.
3. **Insuficiencia cardíaca congestiva** · Falta de aire súbita; FC 110 lpm (hace menos de 1 min; últimas 6 h entre 105 y 120); FR 26 rpm (hace menos de 1 min; últimas 6 h entre 23 y 29).

## 17. DEMO-0009 · (ideas a pedido)

### Q4_K_M

tiempo total 23.1 s

1. **Insuficiencia cardíaca congestiva** · La paciente presenta hinchazón de piernas, falta de aire al acostarse y una SpO2 baja (89-94%), lo que sugiere insuficiencia cardíaca congestiva.
2. **Descompensación de la insuficiencia cardíaca** · La paciente tiene hinchazón de piernas, falta de aire al acostarse y una SpO2 baja (89-94%), lo que sugiere descompensación de la insuficiencia cardíaca.
3. **Arritmia cardíaca** · La frecuencia cardíaca es ligeramente elevada (96 lpm) y podría ser una arritmia, aunque no se especifica el tipo.

### Q8_0

tiempo total 25.2 s

1. **Insuficiencia cardíaca congestiva** · Hinchazón de piernas, falta de aire al acostarse, SpO2 93%, FC 96 lpm, FR 23 rpm, uso de furosemida y carvedilol.
2. **Descompensación de la insuficiencia cardíaca** · Hinchazón de piernas, falta de aire al acostarse, SpO2 93%, FC 96 lpm, FR 23 rpm, uso de furosemida y carvedilol.

## 18. DEMO-0011 · (ideas a pedido)

### Q4_K_M

tiempo total 18.5 s

1. **Evolución Posoperatoria Colecistectomía** · Postoperatorio inmediato de colecistectomía laparoscópica, dolor leve en heridas, signos vitales estables.
2. **Reacción Alérgica Tramadol** · Alergia activa a tramadol (leve: mareo intenso), sin alertas recientes.
3. **Infección Postoperatoria** · Postoperatorio, sin alertas recientes, signos vitales estables y fiebre normal.

### Q8_0

tiempo total 22.2 s

1. **Dolor postoperatorio leve** · Dolor leve en heridas postoperatorias de colecistectomía laparoscópica.
2. **Reacción alérgica a cefazolina** · Alergia leve a tramadol, cefazolina administrada por vía intravenosa.
3. **Complicación posquirúrgica (poco probable)** · Sin alertas recientes ni signos fuera de rango, la evolución esperada es favorable.
