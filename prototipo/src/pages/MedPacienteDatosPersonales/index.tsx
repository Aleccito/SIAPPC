// Pantalla "med/paciente/datos-personales" (Figma node 191:17) — generada desde el diseño original de Figma.
import type { ReactNode } from 'react';
import { BackButton, Card, InfoField, PatientLayout } from '../../components';
import { cn } from '../../lib/cn';

type Fields = Array<[string, string]>;

const IDENTIFICATION: Fields = [
  ['Nombre Completo', 'María González'],
  ['CURP', 'GOMM580315MDFRNS09'],
  ['ID Expediente', 'PT-8821'],
  ['Fecha de Nacimiento', '15 Mar 1958'],
  ['Edad', '67 años'],
  ['Sexo', 'Femenino'],
];

const PHYSICAL: Fields = [
  ['Tipo Sangre', 'O+'],
  ['Peso', '68 kg'],
  ['Talla', '165 cm'],
  ['IMC', '24.9 (Normal)'],
];

const CONTACT: Fields = [
  ['Teléfono', '(555) 019-2834'],
  ['Email', 'maria.gonzalez@email.com'],
  ['Dirección', 'Av. Universidad 1024, Int 4'],
  ['Ciudad', 'Ciudad de México'],
  ['Estado', 'CDMX'],
  ['Código Postal', '03100'],
];

const SOCIAL: Fields = [
  ['Estado Civil', 'Casada'],
  ['Ocupación', 'Jubilada'],
  ['Escolaridad', 'Licenciatura'],
  ['Religión', 'Católica'],
];

const INSURANCE: Fields = [
  ['Tipo de Seguro', 'IMSS'],
  ['Número de Póliza', '992-81-5803'],
];

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

export default function MedPacienteDatosPersonales() {
  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Datos Personales"
      title="Datos Personales y Demográficos"
      tab="historia"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col gap-4">
        <Row
          main={
          <Section title="Identificación General">
            <FieldList fields={IDENTIFICATION} className="gap-[10px] sm:grid-cols-2 lg:grid-cols-1" />
          </Section>
          }
          side={
          <Section title="Datos Físicos">
            <FieldList fields={PHYSICAL} className="grid-cols-2 gap-[10px] lg:grid-cols-1" />
          </Section>
          }
        />

        <Row
          main={
          <Section title="Información de Contacto">
            <FieldList fields={CONTACT} className="gap-[10px] sm:grid-cols-2 lg:grid-cols-1" />
          </Section>
          }
          side={
          <Section title="Contacto de Emergencia">
            <div className="flex w-full flex-col gap-3">
              <InfoField label="Nombre Completo">Roberto González (Hijo)</InfoField>
              <div className="grid w-full grid-cols-2 gap-3">
                <InfoField label="Teléfono">(555) 044-9821</InfoField>
                <InfoField label="Relación">Hijo</InfoField>
              </div>
            </div>
          </Section>
          }
        />

        <Row
          main={
          <Section title="Datos Sociales y Demográficos">
            {/* 4 columnas solo con la tarjeta ancha: a 1024 px no caben (REVISION.md, V10). */}
            <FieldList fields={SOCIAL} className="grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" />
          </Section>
          }
          side={
          <Section title="Seguro Médico / Cobertura">
            <FieldList fields={INSURANCE} className="grid-cols-2 gap-3" />
          </Section>
          }
        />

        {/* Pantalla de consulta: identificación, contacto y seguro los registra Admisión (REVISION.md, R4). */}
        <p className="w-full pb-5 pt-2 text-right font-jakarta text-[12px] font-medium leading-[normal] text-muted">
          Datos registrados por Admisión. Para corregirlos, solicítalo a Admisión.
        </p>
      </div>
    </PatientLayout>
  );
}
