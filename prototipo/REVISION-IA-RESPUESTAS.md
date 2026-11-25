# Calidad de las respuestas de la IA — revisión

> **Estado: fase 2 hecha.** Las secciones 1 a 5 son el informe de la fase 1 (set de prueba, respuestas de antes,
> diagnóstico y propuesta, aprobada). Lo que se cambió está en la sección 6; el antes y después, en la 7, y la prueba
> con MedGemma 4B en Q8, en la 8. Va en el mismo PR que `REVISION-MEDICO.md`.

## 1. Cómo se probó

- **Modelo:** el mismo del servidor, `hf.co/Mungert/medgemma-4b-it-GGUF:Q4_K_M` (MedGemma 4B, cuantizado a 4 bits).
  Corrió en un contenedor de Ollama local (`ollama/ollama:0.12.6`), en CPU.
- **Backend:** el de `dev` sin cambios. Apuntó al Ollama con un override de Compose temporal (`LLM_URL`, `LLM_MODEL`),
  sin tocar el `.env`. Temperatura 0.2 y tope de 900 tokens, los de `backend/src/lib/clinicalAi.ts`.
- **Consultas:** por la API, como el prototipo (`POST /ai/assist/stream`), con el médico del seed y la base de demo.
  El publicador de demo estaba corriendo, así que el análisis automático por alerta usó el mismo modelo a la vez,
  como pasará en el servidor.
- **Máquina:** x86 con 32 hilos (Docker con 8 GB). El servidor es ARM con 4 núcleos y sin GPU: allá los tiempos van
  a ser bastante más largos que estos (se estima de 3 a 6 veces, por los núcleos).
- **Archivos:**
  - Las respuestas completas están en `docs/ia-respuestas/respuestas-antes.md` (y en `antes.json`); las de después,
    en `respuestas-despues.md` y `respuestas-q8.md` (secciones 7 y 8).
  - El contexto exacto que recibió el modelo en cada pregunta está en `docs/ia-respuestas/contexto-antes.txt`,
    sacado del propio backend con `patientContext` y `detectarTemas`.

**Pacientes:**

| Paciente | Caso | Por qué |
|---|---|---|
| DEMO-0002, Ileana Montenegro, 55 años | Sospecha de TEP 5 días después de una osteosíntesis de cadera. FC ~119, SpO2 88–93 %, FR ~25, 58 alertas abiertas | Crítico; el ejemplo que ya falló |
| DEMO-0009, Marisol Caicedo, 65 años | Insuficiencia cardíaca descompensada, alergia al yodo, furosemida, carvedilol y losartán | No es de los 8 del simulador |
| DEMO-0011, Graciela Arosemena, 52 años | Posoperatorio de colecistectomía laparoscópica sin complicaciones, alergia al tramadol | Estable |

## 2. Set de prueba y resultado de antes

Cada fila es una pregunta típica de un médico. Los tiempos son de esta máquina: hasta el primer texto y hasta el
final. "Plantilla" es la respuesta con las 5 secciones (**Banderas rojas, Diferenciales, Estudios, Manejo, Datos
faltantes**), que el prompt reserva para el análisis completo.

