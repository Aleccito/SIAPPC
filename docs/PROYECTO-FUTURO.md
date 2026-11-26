# SIAPPC — Proyecto futuro

Hoja de ruta para seguir mejorando SIAPPC después de la entrega actual. No es trabajo comprometido: es la lista
ordenada de lo que conviene hacer, con el porqué de cada cosa, para retomarla como proyecto aparte.

Escrito en noviembre de 2026.

## Dónde estamos

| Pieza | Hoy |
|---|---|
| Backend | Node 24, Fastify, Prisma, MariaDB 11.4, Redis, Mosquitto (MQTT con TLS) y un ETL con agregados por hora y día |
| App principal (`frontend/`) | React + MUI + React Query, en siappc.melo-coton.uk |
| Prototipo (`prototipo/`) | React + Tailwind + React Query, conectado al backend real, en prototipo.melo-coton.uk |
| IA clínica | MedGemma 4B (Q4_K_M) en Ollama, en el procesador del servidor: de 20 s a más de un minuto por respuesta |
| Monitores | 15 monitores de demo más 5 libres, simulados por el publicador de demo; los sensores reales (Raspberry) van aparte |
| Servidor | Oracle Cloud ARM (4 núcleos, 22 GB, sin GPU), Docker Compose, túnel de Cloudflare y despliegue automático con GitHub Actions |

Principios que se mantienen en todo lo que sigue:

- Los datos de los pacientes no salen del hospital, tampoco hacia servicios de IA externos.
- Todo cambio entra por PR con revisión, y lo que toca datos se mide antes y después.
- La IA apoya al médico; no decide ni escribe en el expediente sin que él lo revise y firme.

## 1. Una sola app

Hoy hay dos interfaces sobre el mismo backend. La meta es que el prototipo reemplace a `frontend/`.

- Falta en el prototipo lo que `frontend/` ya hace: Admisión (camas, ingresos, egresos y citas), la ronda en tablet,
  la bandeja de sensores y la administración (usuarios, roles, permisos y bitácora), que está haciendo otra
  persona del equipo.
- Pantallas propias para enfermería y administrativo, diseñadas primero en Figma.
- Plan de corte: cuando el prototipo cubra todo, el servicio `frontend` del Compose pasa a construir `prototipo/`
  en el mismo puerto, y `frontend/` se borra en un PR aparte.

## 2. IA clínica

**Corto plazo**

- Terminar el tipo de pregunta "pronóstico": formato de "Lo que más pesa" y que el prototipo muestre bien el tipo
  de respuesta ([REVISION-DETALLES.md](../prototipo/docs/historial/REVISION-DETALLES.md), A5).
- Convertir el set de prueba de la IA (las 15 preguntas más las de pronóstico) en una prueba permanente, con
  criterios de "bien / a medias / mal", para que ningún cambio de prompt empeore las respuestas sin que se note.
- Que el médico pueda calificar cada respuesta (útil / no útil, con un comentario) para juntar casos reales.
- Registrar en la auditoría quién consultó a la IA y sobre qué paciente.

**Mediano plazo**

- Responder con fuentes: guías clínicas de referencia (por ejemplo, de TEP, sepsis o neumonía) indexadas en el
  propio servidor (RAG), para que cada sugerencia cite de dónde sale.
- Reglas deterministas para lo que no puede fallar: dosis según peso y función renal, alergias e interacciones
  revisadas contra una base de medicamentos y no solo por el modelo.
- Salidas estructuradas (JSON validado) para las ideas automáticas, en vez de texto libre que hay que interpretar.

**Largo plazo**

- Un equipo con GPU dentro del hospital para correr modelos más grandes con tiempos de segundos, manteniendo los
  datos en casa. Con el servidor actual (ARM sin GPU) el techo práctico es un modelo de unos 4B.
- Validación con médicos del servicio antes de usar la IA fuera de un entorno de prueba, y documentar sus límites.

## 3. Datos y base de datos

- **Lecturas de signos vitales.** Con 15 monitores de demo la base sumó casi 100 000 lecturas en dos días. Con
  monitores reales y onda de ECG esto crece rápido. Opciones, de menos a más trabajo:
  1. Seguir en MariaDB, con particiones por fecha en `lectura` y una retención clara (el ETL ya agrega por hora).
  2. Migrar solo las lecturas a una base de series de tiempo (por ejemplo, TimescaleDB).
  3. Migrar toda la base a PostgreSQL con TimescaleDB: un solo motor, mejor soporte para datos JSON y series de
     tiempo. Requiere migrar el esquema de Prisma, los procedimientos y vistas del ETL, y una ventana de corte
     probada antes en una copia.
  Antes de elegir, medir con una carga parecida a la real (las pruebas de JMeter de `Pruebas/` sirven de base).
- **Migraciones automáticas.** Hoy los parches de la base se corren a mano en el servidor. Que el despliegue aplique
  las migraciones de Prisma y avise si falla.
