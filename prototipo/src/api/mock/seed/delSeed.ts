// COPIADO TAL CUAL de backend/db/seed-demo.sql (pacientes DEMO-0001…0008). No editar a mano:
// lo genera un script que solo lee el SQL. Las fechas del seed son relativas (`NOW() - INTERVAL 20 HOUR`);
// aquí van como "horas/días atrás" y el simulador las vuelve fechas al cargar la página.
// Lecturas: una por minuto; la primera es de hace 40 min (2400 s) y la última, de "ahora".
// Alertas: `indice` es la lectura que la disparó. `notaSoap`: la nota firmada que el seed trae para cada paciente.
// Las camas incluyen las 19 del seed; `ocupadaPor` dice qué cédula la ocupa (DEMO-0009… no se cargan).
/* eslint-disable */
import type { SeedCama, SeedPaciente } from './tipos';

export const DEL_SEED_CAMAS: SeedCama[] = [
  {
    "codigo": "UCI-01",
    "unidad": "UCI",
    "tipo": "UCI",
    "ocupadaPor": "DEMO-0001"
  },
  {
    "codigo": "UCI-02",
    "unidad": "UCI",
    "tipo": "UCI",
    "ocupadaPor": "DEMO-0002"
  },
  {
    "codigo": "UCI-03",
    "unidad": "UCI",
    "tipo": "UCI",
    "ocupadaPor": "DEMO-0003"
  },
  {
    "codigo": "UCI-04",
    "unidad": "UCI",
    "tipo": "UCI",
    "ocupadaPor": "DEMO-0005"
  },
  {
    "codigo": "UCI-05",
    "unidad": "UCI",
    "tipo": "UCI",
    "ocupadaPor": "DEMO-0006"
  },
  {
    "codigo": "UCI-06",
    "unidad": "UCI",
    "tipo": "UCI",
    "ocupadaPor": null
  },
  {
    "codigo": "TR-01",
    "unidad": "Trauma",
    "tipo": "Trauma",
    "ocupadaPor": "DEMO-0004"
  },
  {
    "codigo": "TR-02",
    "unidad": "Trauma",
    "tipo": "Trauma",
    "ocupadaPor": "DEMO-0012"
  },
  {
    "codigo": "TR-03",
    "unidad": "Trauma",
    "tipo": "Trauma",
    "ocupadaPor": "DEMO-0013"
  },
  {
    "codigo": "TR-04",
    "unidad": "Trauma",
    "tipo": "Trauma",
    "ocupadaPor": null
  },
  {
    "codigo": "TR-05",
    "unidad": "Trauma",
    "tipo": "Trauma",
    "ocupadaPor": null
  },
  {
    "codigo": "P3-01",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": "DEMO-0007"
  },
  {
    "codigo": "P3-02",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": "DEMO-0008"
  },
  {
    "codigo": "P3-03",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": "DEMO-0009"
  },
  {
    "codigo": "P3-04",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": "DEMO-0010"
  },
  {
    "codigo": "P3-05",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": "DEMO-0011"
  },
  {
    "codigo": "P3-06",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": "DEMO-0014"
  },
  {
    "codigo": "P3-07",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": "DEMO-0015"
  },
  {
    "codigo": "P3-08",
    "unidad": "Piso 3",
    "tipo": "Hospitalización",
    "ocupadaPor": null
  }
];