| # | Paciente | Tipo | Pregunta | Tiempo | ¿Responde lo pedido? | Problemas |
|---|---|---|---|---|---|---|
| 1 | 0002 | Gravedad | ¿Gravedad de este paciente? | 38 / 73 s | No | Plantilla completa, sin decir qué tan grave está. Pone **síntomas como diferenciales** ("Dolor torácico", "Disnea"). Dice que falta "el estado actual (inService…)": se le filtra el valor interno |
| 2 | 0002 | Diferenciales | ¿Cuáles son los diferenciales más probables? | 50 / 62 s | En parte | Agrega Estudios sin que se pidan, y mete "Oxígeno a SpO2 > 92 %" y "Valorar anticoagulación" como **estudios** (los copia del plan de la nota). "Pericarditis constrictiva" sin nada que la sostenga |
| 3 | 0002 | Manejo | ¿Cuál sería el manejo inicial? | 12 / 41 s | En parte | Plantilla completa en vez de solo manejo. "HBPM **o warfarina**" como inicio, sin aclarar que la warfarina no se inicia sola en la fase aguda |
| 4 | 0002 | Evolución | ¿Cómo han evolucionado sus signos en las últimas horas? | 5 / 11 s | No | Responde "Banderas rojas" con el último valor; no dice cómo cambiaron. El contexto solo trae último, mínimo y máximo de 6 h: no hay serie |
| 5 | 0002 | Dato | ¿Cuál es su última saturación? | 4 / 6 s | Sí | — |
| 6 | 0002 | Dosis | ¿Qué dosis de enoxaparina le corresponde? | 13 / 29 s | **No, y es peligrosa** | Empieza con **"El médico a cargo es Dr. Pérez."**, un dato inventado: copia el ejemplo del prompt y no recibió el equipo. Después plantilla con síntomas como diferenciales. Responde la dosis **profiláctica que ya tiene** (40 mg/24 h) como "la que le corresponde" para una TEP, sin decir que falta el **peso** ni la función renal |
| 7 | 0009 | Qué tiene | ¿Qué tiene este paciente? | 16 / 54 s | Sí | Plantilla correcta para una pregunta abierta. Pone "Insuficiencia cardíaca" como bandera roja (es el diagnóstico) |
| 8 | 0009 | Estudios | ¿Qué estudios solicitarías? | 13 / 19 s | Sí | Agrega una "bandera roja" que no se pidió |
| 9 | 0009 | Interacciones | Revisa alergias e interacciones | 13 / 33 s | En parte | **"Losartán: inhibidor de la ECA"** (es un ARA II). "Furosemida disminuye la eficacia del losartán", dudoso. "El carvedilol puede empeorar la disfunción ventricular", engañoso sin contexto: es tratamiento estándar en IC con FE reducida, con cuidado en la descompensación |
| 10 | 0009 | Turno | Resumen para entregar el turno | 48 / 75 s | No | Plantilla de análisis en vez de un resumen de entrega (situación, cambios, pendientes). Dice que falta "Medicación actual", que sí estaba en el contexto |
| 11 | 0009 | Dato | ¿Qué medicamentos tiene indicados? | 39 / 40 s | Sí | Correcto, pero tardó 39 s en empezar, muy probablemente en cola detrás de un análisis automático (el modelo atiende de a uno) |
| 12 | 0011 | Gravedad | ¿Está grave? | 9 / 38 s | No | Plantilla con "banderas rojas" que no lo son ("está tomando paracetamol y cefazolina", "tiene alergia a tramadol"). No dice lo esencial: **estable, sin datos de gravedad** |
| 13 | 0011 | Banderas rojas | ¿Qué banderas rojas vigilar? | 7 / 14 s | No | Lista la alergia y los fármacos; no las banderas de un posoperatorio de colecistectomía (fiebre, dolor que aumenta, ictericia, sangrado, taquicardia, signos peritoneales) |
| 14 | 0011 | Fármaco | ¿Puedo darle tramadol? | 0,5 / 7 s | Sí, con error | Empieza otra vez con **"El médico a cargo es Dr. Pérez."** (inventado). El resto está bien: no, por la alergia |
| 15 | 0011 | Dato | ¿Qué alergias tiene? | 1 / 3 s | Sí | — |
| 16 | 0002 | Ideas a pedido | (JSON de hipótesis) | 28 s | En parte | **"SpO2 86 %, FR 28"**: no son del paciente (mínimo 88 %, FR 23–29), es el ejemplo del prompt de `aiAuto.ts`. "Insuficiencia cardíaca congestiva" por "edema en la pantorrilla", flojo |
| 17 | 0009 | Ideas a pedido | (JSON de hipótesis) | 48 s | En parte | Otra vez **"SpO2 86 % y FR 28"**, copiado del ejemplo. Las dos ideas son la misma ("descompensación de IC" e "IC aguda") |
| 18 | 0011 | Ideas a pedido | (JSON de hipótesis) | 16 s | No | "Disminución del gasto cardíaco" y "Deshidratación leve" para un posoperatorio estable, sin ningún dato que las sostenga |