- **Respaldos** automáticos, con una restauración probada de forma periódica.
- **Modelo de datos pendiente:** presión arterial como dato real (hoy es un número por lectura y la PA es un par),
  umbrales por paciente, atender las alertas desde la API (el estado ya existe en la base: abierta, reconocida y
  resuelta, pero ninguna ruta lo cambia), agrupación y espera para no repetir la misma alerta cada minuto, y la
  fecha de la alerta igual a la hora de la lectura.
- **Interoperabilidad:** exponer los datos principales en HL7 FHIR (paciente, observaciones, diagnósticos,
  alergias, ingresos) para conectarse con otros sistemas del hospital, y el catálogo CIE-10 completo.

## 4. Seguridad y cumplimiento

- MFA real (por ejemplo, con app de códigos) y recuperación de contraseña por correo. Hoy el prototipo pide un
  código fijo de prueba.
- Antes de cualquier uso real: cambiar o quitar las contraseñas de demo que están en el README y en el seed.
- Secretos fuera del `.env` plano (Docker secrets o un gestor de secretos), con rotación.
- Límite de peticiones por usuario además de por IP, y la IP real del visitante en todos los nginx (ya está en el
  prototipo y en la app principal).
- Cifrado de la base en reposo y registro de quién lee cada expediente.
- Revisar el cumplimiento de la Ley 81 de 2019 de protección de datos personales de Panamá, que trata los datos de
  salud como datos sensibles.

## 5. Monitores e IoT

- Monitores reales con la Raspberry (sensor MAX30102 en curso), y después presión arterial y temperatura.
- Un certificado propio por equipo (mTLS) y un alta de dispositivos desde la administración, en vez de los datos de
  demo.
- Estado real de cada equipo: batería, calibración y última señal (hoy parte es simulada).
- Un solo publicador de demo: hoy hay dos copias (`tools/telemetria-demo/` y `prototipo/tools/telemetria-demo/`).
  Unificarlas en una, la versión que detecta los monitores asignados.

## 6. Herramientas e infraestructura

- **Entornos separados.** Hoy la misma base sirve de demo y de prueba para todo el equipo. Un entorno de staging
  con su propia base, y producción aparte.
- **Imágenes versionadas.** CI ya construye las imágenes del backend y del frontend, pero no las publica y no
  construye la del prototipo. Publicarlas en un registro (por ejemplo, GHCR), en vez de construir en el servidor;
  así se puede volver a una versión anterior en minutos.
- **Pruebas en CI.** CI ya corre las pruebas del backend con base (MariaDB y Redis), las de la API con Newman y el
  lint y el build del frontend. Falta el prototipo: su build, su imagen, pruebas de interacción (Playwright) y
  capturas comparadas, en cada PR.
- **Dependencias y seguridad.** CI ya revisa que no haya `.env` ni claves versionadas y corre `npm audit`. Faltan
  actualizaciones automáticas (Dependabot o Renovate) y un escáner de secretos.
- **Observabilidad:** métricas y paneles (Prometheus y Grafana), logs centralizados y aviso cuando un servicio se
  cae.
- **Documentación:** un README por carpeta, y un registro corto de decisiones (por qué Tailwind, por qué MariaDB o
  PostgreSQL, por qué IA local).

## 7. Producto

- Reportes clínicos reales generados por el backend, entrega de turno guardada en el backend y "atender alerta" que
  quede registrada para todo el equipo (hoy parte de esto vive solo en el navegador).
- Notificaciones push de alertas críticas y una versión instalable (PWA) para la ronda en tablet o celular.
- Accesibilidad (WCAG AA) y un modo oscuro para la central de monitoreo.
- Idiomas: hoy las dos apps están en español; el prototipo tiene inglés y alemán solo en las pantallas de acceso.
  Llevar EN y DE a toda la app.

## Orden sugerido

| Fase | Qué | Por qué primero |
|---|---|---|
| Corto (1–2 meses) | Terminar la IA de pronóstico, prueba permanente de la IA, respaldos, migraciones automáticas, unificar el publicador, atender y agrupar las alertas | Arregla lo que hoy molesta en las demos y protege los datos |
| Mediano (3–6 meses) | Una sola app, pantallas de enfermería y administrativo, staging, imágenes versionadas, pruebas en CI, MFA real, decidir el futuro de la base con mediciones | Deja una base estable para crecer |
| Largo (6+ meses) | Monitores reales, FHIR, GPU para la IA con RAG, cumplimiento de protección de datos, observabilidad completa | Lo que hace falta para un uso real en el hospital |

## Riesgos conocidos

- Un modelo de 4B tiene límites de conocimiento clínico que los prompts no corrigen del todo.
- El servidor actual no tiene GPU: la IA no puede ser mucho más rápida ni más grande sin otro equipo.
- La base de demo es compartida por las dos apps y por todo el equipo.
- Las credenciales de demo son públicas en el repositorio.
