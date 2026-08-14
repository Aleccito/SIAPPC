# SIAPPC — Propuesta: simulación en código como gemelo del modelo FlexSim

*Documento de trabajo. Versión 1.0 — agosto 2026.*
*Acompaña a `01_Plan_Migracion_SIAPPC.md` y `02_Migracion_Completa_ProcessFlow_a_PatientFlow.md`.*

---

## 1. Qué se propone y qué NO se propone

Se propone construir un **segundo modelo del mismo sistema, en código**, que
reproduzca bloque por bloque el Process Flow que ya existe en FlexSim.

**No se propone abandonar FlexSim.** FlexSim sigue siendo el modelo principal y
el entregable visual: la animación 3D, el layout del hospital y la presentación
ante el jurado o el hospital. El modelo en código cubre lo que FlexSim hace mal
o caro:

| Necesidad | FlexSim | Código |
|---|---|---|
| Mostrar el flujo a alguien | Excelente | Nulo |
| Layout, distancias, navegación A* | Nativo | Fuera de alcance |
| Correr 30 réplicas de 5 escenarios | Horas de clics | 85 segundos |
| Control de versiones de la lógica | Difícil | Un `git diff` |
| Rehacer un resultado de hace un mes | Depende de recordar la configuración | Semilla + hash |
| Detectar un error de implementación | Solo si se nota a ojo | Dos modelos que deben coincidir |

La razón de fondo es metodológica: **una sola implementación no se puede
verificar contra sí misma.** Si el modelo de FlexSim tiene un bloque mal
conectado, el propio FlexSim no lo va a decir. Dos implementaciones
independientes que dan el mismo resultado son evidencia de que la lógica está
bien; cuando difieren, el desacuerdo señala exactamente dónde mirar. Eso es
verificación en el sentido estricto del término, y es defendible por escrito.

---

## 2. Arquitectura

```
                    config/base.yaml
                (parámetros + su procedencia)
                            │
                   config/escenarios/*.yaml
                 (heredan y pisan lo que cambia)
                            │
                            ▼
              ┌──────────────────────────┐
              │  motor SimPy             │  espejo del Process Flow
              │  24 actividades          │  10 zonas · 7 decisiones
              └────────────┬─────────────┘
                           │  bitácora cruda
                           │  (eventos + ocupaciones + pacientes)
                           ▼
              ┌──────────────────────────┐
              │  cálculo de indicadores  │  utilización, colas, esperas
              └────────────┬─────────────┘
                           │
              ┌────────────┴─────────────┐
              ▼                          ▼
        MariaDB + vistas             CSV por escenario
        (Adminer, SQL)               (Excel, R)
```

**Decisión de diseño central:** el motor **no calcula ningún indicador mientras
corre**. Solo anota tres tiempos por paso: cuándo el paciente pidió la zona,
cuándo empezó a ser atendido y cuándo terminó. Todo lo demás se deriva después.

Esto no es un detalle de programación, es lo que hace el modelo defendible: un
indicador acumulado dentro del motor hay que creérselo, mientras que uno
calculado sobre la bitácora se puede recalcular en SQL y comprobar. De hecho el
proyecto incluye una vista, `v_utilizacion_sql`, que recalcula la utilización
directamente en SQL desde los datos crudos; hoy coincide con el cálculo de
Python hasta el decimal en las diez zonas.

### Herramientas

| Pieza | Elección | Por qué |
|---|---|---|
| Motor | Python + SimPy | Es la librería estándar de eventos discretos en Python; sus recursos con capacidad son el equivalente exacto de las Zonas de FlexSim |
| Configuración | YAML con procedencia | Permite exigir que cada número declare de dónde sale |
| Base de datos | MariaDB 11 | Lo pedido; el esquema es SQL estándar |
| Exploración | Adminer | Un contenedor de 5 MB, SQL directo, sin tableros que mantener |
| Empaquetado | Docker Compose | `docker compose up` y funciona en cualquier máquina del equipo |

---

## 3. Modelo de datos

```
escenario ──┬── parametro     (inventario con la fuente de cada número)
            └── corrida ──┬── paciente     (uno por paciente, con su desenlace)
                          ├── evento       (una fila por actividad)
                          ├── ocupacion    (una fila por zona tomada y soltada)
                          ├── kpi_corrida  (indicadores por réplica)
                          └── serie_zona   (ocupación y cola en el tiempo)
```

Dos observaciones que importan:

**`evento` y `ocupacion` son cosas distintas.** Un evento es una actividad
clínica ("C – Circulación"); una ocupación es el tiempo real durante el cual el
paciente retuvo un recurso. El tramo ATLS son seis eventos y **una sola**
ocupación de ZonaPersonalMedico. Calcular la utilización sumando eventos es un
error fácil de cometer y difícil de detectar — de hecho se cometió durante el
desarrollo de este modelo y solo se descubrió al comparar dos escenarios que
debían diferir y salían idénticos.

**`kpi_corrida` es larga y estrecha** (una fila por métrica, no una columna por
métrica). Así se pueden añadir indicadores nuevos sin migrar la base de datos, y
las vistas hacen el pivote.