**En números:** de 15 consultas, 6 responden bien lo pedido, 5 a medias y 4 no. En 7 sale la plantilla de 5 secciones,
y solo 1 la pedía (la #7). Hay 2 respuestas con un dato inventado (el médico a cargo) y 2 análisis automáticos con
signos inventados. Hay 3 errores clínicos claros: la dosis de enoxaparina, el losartán y las banderas rojas del
posoperatorio. Las respuestas largas tardan de 40 a 75 s en esta máquina; con 4 núcleos ARM, varias pasarían del
minuto y medio.

## 3. Diagnóstico: por qué fallan

### 3.1 El prompt

- **Un solo prompt grande para todo** (`SYSTEM` en `routes/ai.ts`): unas 2.200 letras con 13 reglas. La regla "la
  plantilla solo si la consulta es abierta" está al final, y lo más visible es la lista de las 5 secciones. Un modelo
  de 4B sigue la estructura más visible y no la condición. Por eso la plantilla sale en gravedad, manejo, turno y
  evolución.
- **Los ejemplos se copian tal cual.**
  - El `SYSTEM` dice `(p. ej. "El médico a cargo es ...")` y el modelo lo escribió dos veces, inventando un nombre
    cuando no recibió el equipo.
  - El `AUTO_SYSTEM` de `aiAuto.ts` dice `(p. ej. "SpO2 86 %, FR 28")` y esas cifras aparecen en los análisis de dos
    pacientes que no las tienen.
  - Con un modelo chico, un ejemplo con cifras o nombres concretos es una invitación a repetirlos.
- **No define qué es un diferencial, una bandera roja o un estudio.** Por eso pone síntomas como diferenciales,
  tratamientos como estudios y "toma paracetamol" como bandera roja.
- **No hay un formato para "gravedad", "evolución" ni "entrega de turno":** el modelo cae en la plantilla.

### 3.2 La detección de temas (`services/aiTemas.ts`)

- Decide **qué secciones del expediente se mandan**, pero no **qué tipo de respuesta se pide**. El prompt es el mismo
  para un dato, una gravedad o un análisis completo.
- **"gravedad", "grave", "estable", "empeora", "turno" y "entregar" no están en `RAZONAR`.** "¿Gravedad de este
  paciente?" no reconoce ningún tema y cae en "todo lo clínico", que en ese caso es lo correcto, pero por casualidad.
- **"dosis" y los fármacos no traen el peso ni la función renal**: no existen en la base (la exploración está vacía y
  no hay laboratorios). El modelo no tiene cómo saber que le faltan, salvo que el contexto se lo diga.
- "Evolución" activa `vitales` y `evoluciones`, pero `vitales` solo trae un resumen (último, mínimo, máximo), no la
  serie.

### 3.3 El contexto que recibe (`lib/clinicalAi.ts`)

Se ve en `docs/ia-respuestas/contexto-antes.txt`:

- **Valores internos:** `Estado: inService`, `Sangre: A_POS`. El modelo los repite ("estado actual (inService…)").
- **Signos en formato de máquina:** `hr=119 lpm (2026-11-25T03:27:41.365Z; mín 106, máx 120, estable)`. Los nombres
  son códigos (`hr`, `resp`) y la marca de tiempo ISO ocupa más que el dato. La "tendencia" compara los últimos 15 min
  contra el resto de 6 h con un umbral del 3 %: casi siempre dice "estable".
- **Alertas repetidas:** "58 abiertas" y las 5 "últimas" son la misma ("SpO2 89 % bajo") cada 30 s. No dice cuántas
  por signo ni desde cuándo, y gasta contexto en lo mismo (el backend crea una alerta por lectura, pedido 28 de
  CONEXION-BACKEND.md).
- **Faltan la PA y la conciencia:** no hay PA en el backend (pedido 10) ni Glasgow sin exploración.
- **No hay ningún puntaje de gravedad.** El modelo tiene que "calcular" la gravedad, y uno de 4B no lo hace bien.
- **Sin "Datos que NO hay":** el peso, la función renal y los laboratorios no aparecen, ni como faltantes.

### 3.4 Los parámetros

- `temperature: 0.2` está bien para esto. No es la causa.
- `maxTokens: 900` para todo: una pregunta de un dato no necesita más de 60, y una gravedad, unos 200. Con 900 el
  modelo "llena" con secciones, y en CPU cada token cuenta: a ~7 tokens/s en esta máquina, 900 tokens son 2 minutos.
- La ventana de contexto de Ollama es de 4.096 tokens (sale en `ollama ps`). Prompt, contexto y respuesta entran,
  pero con poco margen si crecen.

### 3.5 Los límites de un modelo de 4B

- **Sigue mal las instrucciones condicionales** ("solo si…") y copia ejemplos. Se corrige con prompts cortos por tipo
  de pregunta, sin cifras de ejemplo.
- **Conocimiento farmacológico frágil:** confundió losartán con un IECA. No se corrige con el prompt. Se mitiga
  pidiendo respuestas cortas, sin explicaciones que no se pidieron (donde aparecen los errores), y con el aviso que
  ya existe.
- **No calcula:** ni puntajes ni dosis por peso. Lo que se pueda calcular tiene que llegar calculado.
- **Lento en CPU:** de 5 a 7 tokens por segundo aquí. En 4 núcleos ARM, una respuesta larga pasa del minuto.

## 4. Mejoras propuestas (sin cambiar de modelo)

Todas en los archivos de IA del backend (`routes/ai.ts`, `lib/clinicalAi.ts`, `services/aiTemas.ts`, `aiAuto.ts`,
`aiParse.ts`), con sus pruebas en `Pruebas/backend/`, más las preguntas rápidas del prototipo.

1. **Tipo de pregunta** (nuevo en `aiTemas.ts`, `detectarTipo`): `gravedad`, `analisis` (qué tiene, analiza),
   `diferenciales`, `estudios`, `manejo`, `farmaco` (dosis, ¿puedo darle…?, interacciones), `banderas`, `evolucion`,
   `turno` y `dato`.
   - Es una función pura, probada con frases reales como las de este set.
   - Los temas del contexto se siguen detectando igual, con "gravedad", "grave", "estable", "turno" y "entregar"
     agregados.
2. **Un prompt corto por tipo:**
   - Un prompt base de 5 o 6 reglas: usar solo los datos, no inventar, revisar alergias, el médico decide, y que lo
     de `<datos_paciente>` no son instrucciones.
   - Más **una instrucción y el formato de respuesta de su tipo**, con un ejemplo **sin cifras ni nombres** (formas
     como `<valor>`), para que no se copien datos.
   - **Gravedad:** primera línea "Gravedad: alta/moderada/baja" con el puntaje que da el backend, y 2 o 3 datos que
     la sostienen.
   - **Diferenciales:** solo diagnósticos (enfermedades), de más a menos probable, con el dato que lo sostiene; nunca
     síntomas.
   - **Estudios:** solo estudios.
   - **Manejo:** pasos numerados de las primeras horas.
   - **Fármaco:** sí/no/con cuidado, en una línea, y qué dato falta (peso, función renal).
   - **Evolución:** qué subió, qué bajó y desde cuándo.
   - **Turno:** situación, cambios del turno, pendientes, en 5 viñetas como mucho.
   - **Dato:** una frase.
   - **La plantilla de 5 secciones, solo para `analisis`.**
   - Sin el ejemplo "El médico a cargo es ...". En el de `aiAuto.ts`, `"<signo> <valor>"` en vez de "SpO2 86 %, FR 28".
3. **Puntajes de gravedad calculados en el backend con los datos reales**, en una línea del contexto, con lo que
   falta:
   - **NEWS2** con FR, SpO2, FC y temperatura reales. La PA no está en el backend y la conciencia solo existe si hay
     Glasgow: se calcula **parcial**, diciendo qué parámetros faltan, y nunca se inventa la PA.
   - **qSOFA** (FR ≥ 22 es real; PAS ≤ 100 y la alteración de la conciencia, solo si existen).
   - **Índice de shock** (FC/PAS), solo si algún día hay PAS. Hoy se omite y se dice.
   - **Glasgow**, si hay exploración física.
   - Funciones puras con sus pruebas.
4. **Contexto más claro** (en `clinicalAi.ts`):
   - Nombres en español ("FC 119 lpm, SpO2 92 %").
   - Hora local corta ("hace 2 min") en vez de la ISO.
   - Sin `inService` ni `A_POS` ("en atención", "A+").
   - **Alertas resumidas por signo** ("SpO2 baja: 52 veces en 6 h, la última hace 1 min, 89 %").
   - Para `evolucion` y `turno`, la **serie por hora** de las últimas 6 h.
   - Una línea **"Datos que no hay en el expediente: peso, función renal, laboratorios, PA"**, para que el modelo lo
     diga en vez de suponer.
5. **Parámetros por tipo:** tope de tokens según el tipo (`dato` 80, `gravedad`/`farmaco`/`estudios`/`banderas` 220,
   `diferenciales`/`manejo`/`evolucion`/`turno` 320, `analisis` 700). Temperatura en 0.1 para `dato`, `farmaco` y
   `gravedad`, y 0.2 para el resto. Respuestas más cortas son, en CPU, respuestas más rápidas.
6. **Preguntas rápidas del prototipo, una por tipo** (`src/components/ai/aiText.ts`):
   - Se quedan Diferenciales, Banderas rojas, Estudios, Alergias e interacciones y Manejo inicial.
   - Se agregan "¿Qué tan grave está?" y "Resumen para entregar turno".
   - Cada una manda el texto que el backend reconoce como su tipo.
7. **Análisis automático (`aiAuto.ts`):**
   - El mismo contexto mejorado, con los puntajes.
   - Un ejemplo sin cifras.
   - La regla "cada hipótesis es un diagnóstico, no un síntoma".
   - Que dos ideas no sean la misma.
   - Sube `PROMPT_VERSION` a `auto-v3`.
8. **Pruebas** en `Pruebas/backend/`:
   - `aiTemas.test.ts` con el tipo de cada pregunta del set.
   - Una prueba nueva de los puntajes, con casos de NEWS2 y qSOFA de libro.
   - `aiParse.test.ts` sigue igual.
   - Ninguna prueba llama al modelo.

**Cómo se mide el después:** el mismo set, con el mismo modelo y la misma máquina, contra el backend con las mejoras.
La tabla de antes y después va en este documento, con estas columnas:
- ¿responde lo pedido?;
- ¿plantilla cuando no corresponde?;
- ¿datos inventados?;
- errores clínicos;
- palabras;
- tiempo.

## 5. Si el modelo no alcanza

Con lo de arriba deberían desaparecer la plantilla fuera de lugar, los datos copiados de los ejemplos, los síntomas
como diferenciales y la falta de una respuesta de gravedad. Lo que no se arregla con prompts es el conocimiento fino
(como el losartán) y la velocidad.

Si después de las mejoras sigue habiendo errores clínicos, estas alternativas corren en el servidor (ARM, 4 núcleos,
22 GB de RAM, sin GPU) con Ollama, sin que los datos salgan del hospital:

| Opción | Memoria aprox. | Velocidad frente a hoy | Comentario |
|---|---|---|---|
| MedGemma 4B en Q8_0 (en vez de Q4_K_M) | ~5 GB | ~1,5× más lento | Misma familia; menos pérdida por la cuantización. El cambio más barato |
| Qwen2.5 7B Instruct Q4_K_M | ~5 GB | ~2× más lento | Modelo general; sigue mejor las instrucciones y el formato; sin ajuste médico |
| Gemma 3 12B Q4_K_M | ~8 GB | ~3× más lento | Mejor razonamiento; respuestas largas de varios minutos en 4 núcleos |
| MedGemma 27B Q4_K_M | ~17 GB | ~6–8× más lento | Cabe en 22 GB, pero tardaría varios minutos por respuesta en CPU: no sirve para consultas en vivo |

**Recomendación:**
- Aplicar primero las mejoras de la sección 4 con el modelo actual y medir.
- Si quedan errores, probar MedGemma 4B Q8_0, que es un cambio de `LLM_MODEL` y nada más.
- Un modelo de 7B o más solo para lo que no es urgente (resumen de turno, ideas a pedido), y el de 4B para las
  consultas rápidas.
- Cualquier cambio de modelo se decide con este mismo set, medido en el servidor.

## 6. Qué se cambió (fase 2)

Todo en los archivos de IA del backend, con pruebas que no llaman al modelo. Las rutas, los permisos, los límites y la
forma de las respuestas no cambian. El marco `inicio` del flujo y la respuesta de `/ai/assist` traen además el
`tipo` de la pregunta.

### 6.1 Archivos

| Archivo | Qué cambió |
|---|---|
| `services/aiTemas.ts` | `detectarTipo` (10 tipos, por orden), `PARAMETROS` (tope y temperatura por tipo), `temasDelTipo`, `INSTRUCCION` (una por tipo), `PROMPT_BASE`, `mensajesDe` (los mensajes de una consulta), `promptDe` y `PROMPT_IDEAS` (el prompt del análisis automático, movido aquí para probarlo). Tema nuevo `serie`. "gravedad", "grave", "estable", "turno" y "entregar" piden todo lo clínico |
| `services/aiParse.ts` | Piezas puras: `calcularPuntajes` (NEWS2, qSOFA, índice de shock), `textoPuntajes` y `gravedadSugerida`, `textoAlertas`, `textoSerie` y `rumbo`, `datosFaltantes`, nombres en español (`nombreSigno`, `grupoSanguineo`, `estadoPaciente`, `sexoPaciente`, `haceTexto`), `sinRepetir` (ideas con el mismo título) y `crearPrioridad` |
| `lib/clinicalAi.ts` | El contexto nuevo (6.2), `modelo()` con un cliente por combinación de tope y temperatura, y `prioridad` |
| `routes/ai.ts` | El prompt base corto como sistema y la instrucción del tipo al final del mensaje (`mensajesDe`); los temas de la pregunta más los de su tipo; la consulta y las ideas a pedido marcan la prioridad |
| `services/aiAuto.ts` | Espera a que no haya consultas y 20 s de calma; si empieza una consulta mientras analiza, se corta y vuelve a la cola (hasta 5 veces). `PROMPT_VERSION` `auto-v3` |
| `Pruebas/backend/aiTemas.test.ts` | El tipo de las 15 preguntas del set y de las preguntas rápidas; que ningún prompt traiga cifras, unidades ni nombres; que la plantilla solo esté en el análisis |
| `Pruebas/backend/aiPuntajes.test.ts` (nueva) | NEWS2 y qSOFA de libro, con todos los límites; el puntaje parcial; el contexto en español; ideas repetidas; la prioridad y su calma |

### 6.2 Lo que recibe el modelo ahora

Ejemplo real de DEMO-0002 para "¿Gravedad de este paciente?" (completo en `docs/ia-respuestas/contexto-despues.txt`):

```
Edad: 55 años · Sexo: femenino · Grupo sanguíneo: A+
Motivo de consulta: Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera · Estado: en atención
Alergias activas: ninguna registrada
Medicamentos activos: Enoxaparina 40 mg subcutánea cada 24 h; Paracetamol 1 g oral cada 8 h
Diagnósticos activos: Fractura de cuello de fémur [S72.0] (definitivo); Tromboembolia pulmonar [I26.9] (presuntivo)
Datos que no hay en el expediente: peso, función renal y demás laboratorios, presión arterial, Glasgow (estado de conciencia), si recibe oxígeno suplementario.
Antecedentes: quirurgico: Osteosíntesis de cadera derecha hace 5 días; habito: Tabaquismo, 10 cigarrillos al día
Signos vitales del monitor (último valor): FC 118 lpm (hace menos de 1 min; últimas 6 h entre 105 y 120); SpO2 90 % (…); FR 24 rpm (…); Temperatura 37.5 °C (…)
Puntajes calculados por el sistema: NEWS2 parcial 7 (riesgo alto, algún parámetro en 3; sin oxígeno suplementario, PA sistólica, conciencia (Glasgow)); qSOFA 1 de 1 criterios evaluables (…); índice de shock no calculable (sin PA). Gravedad sugerida por el NEWS2: alta (puede ser mayor: el puntaje es parcial).
Alertas de las últimas 6 h por tipo: SpO2 baja (alta): 39 veces, la última hace 1 min («SpO2 89% bajo»). Abiertas sin atender: 92 (10 de los últimos 30 min; las demás son anteriores).
Exploración física: sin registros
Nota SOAP (hace 4 h, firmada): S: … | O: … | A: Sospecha de TEP en estudio, hemodinámicamente estable. | P: …
```

- Antes: `Sexo: F · Sangre: A_POS`, `Estado: inService`, `hr=119 lpm (2026-11-25T03:27:41.365Z; …)` y las 5 últimas alertas, que eran la misma.
- Para `evolucion` y `turno` se agrega la serie por hora, con su resumen calculado ("Resumen de la serie: sin cambios en 6 h").
- Los puntajes usan solo signos de la última hora. La PA de un solo número (`pa` del catálogo) no entra: no dice si es
  la sistólica. Hoy el NEWS2 siempre es parcial: faltan la PA, el oxígeno y, sin exploración, la conciencia.

### 6.3 Ajustes después de la primera medición

La primera medición con las mejoras de la sección 4 mostró varias cosas que el modelo seguía haciendo mal, y se
ajustaron antes de la medición final:

1. **Traducía mal el riesgo a gravedad** ("moderada" con riesgo alto). Ahora la gravedad sugerida va calculada en el
   contexto y la instrucción dice que la copie.
2. **Concluía "mejora" en una evolución sin cambios.** El resumen de la serie va calculado.
3. **En "¿qué tiene?" repetía el diagnóstico activo como diferencial y copiaba la medicación como manejo**; en manejo,
   tomaba la dosis profiláctica de enoxaparina como dosis de tratamiento y sugería un AINE a una paciente
   anticoagulada. Las instrucciones de análisis y de manejo lo dicen explícitamente.
4. **El análisis automático arrancaba en la pausa entre dos preguntas** del médico y retrasaba la siguiente: se
   cortaba (la prioridad funcionó, 8 cortes en el set), pero la siguiente esperaba a que el modelo terminara de leer
   el contexto. Ahora espera 20 s de calma después de la última consulta.

5. **Con la instrucción del tipo en el mensaje de sistema, Ollama ya no reutilizaba lo leído** entre dos preguntas
   seguidas del mismo paciente (la #14 tardó 9 s en empezar; antes, 0,5 s). Ahora el sistema es el mismo para todos los
   tipos y la instrucción va al final, después del contexto y la pregunta (`mensajesDe`). Un modelo chico, además,
   sigue mejor lo último que lee.

Además, una regla condicional ("si la gravedad es baja, di que está estable") hizo que escribiera "Está estable" a una
paciente de gravedad moderada: se quitó. Con un modelo de 4B, las instrucciones que funcionan son las incondicionales.

## 7. Antes y después (MedGemma 4B Q4_K_M, el modelo del servidor)

El mismo set de la sección 2, con el mismo modelo y la misma máquina, contra el backend de esta rama en su versión
final. Las respuestas completas están en `docs/ia-respuestas/respuestas-despues.md` (y en `despues-q4.json`). Los
tiempos son hasta el primer texto y hasta el final. Los signos cambian entre corridas, así que los valores citados
no son los mismos que antes.

| # | Paciente | Tipo | Tiempo antes | Tiempo después | Palabras | ¿Responde lo pedido? | Qué queda |
|---|---|---|---|---|---|---|---|
| 1 | 0002 | Gravedad | 38 / 73 s | 13 / 21 s | 188 → 54 | No → **Sí** | "Gravedad: alta · NEWS2 parcial 7", con SpO2 y FC y lo que falta |
| 2 | 0002 | Diferenciales | 50 / 62 s | 8 / 21 s | 44 → 78 | En parte → **Sí** | Cuatro enfermedades, TEP primero y con sus datos. Las otras tres, con poco sustento y lo dicen |
| 3 | 0002 | Manejo | 12 / 41 s | 9 / 27 s | 160 → 151 | En parte → En parte | Pasos numerados, sin AINE. **Errores:** "continuar enoxaparina 40 mg" como anticoagulación ante una TEP sospechada (es la dosis profiláctica) y "diurético si persiste el edema de la pantorrilla" |
| 4 | 0002 | Evolución | 5 / 11 s | 8 / 15 s | 19 → 35 | No → **Sí** | La serie por hora de cada signo y "sin cambios en 6 h" |
| 5 | 0002 | Dato | 4 / 6 s | 4 / 5 s | 9 → 8 | Sí → Sí | — |
| 6 | 0002 | Dosis | 13 / 29 s | 10 / 12 s | 79 → 23 | **No, peligrosa** → **Sí** | "La dosis depende del peso y la función renal; no están en el expediente". Vigilar sangrado |
| 7 | 0009 | Qué tiene | 16 / 54 s | 10 / 38 s | 205 → 173 | Sí → En parte | Las 6 secciones, con ecocardiograma y laboratorios bien elegidos. Pero las "banderas rojas" son las alertas copiadas, un diferencial vago ("hipoxemia por otras causas") y el manejo es seguir con lo indicado |
| 8 | 0009 | Estudios | 13 / 19 s | 7 / 15 s | 26 → 68 | Sí → Sí | Laboratorios, troponina y ecocardiograma, cada uno con su motivo |
| 9 | 0009 | Interacciones | 13 / 33 s | 8 / 16 s | 103 → 54 | En parte → En parte | Ya no llama IECA al losartán. **Error:** dice "no hay interacciones relevantes" para los tres y después advierte hipotensión con la furosemida: se contradice |
| 10 | 0009 | Turno | 48 / 75 s | 12 / 33 s | 138 → 168 | No → **Sí** | Las 5 viñetas de entrega: situación con el puntaje, cambios, tratamiento, pendientes y faltantes |
| 11 | 0009 | Dato | 39 / 40 s | 4 / 7 s | 8 → 24 | Sí → Sí | La lista de medicamentos. Ya no espera detrás del análisis automático |
| 12 | 0011 | Gravedad | 9 / 38 s | 8 / 21 s | 166 → 90 | No → **Sí** | "Gravedad: baja · NEWS2 parcial 0", con los cuatro signos |
| 13 | 0011 | Banderas rojas | 7 / 14 s | 2 / 17 s | 36 → 110 | No → En parte | Ya son signos y no la alergia ni los fármacos, pero casi todos genéricos. Del posoperatorio solo nombra la infección intraabdominal; faltan el dolor que aumenta, la ictericia y el sangrado |
| 14 | 0011 | Fármaco | 0,5 / 7 s | 7 / 11 s | 36 → 35 | Sí, con dato inventado → **Sí** | "No · alergia activa al tramadol". Sin el "Dr. Pérez" |
| 15 | 0011 | Dato | 1 / 3 s | 1 / 3 s | 14 → 12 | Sí → Sí | — |
| 16 | 0002 | Ideas | 28 s | 20 s | 38 → 50 | En parte → **Sí** | TEP con los datos reales del paciente. Una sola idea |
| 17 | 0009 | Ideas | 48 s | 18 s | 29 → 44 | En parte → En parte | Datos reales y dos ideas distintas, pero la segunda ("descompensación por el diurético") es dudosa |
| 18 | 0011 | Ideas | 16 s | 17 s | 15 → 37 | No → En parte | "Evolución posoperatoria" primero, bien. Después reacciones a la cefazolina y al tramadol que nada sostiene |

**En números** (las 15 consultas):

| | Antes | Después |
|---|---|---|
| Responden bien lo pedido | 6 | **11** |
| A medias | 5 | 4 |
| No responden lo pedido | 4 | **0** |
| Plantilla de 5 secciones cuando no se pedía | 6 | **0** |
| Datos inventados o copiados de los ejemplos (con las ideas) | 4 | **0** |
| Respuestas con errores clínicos claros | 3 (una peligrosa: la dosis) | 2 (el manejo de la TEP y las interacciones) |
| Tiempo total del set, con las ideas | 595 s | **319 s** (−46 %) |
| Palabras | 1.313 | 1.214 |

- **Lo que arreglaron el prompt y el contexto:**
  - la plantilla fuera de lugar y los datos copiados de los ejemplos;
  - los síntomas como diferenciales;
  - la gravedad sin respuesta, la evolución sin serie y el resumen de turno;
  - la dosis sin peso;
  - la espera detrás del análisis automático (#11: de 40 s a 7 s).
- **Lo que no se arregla con prompts:** el conocimiento fino. El manejo de la TEP, las interacciones y las banderas
  propias de una cirugía salen mal o genéricos. Varían de una corrida a otra (temperatura 0,2 y signos que cambian):
  en la segunda vuelta el manejo decía "mantener la profilaxis"; en la final, "continuar 40 mg" y un diurético por el
  edema de la pierna. Ninguna dosis inventada, pero el médico tiene que leerlo con criterio: el aviso de siempre sigue.
- **Tiempo:** el total baja casi a la mitad, sobre todo porque las respuestas son más cortas. Que el sistema sea el
  mismo para todos los tipos (6.3, punto 5) devolvió lo rápido de las preguntas seguidas del mismo paciente: la #13
  empezó a escribir a los 1,7 s y la #15 a los 1,3 s. En la segunda vuelta, con la instrucción en el sistema, tardaban
  8 y 3 s.

### 7.1 Las tres mediciones

| | Antes | Segunda vuelta (instrucción en el sistema) | Final (sistema fijo) |
|---|---|---|---|
| Responden bien / a medias / no | 6 / 5 / 4 | 10 / 5 / 0 | 11 / 4 / 0 |
| Plantilla fuera de lugar | 6 | 0 | 0 |
| Datos copiados o inventados | 4 | 0 | 0 |
| Tiempo total | 595 s | 340 s | 319 s |

La segunda vuelta está en `despues-q4-vuelta2.json`; es la que se compara con Q8 en la sección 8, porque las dos
corrieron con la misma versión del backend.

## 8. MedGemma 4B en Q8

Con las mejoras todavía quedaban errores clínicos, así que se probó MedGemma 4B en Q8_0, con el mismo set y la misma
versión del backend que la segunda vuelta de Q4 (respuestas lado a lado en `docs/ia-respuestas/respuestas-q8.md`).

- **Archivo:** en `hf.co/Mungert/medgemma-4b-it-GGUF`, la etiqueta `Q8_0` es ambigua: Ollama eligió
  `medgemma-4b-it-bf16_q8_0.gguf` (4,76 GB: pesos en Q8_0, embeddings y salida en bf16) y falló al registrarlo. Se
  registró a mano con la misma plantilla de chat que el Q4. El `q8_0` puro pesa 4,13 GB; la calidad debería ser la
  misma y la velocidad, apenas mejor.
- **Memoria cargada:** 6,8 GB contra 3,9 GB del Q4. En el servidor (22 GB) cabe igual.

| | Q4_K_M | Q8_0 |
|---|---|---|
| Responden bien / a medias / no (15 consultas) | 10 / 5 / 0 | 12 / 2 / 1 |
| Plantilla fuera de lugar / datos copiados | 0 / 0 | 0 / 0 |
| Tiempo total del set | 340 s | 449 s (+32 %) |
| Gravedad de DEMO-0002 | 18 s | 30 s |
| "¿Qué tiene?" de DEMO-0009 | 28 s | 49 s |
| Resumen de turno | 34 s | 49 s |

**Dónde fue mejor Q8:**
- "¿Qué tiene?" (#7): ecocardiograma, gases, ajustar la diuresis y oxígeno, en vez de "continuar el manejo indicado".
- La dosis de enoxaparina (#6): además del peso, pide vigilar el sangrado.

**Dónde fue igual o peor:**
- **Manejo de la TEP (#3), el mismo error:** "continuar enoxaparina 40 mg… mantenimiento de la anticoagulación en caso
  de TEP".
- **Banderas rojas del posoperatorio (#13), peor:** vuelve a poner la alergia al tramadol como bandera roja y "dolor
  leve en heridas → infección".
- **Interacciones (#9):** "no hay interacciones relevantes" para los tres, sin la hipotensión ni la función renal.
- **Ideas:** pone la fractura de fémur como hipótesis de DEMO-0002, repite la insuficiencia cardíaca en DEMO-0009 e
  inventa una "reacción alérgica a la cefazolina" en DEMO-0011.

**En el servidor:** la generación en CPU depende sobre todo de cuántos bytes del modelo hay que leer por token, así que
Q8 va de 1,5 a 1,7 veces más lento que Q4 en cualquier máquina. El servidor es ARM de 4 núcleos: si aquí una gravedad
tarda 18 s con Q4, allá serían de 1 a 2 minutos con Q4 y de 1,5 a 3 minutos con Q8. Un "¿qué tiene?" o un resumen de
turno con Q8 pasaría de los 3 minutos.

**Recomendación: seguir con Q4_K_M.** Q8 no corrige los errores que quedan (el de la TEP es idéntico), empeora otros
y cuesta un tercio más de tiempo, que en el servidor son minutos. Los errores que quedan son de conocimiento, y eso
lo cambia un modelo más grande, no la cuantización. Si se quiere probar, la tabla de la sección 5 sigue valiendo:
- un modelo de 7B o más (Qwen2.5 7B o Gemma 3 12B) solo para lo que no es urgente (resumen de turno, ideas a pedido);
- el de 4B para las consultas rápidas.
