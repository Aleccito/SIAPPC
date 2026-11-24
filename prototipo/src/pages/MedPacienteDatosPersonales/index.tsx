// Pantalla "med/paciente/datos-personales" (Figma node 191:17) — generada desde el diseño original de Figma.
// Identificación y contacto de emergencia salen de `paciente` (GET /patients/:id); peso y talla, de la
// exploración física; dirección, estado civil, ocupación y seguro no existen en el backend
// (src/api/sinBackend.ts, getDatosExtra).
import type { ReactNode } from 'react';
import { useExploracion } from '../../api/queries';
import { getDatosExtra, useExtra } from '../../api/sinBackend';
import { BackButton, Card, InfoField, PatientLayout, usePatient, type PatientView } from '../../components';
import { fmtDate } from '../../lib/clinical';
import { cn } from '../../lib/cn';

type Fields = Array<[string, string]>;

function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <Card className={cn('flex w-full min-w-0 flex-col gap-4', className)}>
      <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{title}</h2>
      {children}
    </Card>
  );
}

const FieldList = ({ fields, className }: { fields: Fields; className?: string }) => (
  <div className={cn('grid w-full', className)}>
    {fields.map(([label, value]) => (
      <InfoField key={label} label={label}>
        <span className="break-words">{value}</span>
      </InfoField>
    ))}
  </div>
);

/** Fila de dos tarjetas: la principal se estira y la lateral mide 380 px en pantallas anchas. */
const Row = ({ main, side }: { main: ReactNode; side: ReactNode }) => (
  <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
    <div className="flex w-full min-w-0 lg:flex-1">{main}</div>
    <div className="flex w-full min-w-0 lg:w-[380px] lg:shrink-0">{side}</div>
  </div>
);

const SEX: Record<string, string> = { M: 'Masculino', F: 'Femenino', O: 'Otro' };

/** IMC con un decimal y su categoría (truncado, como la exploración física). */
function bmi(weight: number | null, height: number | null) {
  if (!weight || !height) return '—';
  const v = Math.floor((weight / (height / 100) ** 2) * 10) / 10;
  const label = v < 18.5 ? 'Bajo peso' : v < 25 ? 'Normal' : v < 30 ? 'Sobrepeso' : 'Obesidad';
  return `${v.toFixed(1)} (${label})`;
}

/** "Familiar de prueba (555-0101)" → nombre y teléfono (así viene `contacto_emergencia` del seed). */
function splitContact(contact: string | null): { name: string; phone: string } {
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(contact ?? '');
  return m ? { name: m[1], phone: m[2] } : { name: contact ?? '—', phone: '—' };
}

export default function MedPacienteDatosPersonales() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica > Datos Personales`} title="Datos Personales y Demográficos" tab="historia" actions={<BackButton />}>
      {view && <Datos v={view} />}
    </PatientLayout>
  );
}

function Datos({ v }: { v: PatientView }) {
  const extra = useExtra('datos', v.cedula, getDatosExtra).data;
  const explo = useExploracion(v.id).data;
  const contact = splitContact(v.patient.emergencyContact);
  const dash = (x: string | undefined) => x ?? '—';

  const identification: Fields = [
    ['Nombre Completo', v.name],
    ['Cédula', v.cedula],
    ['ID Expediente', v.assigned?.record ? `EXP-${v.assigned.record.padStart(6, '0')}` : '—'],
    ['Fecha de Nacimiento', fmtDate(v.patient.birthDate)],
    ['Edad', v.age !== null ? `${v.age} años` : '—'],
    ['Sexo', SEX[v.patient.sex] ?? v.patient.sex],
  ];
  const physical: Fields = [
    ['Tipo Sangre', v.patient.bloodType ?? '—'],
    ['Peso', explo?.weightKg ? `${explo.weightKg} kg` : '—'],
    ['Talla', explo?.heightCm ? `${explo.heightCm} cm` : '—'],
    ['IMC', bmi(explo?.weightKg ?? null, explo?.heightCm ?? null)],
  ];
  const contactFields: Fields = [
    ['Teléfono', dash(extra?.telefono)],
    ['Email', dash(extra?.email)],
    ['Dirección', dash(extra?.direccion)],
    ['Ciudad', dash(extra?.ciudad)],
    ['Provincia', dash(extra?.provincia)],
    ['Código Postal', dash(extra?.codigoPostal)],
  ];
  const social: Fields = [
    ['Estado Civil', dash(extra?.estadoCivil)],
    ['Ocupación', dash(extra?.ocupacion)],
    ['Escolaridad', dash(extra?.escolaridad)],
    ['Religión', dash(extra?.religion)],
  ];
  const insurance: Fields = [
    ['Tipo de Seguro', dash(extra?.seguro.tipo)],
    ['Número de Póliza', dash(extra?.seguro.poliza)],
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      <Row
        main={
          <Section title="Identificación General">
            <FieldList fields={identification} className="gap-[10px] sm:grid-cols-2 lg:grid-cols-1" />
          </Section>
        }
        side={
          <Section title="Datos Físicos">
            <FieldList fields={physical} className="grid-cols-2 gap-[10px] lg:grid-cols-1" />
          </Section>
        }
      />

      <Row
        main={
          <Section title="Información de Contacto">
            <FieldList fields={contactFields} className="gap-[10px] sm:grid-cols-2 lg:grid-cols-1" />
          </Section>
        }
        side={
          <Section title="Contacto de Emergencia">
            <div className="flex w-full flex-col gap-3">
              <InfoField label="Nombre Completo">{contact.name}</InfoField>
              <div className="grid w-full grid-cols-2 gap-3">
                <InfoField label="Teléfono">{contact.phone}</InfoField>
                <InfoField label="Relación">{dash(extra?.emergencia.relacion)}</InfoField>
              </div>
            </div>
          </Section>
        }
      />

      <Row
        main={
          <Section title="Datos Sociales y Demográficos">
            {/* 4 columnas solo con la tarjeta ancha: a 1024 px no caben (REVISION.md, V10). */}
            <FieldList fields={social} className="grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" />
          </Section>
        }
        side={
          <Section title="Seguro Médico / Cobertura">
            <FieldList fields={insurance} className="grid-cols-2 gap-3" />
          </Section>
        }
      />

      {/* Pantalla de consulta: identificación, contacto y seguro los registra Admisión (REVISION.md, R4). */}
      <p className="w-full pb-5 pt-2 text-right font-jakarta text-[12px] font-medium leading-[normal] text-muted">
        Datos registrados por Admisión. Para corregirlos, solicítalo a Admisión.
      </p>
    </div>
  );
}