Las vistas de análisis (`v_cuellos_botella`, `v_zonas`, `v_resumen_escenario`…)
se recrean en cada corrida desde `db/vistas.sql`, de modo que no pueden quedar
desfasadas respecto al código.

---

## 4. El flujo implementado

Transcrito del diagrama del modelo actual (FLOW.jpeg), sin cambios:

```
Llegada → Crear objeto → Asignar atributos (horaIngreso, glasgow, edad, estable)
→ Triaje → Traslado a shock room
→ [ZonaShockRoom] Shock Room
→ [ZonaPersonalMedico] X → A → B → C → D → E
→ DECIDIR ¿paciente estable?
   ├── sí  → [Laboratorio] → [Radiología] Rx → [Radiología] FAST → [TAC]
   │         → DECIDIR ¿requiere especialista? → Espera_Especialista
   │           → [Especialistas] Valoración
   └── no  → DECIDIR tipo de lesión crítica
             → una de {control hemorragias | lesión neurológica | trauma torácico}
→ DECIDIR ¿requiere cirugía? → Espera_Quirofano → [Quirófano] Cirugía
→ DECIDIR ¿requiere UCI?
   ├── no → ALTA DIRECTA
   └── sí → Traslado a UCI → [UCI] Estancia
            → DECIDIR desenlace UCI
               ├── muerte → MUERTE
               └── vive → [Hospitalización]
                          → DECIDIR ¿rehabilitación? → [Rehabilitación] → ALTA
```

24 actividades, 10 zonas con capacidad, 7 bloques Decidir, 3 salidas. Igual que
en FlexSim.

**Diferencia deliberada:** los bloques "Mover objeto" no se implementan. Son
representación 3D, no lógica: mueven la figura del paciente por el layout, no
consumen tiempo ni recursos. Incluirlos no cambiaría ningún resultado.

**Nota sobre el conteo:** los documentos del proyecto hablan de "21
actividades", pero la tabla del documento de migración enumera 24 filas
numeradas. El código implementa las 24. Conviene unificar el número en el
informe escrito para que no aparezca una inconsistencia en la defensa.

---

## 5. Lo que ya se aprendió de la primera corrida

30 réplicas × 90 días simulados × 5 escenarios. Los números son de un modelo
alimentado con supuestos, así que **lo que vale es el comportamiento, no las
cifras**.

### 5.1 Añadir especialistas no cambia absolutamente nada

| Escenario | Tiempo medio en el sistema | ¿Difiere del base? |
|---|---|---|
| base | 9 816 min | — |
| más especialistas (capacidad 2 → 4) | 9 816 min | no, ni un minuto |
| segundo TAC (capacidad 1 → 2) | 9 816 min | no |
| demanda alta (4 → 8 pacientes/día) | 19 776 min | sí, +101 % |

Esto **no** es un fallo del simulador: es la demostración cuantitativa del
problema que ya señalaba el documento de migración. `Espera_Especialista` es una
Demora ciega `uniform(15,60)`: el paciente espera entre 15 y 60 minutos aunque
haya diez especialistas libres, porque esa espera no está conectada a ningún
recurso. Lo mismo con `Espera_Quirofano`.

**Consecuencia directa:** tal como está hoy, el modelo **no puede evaluar** la
medida que la encuesta señala como más urgente. El item 33 identifica la espera
por especialista como la etapa con mayores demoras (3 de 6 respuestas), y el
modelo actual es estructuralmente incapaz de decir si contratar especialistas
ayudaría.

Migrar esas dos esperas a *Adquirir personal* / *Adquirir ubicación* contra un
recurso real deja de ser una mejora opcional: es lo que hace que el modelo
responda la pregunta para la que se construyó.

### 5.2 El hallazgo 5.1 tiene magnitud medida

Sosteniendo la camilla de shock room durante todo el tramo (evaluación primaria
e intervención crítica incluidas), en vez de soltarla justo después del bloque
Shock Room:

| | Utilización de ZonaShockRoom |
|---|---|
| Modelo actual | 0,51 % [IC 95 %: 0,50 – 0,53] |
| Sosteniendo la sala | 3,02 % [IC 95 %: 2,93 – 3,10] |

El modelo actual **subestima la ocupación del shock room en un factor de seis**.
Con la demanda base no cambia ningún otro resultado, porque la sala está casi
siempre vacía. Pero el error escala: si la demanda real es mayor que los 4
pacientes/día supuestos, o si se estudia un escenario de múltiples víctimas, la
cola de entrada al shock room sale mal calculada. Corregirlo es barato y quita
un flanco débil.

### 5.3 El TAC sale ocioso, y eso es un problema del alcance

El TAC queda al 5,9 % de utilización. La encuesta, en cambio, pone el segundo
equipo de TAC entre las medidas más prioritarias (item 38, 3 de 6; item 39
pregunta explícitamente por él).