export const DEL_SEED: Record<string, SeedPaciente> = {
  "DEMO-0001": {
    "cedula": "DEMO-0001",
    "nombre": "Rogelio Batista Quintero",
    "nacimiento": "1958-03-14",
    "sexo": "M",
    "sangre": "O+",
    "contacto": "Familiar de prueba (555-0101)",
    "estado": "inService",
    "motivo": "Fiebre alta, confusión y dolor lumbar de 3 días",
    "llegadaHorasAtras": 20,
    "expediente": {
      "observaciones": "Ingresa por cuadro séptico de probable foco urinario. Hipotenso al ingreso.",
      "aperturaHorasAtras": 20
    },
    "antecedentes": [
      {
        "tipo": "personal",
        "descripcion": "Diabetes mellitus tipo 2 desde hace 12 años",
        "parentesco": null,
        "anio": 2013
      },
      {
        "tipo": "personal",
        "descripcion": "Hipertensión arterial",
        "parentesco": null,
        "anio": 2008
      },
      {
        "tipo": "familiar",
        "descripcion": "Diabetes mellitus",
        "parentesco": "Madre",
        "anio": null
      }
    ],
    "alergias": [
      {
        "sustancia": "Penicilina",
        "reaccion": "Urticaria generalizada",
        "severidad": "moderada",
        "estado": "activa"
      }
    ],
    "medicamentos": [
      {
        "nombre": "Metformina",
        "dosis": "850 mg",
        "via": "oral",
        "frecuencia": "cada 12 h",
        "indicacion": "Diabetes tipo 2",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Enalapril",
        "dosis": "10 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Hipertensión",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Ceftriaxona",
        "dosis": "2 g",
        "via": "intravenosa",
        "frecuencia": "cada 24 h",
        "indicacion": "Cobertura empírica",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "N39.0",
        "descripcion": "Infección de vías urinarias complicada",
        "tipo": "presuntivo",
        "estado": "activo",
        "diasAtras": 0
      },
      {
        "cie10": "A41.9",
        "descripcion": "Sepsis, no especificada",
        "tipo": "diferencial",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Fiebre alta, confusión y dolor lumbar de 3 días",
      "horasAtras": 20,
      "cama": "UCI-01"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-01",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 20
    },
    "lecturas": {
      "hr": [100, 100, 99, 99, 99, 99, 98, 99, 100, 103, 103, 103, 104, 108, 106, 109, 111, 112, 111, 113, 116, 118, 118, 121, 121, 122, 124, 122, 125, 127, 127, 126, 127, 130, 129, 131, 130, 130, 133, 133, 132],
      "spo2": [94, 94, 95, 95, 94, 95, 95, 95, 94, 94, 94, 94, 94, 94, 93, 92, 93, 92, 92, 92, 92, 91, 91, 91, 90, 90, 90, 90, 89, 89, 89, 88, 89, 89, 88, 88, 88, 88, 88, 88, 88],
      "resp": [17, 19, 17, 18, 18, 18, 18, 20, 19, 20, 20, 20, 20, 20, 20, 22, 23, 22, 23, 24, 23, 25, 25, 25, 26, 26, 26, 26, 27, 27, 28, 27, 28, 28, 27, 28, 28, 28, 28, 29, 30]
    },
    "alertas": [
      { "variable": "hr", "indice": 23, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 121 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 24, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 121 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 25, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 122 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 26, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 124 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 27, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 122 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 28, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 125 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 29, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 127 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 30, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 127 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 31, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 126 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 32, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 127 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 33, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 130 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 34, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 129 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 35, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 131 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 36, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 130 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 37, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 130 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 38, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 133 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 39, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 133 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 40, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 132 bpm fuera de rango", "estado": "abierta" },
      { "variable": "spo2", "indice": 28, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 29, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 30, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 31, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 32, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 33, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 34, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 35, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 36, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 37, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 38, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 39, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 40, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" }
    ],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Fiebre de 39 °C, confusión y dolor lumbar desde hace 3 días; disuria previa.",
      "objetivo": "FC 118, PA 92/58, FR 24, T 39.2 °C. Puñopercusión derecha positiva. Desorientado en tiempo.",
      "analisis": "Probable sepsis de origen urinario (pielonefritis complicada) en diabético.",
      "plan": "Hemocultivos y urocultivo, lactato, cristaloides 30 ml/kg, ceftriaxona IV, control de glucemia y diuresis horaria.",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  },
  "DEMO-0002": {
    "cedula": "DEMO-0002",
    "nombre": "Ileana Montenegro Sáez",
    "nacimiento": "1971-09-02",
    "sexo": "F",
    "sangre": "A+",
    "contacto": "Familiar de prueba (555-0102)",
    "estado": "inService",
    "motivo": "Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera",
    "llegadaHorasAtras": 12,
    "expediente": {
      "observaciones": "Postoperatoria de reducción de fractura de cadera. Disnea de inicio súbito.",
      "aperturaHorasAtras": 12
    },
    "antecedentes": [
      {
        "tipo": "quirurgico",
        "descripcion": "Osteosíntesis de cadera derecha hace 5 días",
        "parentesco": null,
        "anio": 2026
      },
      {
        "tipo": "habito",
        "descripcion": "Tabaquismo, 10 cigarrillos al día",
        "parentesco": null,
        "anio": null
      }
    ],
    "alergias": [],
    "medicamentos": [
      {
        "nombre": "Enoxaparina",
        "dosis": "40 mg",
        "via": "subcutánea",
        "frecuencia": "cada 24 h",
        "indicacion": "Profilaxis tromboembólica",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Paracetamol",
        "dosis": "1 g",
        "via": "oral",
        "frecuencia": "cada 8 h",
        "indicacion": "Dolor",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "S72.0",
        "descripcion": "Fractura de cuello de fémur",
        "tipo": "definitivo",
        "estado": "activo",
        "diasAtras": 0
      },
      {
        "cie10": "I26.9",
        "descripcion": "Tromboembolia pulmonar",
        "tipo": "presuntivo",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera",
      "horasAtras": 12,
      "cama": "UCI-02"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-02",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 12
    },
    "lecturas": {
      "hr": [88, 88, 91, 92, 91, 94, 91, 93, 93, 95, 96, 98, 100, 101, 103, 103, 104, 106, 105, 109, 109, 111, 111, 112, 115, 116, 119, 119, 120, 120, 120, 123, 123, 126, 127, 124, 127, 126, 130, 128, 126],
      "spo2": [94, 94, 94, 93, 94, 93, 93, 93, 93, 92, 92, 92, 92, 92, 91, 90, 90, 90, 89, 88, 88, 89, 88, 87, 87, 87, 86, 85, 85, 85, 85, 85, 84, 84, 84, 83, 83, 83, 83, 83, 83],
      "resp": [16, 16, 17, 17, 16, 17, 17, 17, 17, 18, 18, 20, 19, 19, 20, 21, 21, 21, 22, 23, 23, 24, 24, 25, 25, 27, 27, 26, 26, 27, 28, 28, 29, 29, 30, 29, 31, 31, 31, 31, 31]
    },
    "alertas": [
      { "variable": "hr", "indice": 31, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 123 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 32, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 123 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 33, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 126 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 34, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 127 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 35, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 124 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 36, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 127 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 37, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 126 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 38, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 130 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 39, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 128 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 40, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 126 bpm fuera de rango", "estado": "abierta" },
      { "variable": "spo2", "indice": 18, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 19, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 20, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 21, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 22, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 23, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 24, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 25, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 26, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 86% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 27, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 28, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 29, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 30, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 31, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 32, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 84% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 33, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 84% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 34, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 84% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 35, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 83% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 36, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 83% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 37, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 83% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 38, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 83% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 39, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 83% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 40, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 83% crítico", "estado": "abierta" },
      { "variable": "resp", "indice": 36, "tipo": "resp_fuera_de_rango", "severidad": "alta", "mensaje": "Respiración estimada 31 rpm fuera de rango", "estado": "abierta" },
      { "variable": "resp", "indice": 37, "tipo": "resp_fuera_de_rango", "severidad": "alta", "mensaje": "Respiración estimada 31 rpm fuera de rango", "estado": "abierta" },
      { "variable": "resp", "indice": 38, "tipo": "resp_fuera_de_rango", "severidad": "alta", "mensaje": "Respiración estimada 31 rpm fuera de rango", "estado": "abierta" },
      { "variable": "resp", "indice": 39, "tipo": "resp_fuera_de_rango", "severidad": "alta", "mensaje": "Respiración estimada 31 rpm fuera de rango", "estado": "abierta" },
      { "variable": "resp", "indice": 40, "tipo": "resp_fuera_de_rango", "severidad": "alta", "mensaje": "Respiración estimada 31 rpm fuera de rango", "estado": "abierta" }
    ],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Disnea súbita y dolor pleurítico, 5 días tras artroplastia de cadera.",
      "objetivo": "FC 112, SpO2 89 % aire ambiente, FR 26. Pantorrilla izquierda edematizada.",
      "analisis": "Sospecha alta de tromboembolia pulmonar posoperatoria.",
      "plan": "Angio-TC de tórax, dímero D, oxígeno a SpO2 > 92 %, valorar anticoagulación según riesgo de sangrado.",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  },
  "DEMO-0003": {
    "cedula": "DEMO-0003",
    "nombre": "Anselmo Ruiz Cardoza",
    "nacimiento": "1953-11-27",
    "sexo": "M",
    "sangre": "B+",
    "contacto": "Familiar de prueba (555-0103)",
    "estado": "inService",
    "motivo": "Tos con expectoración purulenta y dificultad para respirar",
    "llegadaHorasAtras": 30,
    "expediente": {
      "observaciones": "Reagudización de enfermedad pulmonar crónica. Usa oxígeno suplementario.",
      "aperturaHorasAtras": 30
    },
    "antecedentes": [
      {
        "tipo": "personal",
        "descripcion": "EPOC diagnosticado hace 15 años",
        "parentesco": null,
        "anio": 2011
      },
      {
        "tipo": "habito",
        "descripcion": "Tabaquismo, 40 paquetes-año",
        "parentesco": null,
        "anio": null
      }
    ],
    "alergias": [
      {
        "sustancia": "Sulfonamidas",
        "reaccion": "Erupción cutánea",
        "severidad": "leve",
        "estado": "activa"
      }
    ],
    "medicamentos": [
      {
        "nombre": "Salbutamol",
        "dosis": "2 inhalaciones",
        "via": "inhalada",
        "frecuencia": "cada 6 h",
        "indicacion": "Broncodilatador",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Tiotropio",
        "dosis": "18 mcg",
        "via": "inhalada",
        "frecuencia": "cada 24 h",
        "indicacion": "EPOC",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Prednisona",
        "dosis": "40 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Reagudización",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "J44.1",
        "descripcion": "EPOC con exacerbación aguda",
        "tipo": "definitivo",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Tos con expectoración purulenta y dificultad para respirar",
      "horasAtras": 30,
      "cama": "UCI-03"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-03",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 30
    },
    "lecturas": {
      "hr": [100, 102, 101, 99, 100, 100, 102, 101, 100, 101, 101, 103, 101, 103, 104, 103, 105, 104, 106, 107, 107, 105, 106, 109, 107, 109, 110, 111, 110, 108, 109, 112, 111, 111, 113, 112, 111, 111, 114, 111, 114],
      "spo2": [90, 91, 90, 90, 90, 90, 89, 89, 89, 90, 89, 89, 89, 89, 88, 88, 89, 89, 88, 88, 87, 88, 87, 87, 86, 87, 86, 86, 87, 86, 85, 85, 86, 85, 85, 85, 85, 85, 84, 85, 85],
      "resp": [22, 22, 23, 22, 22, 22, 23, 23, 23, 23, 22, 24, 24, 24, 25, 23, 24, 25, 24, 25, 24, 26, 25, 26, 25, 26, 26, 26, 26, 28, 27, 28, 28, 28, 28, 28, 28, 28, 28, 29, 28]
    },
    "alertas": [
      { "variable": "spo2", "indice": 6, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 7, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 8, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 10, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 11, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 12, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 13, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 14, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 15, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 16, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 17, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 89% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 18, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 19, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "reconocida" },
      { "variable": "spo2", "indice": 20, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 21, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 88% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 22, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 23, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 24, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 86% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 25, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 26, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 86% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 27, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 86% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 28, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 87% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 29, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 86% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 30, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 31, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 32, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 86% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 33, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 34, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 35, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 36, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 37, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 38, "tipo": "spo2_bajo", "severidad": "critica", "mensaje": "SpO2 84% crítico", "estado": "abierta" },
      { "variable": "spo2", "indice": 39, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" },
      { "variable": "spo2", "indice": 40, "tipo": "spo2_bajo", "severidad": "alta", "mensaje": "SpO2 85% bajo", "estado": "abierta" }
    ],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Tos con esputo purulento y disnea progresiva; EPOC conocido.",
      "objetivo": "SpO2 86 %, FR 28, sibilancias difusas y uso de musculatura accesoria.",
      "analisis": "Exacerbación de EPOC de probable causa infecciosa.",
      "plan": "Gasometría, Rx de tórax, broncodilatadores nebulizados, prednisona, antibiótico y O2 controlado (meta 88–92 %).",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  },
  "DEMO-0004": {
    "cedula": "DEMO-0004",
    "nombre": "Darío Vallejo Pinto",
    "nacimiento": "1996-06-19",
    "sexo": "M",
    "sangre": "O-",
    "contacto": "Familiar de prueba (555-0104)",
    "estado": "inService",
    "motivo": "Accidente de motocicleta, dolor abdominal y deformidad de muslo",
    "llegadaHorasAtras": 3,
    "expediente": {
      "observaciones": "Politraumatizado. Abdomen doloroso a la palpación, fractura de fémur izquierdo.",
      "aperturaHorasAtras": 3
    },
    "antecedentes": [
      {
        "tipo": "personal",
        "descripcion": "Sin antecedentes patológicos conocidos",
        "parentesco": null,
        "anio": null
      }
    ],
    "alergias": [
      {
        "sustancia": "Látex",
        "reaccion": "Dermatitis de contacto",
        "severidad": "leve",
        "estado": "activa"
      }
    ],
    "medicamentos": [
      {
        "nombre": "Morfina",
        "dosis": "3 mg",
        "via": "intravenosa",
        "frecuencia": "según dolor",
        "indicacion": "Analgesia",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Ácido tranexámico",
        "dosis": "1 g",
        "via": "intravenosa",
        "frecuencia": "dosis única",
        "indicacion": "Control de sangrado",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "S36.9",
        "descripcion": "Traumatismo abdominal cerrado",
        "tipo": "presuntivo",
        "estado": "activo",
        "diasAtras": 0
      },
      {
        "cie10": "S72.9",
        "descripcion": "Fractura de fémur",
        "tipo": "definitivo",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Accidente de motocicleta, dolor abdominal y deformidad de muslo",
      "horasAtras": 3,
      "cama": "TR-01"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-04",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 3
    },
    "lecturas": {
      "hr": [100, 101, 100, 101, 99, 103, 102, 103, 106, 106, 108, 110, 112, 111, 113, 115, 119, 118, 121, 122, 122, 124, 127, 129, 133, 131, 136, 136, 139, 138, 141, 144, 143, 143, 147, 144, 148, 145, 148, 146, 149],
      "spo2": [96, 96, 96, 96, 96, 95, 95, 96, 95, 96, 95, 95, 94, 94, 94, 94, 94, 94, 94, 93, 93, 94, 93, 93, 93, 93, 92, 92, 92, 92, 92, 92, 92, 92, 91, 91, 92, 91, 90, 91, 91],
      "resp": [19, 20, 20, 20, 20, 21, 21, 20, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 23, 23, 22, 23, 23, 24, 24, 23, 24, 25, 24, 25, 25, 25, 25, 26, 25, 27, 25, 26, 26, 26, 27]
    },
    "alertas": [
      { "variable": "hr", "indice": 18, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 121 bpm fuera de rango", "estado": "reconocida" },
      { "variable": "hr", "indice": 19, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 122 bpm fuera de rango", "estado": "reconocida" },
      { "variable": "hr", "indice": 20, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 122 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 21, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 124 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 22, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 127 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 23, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 129 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 24, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 133 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 25, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 131 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 26, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 136 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 27, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 136 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 28, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 139 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 29, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 138 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 30, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 141 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 31, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 144 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 32, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 143 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 33, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 143 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 34, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 147 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 35, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 144 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 36, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 148 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 37, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 145 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 38, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 148 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 39, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 146 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 40, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 149 bpm fuera de rango crítico", "estado": "abierta" }
    ],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Accidente de motocicleta; dolor abdominal y en muslo derecho.",
      "objetivo": "FC 124, PA 98/60. Abdomen doloroso con defensa. Deformidad de fémur derecho.",
      "analisis": "Politraumatismo: posible lesión intraabdominal y fractura diafisaria de fémur.",
      "plan": "FAST, TC corporal, reserva de hemoderivados, inmovilización y valoración por cirugía y ortopedia.",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  },
  "DEMO-0005": {
    "cedula": "DEMO-0005",
    "nombre": "Yamileth Orozco Arce",
    "nacimiento": "1944-12-08",
    "sexo": "F",
    "sangre": "AB+",
    "contacto": "Familiar de prueba (555-0105)",
    "estado": "inService",
    "motivo": "Mareo, debilidad y casi desmayo",
    "llegadaHorasAtras": 9,
    "expediente": {
      "observaciones": "Adulta mayor con fibrilación auricular crónica en tratamiento con digoxina.",
      "aperturaHorasAtras": 9
    },
    "antecedentes": [
      {
        "tipo": "personal",
        "descripcion": "Fibrilación auricular crónica",
        "parentesco": null,
        "anio": 2015
      },
      {
        "tipo": "personal",
        "descripcion": "Insuficiencia cardíaca",
        "parentesco": null,
        "anio": 2019
      }
    ],
    "alergias": [
      {
        "sustancia": "Antiinflamatorios no esteroideos",
        "reaccion": "Broncoespasmo",
        "severidad": "moderada",
        "estado": "activa"
      }
    ],
    "medicamentos": [
      {
        "nombre": "Digoxina",
        "dosis": "0.25 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Control de frecuencia",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Bisoprolol",
        "dosis": "5 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Control de frecuencia",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Furosemida",
        "dosis": "40 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Insuficiencia cardíaca",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Warfarina",
        "dosis": "5 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Anticoagulación",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "R00.1",
        "descripcion": "Bradicardia, no especificada",
        "tipo": "presuntivo",
        "estado": "activo",
        "diasAtras": 0
      },
      {
        "cie10": "I48",
        "descripcion": "Fibrilación auricular",
        "tipo": "definitivo",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Mareo, debilidad y casi desmayo",
      "horasAtras": 9,
      "cama": "UCI-04"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-05",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 9
    },
    "lecturas": {
      "hr": [61, 61, 59, 58, 58, 60, 59, 60, 56, 58, 57, 54, 54, 53, 53, 52, 50, 50, 49, 50, 49, 47, 47, 44, 46, 42, 42, 43, 42, 39, 42, 39, 40, 37, 38, 39, 37, 38, 34, 38, 35],
      "spo2": [96, 96, 96, 95, 96, 96, 96, 96, 95, 96, 96, 95, 96, 96, 95, 94, 95, 95, 95, 95, 95, 94, 94, 93, 93, 93, 93, 93, 93, 93, 92, 92, 93, 92, 92, 92, 92, 92, 92, 92, 92],
      "resp": [15, 16, 15, 17, 16, 16, 17, 15, 16, 15, 16, 15, 15, 16, 16, 16, 16, 15, 15, 14, 15, 14, 15, 15, 15, 15, 14, 14, 14, 15, 14, 14, 14, 13, 14, 14, 14, 13, 15, 14, 14]
    },
    "alertas": [
      { "variable": "hr", "indice": 18, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 49 bpm fuera de rango", "estado": "reconocida" },
      { "variable": "hr", "indice": 20, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 49 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 21, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 47 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 22, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 47 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 23, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 44 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 24, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 46 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 25, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 42 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 26, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 42 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 27, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 43 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 28, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 42 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 29, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 39 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 30, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 42 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 31, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 39 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 32, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 40 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 33, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 37 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 34, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 38 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 35, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 39 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 36, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 37 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 37, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 38 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 38, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 34 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 39, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 38 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 40, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 35 bpm fuera de rango crítico", "estado": "abierta" }
    ],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Mareo, debilidad y casi síncope; anticoagulada con warfarina, toma digoxina.",
      "objetivo": "FC 42, ritmo irregular. PA 100/62. Sin focalidad neurológica.",
      "analisis": "Bradicardia sintomática; descartar intoxicación digitálica.",
      "plan": "ECG, digoxinemia, electrolitos, INR; suspender digoxina, monitor continuo, atropina disponible.",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  },
  "DEMO-0006": {
    "cedula": "DEMO-0006",
    "nombre": "Teodoro Lasso Mejía",
    "nacimiento": "1966-05-30",
    "sexo": "M",
    "sangre": "A-",
    "contacto": "Familiar de prueba (555-0106)",
    "estado": "inService",
    "motivo": "Palpitaciones y opresión en el pecho",
    "llegadaHorasAtras": 6,
    "expediente": {
      "observaciones": "Inicio brusco de palpitaciones durante esfuerzo. Sudoración fría.",
      "aperturaHorasAtras": 6
    },
    "antecedentes": [
      {
        "tipo": "personal",
        "descripcion": "Hipertensión arterial",
        "parentesco": null,
        "anio": 2014
      },
      {
        "tipo": "personal",
        "descripcion": "Dislipidemia",
        "parentesco": null,
        "anio": 2017
      },
      {
        "tipo": "familiar",
        "descripcion": "Infarto de miocardio a los 52 años",
        "parentesco": "Padre",
        "anio": null
      }
    ],
    "alergias": [],
    "medicamentos": [
      {
        "nombre": "Atorvastatina",
        "dosis": "40 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Dislipidemia",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Amlodipino",
        "dosis": "5 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Hipertensión",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Ácido acetilsalicílico",
        "dosis": "100 mg",
        "via": "oral",
        "frecuencia": "cada 24 h",
        "indicacion": "Prevención cardiovascular",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "I47.9",
        "descripcion": "Taquicardia paroxística",
        "tipo": "presuntivo",
        "estado": "activo",
        "diasAtras": 0
      },
      {
        "cie10": "R07.4",
        "descripcion": "Dolor torácico",
        "tipo": "diferencial",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Palpitaciones y opresión en el pecho",
      "horasAtras": 6,
      "cama": "UCI-05"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-06",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 6
    },
    "lecturas": {
      "hr": [89, 87, 89, 87, 91, 90, 93, 95, 94, 95, 100, 99, 103, 102, 107, 108, 112, 111, 116, 118, 120, 122, 124, 126, 128, 130, 133, 137, 136, 141, 143, 144, 144, 148, 148, 147, 152, 151, 153, 151, 150],
      "spo2": [96, 97, 97, 97, 96, 97, 96, 96, 96, 96, 96, 97, 96, 95, 96, 95, 96, 95, 95, 95, 94, 95, 95, 95, 95, 94, 94, 94, 94, 94, 94, 94, 93, 93, 93, 93, 93, 93, 93, 93, 93],
      "resp": [16, 16, 16, 16, 16, 15, 16, 16, 17, 17, 17, 16, 17, 17, 17, 18, 18, 19, 18, 19, 19, 19, 19, 20, 19, 19, 21, 20, 21, 21, 22, 20, 22, 21, 21, 21, 23, 22, 23, 21, 22]
    },
    "alertas": [
      { "variable": "hr", "indice": 21, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 122 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 22, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 124 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 23, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 126 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 24, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 128 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 25, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 130 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 26, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 133 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 27, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 137 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 28, "tipo": "hr_fuera_de_rango", "severidad": "alta", "mensaje": "Frecuencia cardiaca 136 bpm fuera de rango", "estado": "abierta" },
      { "variable": "hr", "indice": 29, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 141 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 30, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 143 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 31, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 144 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 32, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 144 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 33, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 148 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 34, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 148 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 35, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 147 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 36, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 152 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 37, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 151 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 38, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 153 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 39, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 151 bpm fuera de rango crítico", "estado": "abierta" },
      { "variable": "hr", "indice": 40, "tipo": "hr_fuera_de_rango", "severidad": "critica", "mensaje": "Frecuencia cardiaca 150 bpm fuera de rango crítico", "estado": "abierta" }
    ],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Palpitaciones y opresión torácica de 2 horas.",
      "objetivo": "FC 148 irregular, PA 128/80. Sin signos de insuficiencia cardíaca.",
      "analisis": "Fibrilación auricular con respuesta ventricular rápida; descartar SCA.",
      "plan": "ECG seriado, troponinas, control de frecuencia, valorar anticoagulación (CHA2DS2-VASc).",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  },
  "DEMO-0007": {
    "cedula": "DEMO-0007",
    "nombre": "Paloma Esquivel Núñez",
    "nacimiento": "1987-02-11",
    "sexo": "F",
    "sangre": "O+",
    "contacto": "Familiar de prueba (555-0107)",
    "estado": "inService",
    "motivo": "Fiebre y tos con dolor al respirar",
    "llegadaHorasAtras": 52,
    "expediente": {
      "observaciones": "Neumonía adquirida en la comunidad, en mejoría con antibiótico.",
      "aperturaHorasAtras": 52
    },
    "antecedentes": [
      {
        "tipo": "personal",
        "descripcion": "Asma leve en la infancia",
        "parentesco": null,
        "anio": null
      }
    ],
    "alergias": [
      {
        "sustancia": "Ibuprofeno",
        "reaccion": "Náuseas y erupción",
        "severidad": "leve",
        "estado": "activa"
      }
    ],
    "medicamentos": [
      {
        "nombre": "Amoxicilina con ácido clavulánico",
        "dosis": "875/125 mg",
        "via": "oral",
        "frecuencia": "cada 12 h",
        "indicacion": "Neumonía",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Paracetamol",
        "dosis": "500 mg",
        "via": "oral",
        "frecuencia": "cada 8 h",
        "indicacion": "Fiebre",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "J18.9",
        "descripcion": "Neumonía, no especificada",
        "tipo": "definitivo",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Fiebre y tos con dolor al respirar",
      "horasAtras": 52,
      "cama": "P3-01"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-07",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 52
    },
    "lecturas": {
      "hr": [95, 94, 94, 96, 97, 98, 94, 95, 94, 96, 94, 95, 95, 93, 92, 95, 95, 94, 93, 91, 91, 90, 92, 90, 90, 92, 89, 90, 90, 89, 90, 91, 87, 88, 88, 88, 88, 87, 89, 89, 88],
      "spo2": [92, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 92, 91, 92, 91, 92, 92, 92, 92, 92, 92, 91, 92, 93, 92, 93, 92, 92, 92, 93, 93, 93, 93, 93, 93, 93, 93, 92, 93, 93, 93],
      "resp": [25, 25, 24, 24, 25, 24, 23, 24, 23, 24, 24, 23, 24, 24, 23, 24, 23, 22, 23, 22, 22, 21, 22, 22, 22, 22, 21, 22, 22, 21, 21, 20, 21, 20, 20, 21, 20, 20, 20, 20, 19]
    },
    "alertas": [],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Fiebre y tos con dolor pleurítico de 4 días.",
      "objetivo": "T 38.6 °C, FR 22, SpO2 93 %. Crepitantes en base derecha.",
      "analisis": "Neumonía adquirida en la comunidad, CURB-65 bajo.",
      "plan": "Rx de tórax, hemograma, PCR, continuar amoxicilina/clavulánico, antipiréticos e hidratación.",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  },
  "DEMO-0008": {
    "cedula": "DEMO-0008",
    "nombre": "Cristian Barrios Tello",
    "nacimiento": "1979-08-23",
    "sexo": "M",
    "sangre": "B+",
    "contacto": "Familiar de prueba (555-0108)",
    "estado": "inService",
    "motivo": "Dolor abdominal intenso con vómitos",
    "llegadaHorasAtras": 40,
    "expediente": {
      "observaciones": "Pancreatitis aguda. Ayuno e hidratación intravenosa.",
      "aperturaHorasAtras": 40
    },
    "antecedentes": [
      {
        "tipo": "habito",
        "descripcion": "Consumo frecuente de alcohol",
        "parentesco": null,
        "anio": null
      },
      {
        "tipo": "quirurgico",
        "descripcion": "Apendicectomía",
        "parentesco": null,
        "anio": 2001
      }
    ],
    "alergias": [],
    "medicamentos": [
      {
        "nombre": "Tramadol",
        "dosis": "50 mg",
        "via": "intravenosa",
        "frecuencia": "cada 8 h",
        "indicacion": "Dolor",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Omeprazol",
        "dosis": "40 mg",
        "via": "intravenosa",
        "frecuencia": "cada 24 h",
        "indicacion": "Protección gástrica",
        "estado": "activo",
        "inicioDiasAtras": 1
      },
      {
        "nombre": "Solución Hartmann",
        "dosis": "125 mL/h",
        "via": "intravenosa",
        "frecuencia": "continua",
        "indicacion": "Hidratación",
        "estado": "activo",
        "inicioDiasAtras": 1
      }
    ],
    "diagnosticos": [
      {
        "cie10": "K85.9",
        "descripcion": "Pancreatitis aguda",
        "tipo": "definitivo",
        "estado": "activo",
        "diasAtras": 0
      }
    ],
    "ingreso": {
      "tipo": "urgencia",
      "estado": "activo",
      "motivo": "Dolor abdominal intenso con vómitos",
      "horasAtras": 40,
      "cama": "P3-02"
    },
    "dispositivo": {
      "codigo": "DEMO-DEV-08",
      "modelo": "Monitor de prueba",
      "microcontrolador": "simulado",
      "estado": "activo",
      "instaladoHorasAtras": 40
    },
    "lecturas": {
      "hr": [103, 103, 105, 104, 106, 104, 103, 103, 103, 106, 105, 106, 108, 107, 106, 105, 106, 106, 105, 109, 108, 108, 109, 109, 111, 110, 110, 112, 109, 109, 110, 109, 109, 113, 113, 110, 110, 110, 112, 113, 111],
      "spo2": [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 94, 96, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95],
      "resp": [20, 20, 19, 20, 20, 20, 21, 21, 21, 19, 21, 21, 21, 20, 20, 20, 21, 21, 22, 21, 22, 21, 20, 22, 20, 22, 21, 22, 23, 22, 21, 22, 23, 22, 21, 22, 23, 22, 23, 23, 23]
    },
    "alertas": [],
    "notaSoap": {
      "horasAtras": 2,
      "autor": "medico@institucion.org",
      "subjetivo": "Dolor abdominal intenso en epigastrio irradiado en cinturón, con vómitos.",
      "objetivo": "FC 110, abdomen distendido y doloroso, sin irritación peritoneal franca.",
      "analisis": "Probable pancreatitis aguda.",
      "plan": "Lipasa, perfil hepático, ecografía abdominal, hidratación IV, analgesia y ayuno inicial.",
      "estado": "firmada",
      "firmadaPor": "medico@institucion.org",
      "firmadaHorasAtras": 2
    }
  }
};