La contradicción se explica sola: en el modelo, el único que usa el tomógrafo es
el politraumatizado rojo, unos 4 al día. En el hospital real ese mismo equipo
atiende a urgencias generales, ictus, hospitalizados y ambulatorios programados.

**Esto significa que hoy el modelo no puede pronunciarse sobre el TAC**, y
conviene decirlo así en el informe en lugar de presentar el 5,9 % como hallazgo.
Añadir una fuente de pacientes no-trauma que compita por TAC, quirófano y UCI es
la mejora que más acerca el modelo a la realidad — y el código está preparado
para ello, pero queda fuera del alcance acordado para esta primera entrega.

### 5.4 Bajo presión, cede la UCI

Duplicando las llegadas: la UCI llega al 98 % de utilización con cola máxima de
136 pacientes y esperas de más de 14 días, y los pacientes dentro del sistema al
terminar pasan de 31 a 201 — señal de que el sistema ya no es estable a esa
demanda. Rehabilitación la sigue de cerca (88,8 %).

Es el comportamiento que la literatura describe: en horizonte de días manda la
UCI, no el TAC. Sirve como verificación de que el modelo reacciona con sentido
clínico.

---

## 6. Honestidad sobre los datos

`siappc parametros` produce esta tabla:

| Fuente | Parámetros | % |
|---|---|---|
| supuesto | 22 | 44,0 |
| modelo_actual | 16 | 32,0 |
| encuesta | 7 | 14,0 |
| estimado | 5 | 10,0 |
| **dato_real** | **0** | **0,0** |

Ningún parámetro es todavía un dato medido en el Hospital Santo Tomás. Esto está
declarado en el propio archivo de configuración, se guarda en la base de datos y
la herramienta lo advierte en pantalla cada vez que se corre.

Es incómodo, y es exactamente por eso que conviene tenerlo a la vista: un modelo
que no distingue entre lo que sabe y lo que supuso termina presentando supuestos
como hallazgos. Lo que hoy se puede afirmar es **cómo se comporta el sistema
modelado**, no cuánto tarda de verdad un paciente.

Datos que hacen falta, en orden de cuánto cambian los resultados:

1. **Tasa de llegadas** de politraumatizados rojos, por día y por hora. Casi
   todo escala con este número.
2. **Distribución de rutas**: qué proporción llega estable, cuántos operan,
   cuántos ingresan a UCI, mortalidad en UCI.
3. **Estancias** de UCI, hospitalización y rehabilitación.
4. **Volumen de pacientes no-trauma** que compiten por TAC, quirófano y UCI.

Con 1, 2 y 3 el modelo pasa de comparar escenarios a estimar tiempos. Sin ellos,
sigue siendo útil, pero solo para lo primero.

---

## 7. Plan de validación cruzada FlexSim ↔ código

Es el uso principal del modelo en código y conviene hacerlo por etapas:

| Etapa | Qué se compara | Criterio |
|---|---|---|
| 1 | Número de pacientes generados en el mismo horizonte | ±5 % (el azar difiere) |
| 2 | Proporción por desenlace (alta directa / alta / muerte) | Dentro del IC 95 % del código |
| 3 | Reparto estable/inestable y por rama de lesión crítica | Dentro del IC 95 % |
| 4 | Tiempo medio en el sistema | Dentro del IC 95 % |
| 5 | Utilización de cada una de las 10 zonas | Dentro del IC 95 % |
| 6 | Espera media por zona | Dentro del IC 95 % |

Los dos modelos no van a dar cifras idénticas y no deben: usan generadores de
números aleatorios distintos. Lo que se compara son **medias con su intervalo de
confianza**. Si un valor de FlexSim cae fuera del intervalo del código, hay una
diferencia de implementación que vale la pena rastrear — y esa es justamente la
utilidad del ejercicio.

Sugerencia práctica: hacerlo por etapas y no todo al final. Si falla la etapa 3,
no tiene sentido discutir la 6.

---

## 8. Estado y siguiente paso

**Entregado y funcionando:**

- Modelo espejo completo de las 24 actividades, 10 zonas y 7 decisiones.
- `docker compose up` levanta MariaDB, corre 5 escenarios y deja Adminer listo.
- 11 vistas de análisis; los mismos datos también en CSV.
- 54 pruebas automáticas: capacidades, rutas, monotonía, ley de Little,
  reproducibilidad y coincidencia entre el cálculo en Python y el recálculo en
  SQL.
- Inventario de procedencia de cada parámetro, consultable en SQL.

**Siguiente paso propuesto, uno solo:**

Sustituir en el modelo en código las dos demoras ciegas (`Espera_Especialista` y
`Espera_Quirofano`) por adquisición de un recurso real, y volver a correr el
escenario `mas_especialistas`. Si ahí sí aparece una diferencia, tenemos el
argumento cuantificado para hacer el mismo cambio en FlexSim — que es la
recomendación central del documento de migración, ahora respaldada por un
experimento en vez de por un razonamiento.

Es un cambio de pocas líneas y responde la pregunta que la encuesta señala como
la más importante. Conviene hacerlo antes de tocar el 3D.
