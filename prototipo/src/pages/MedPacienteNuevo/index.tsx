// Pantalla nueva del paso 2: no viene de Figma. Registro de un paciente nuevo; se llega
// desde "Nuevo Paciente" en Gestión de Pacientes. Los datos no se guardan (prototipo).
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout, BackButton, Button, Card, CardHeader, Input, PageBody, Select, TextArea, useToast } from '../../components';

const SEXES = ['Femenino', 'Masculino'];
const BLOOD = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const UNITS = ['UCI', 'Urgencias', 'Hospitalización'];
const BEDS = ['C-07 (UCI, disponible)', 'U-04 (Urgencias, disponible)', 'H-12 (Hospitalización, disponible)'];
const DOCTORS = ['Dr. Alejandro Ruiz', 'Dra. Carmen Vega', 'Dr. Luis Herrera'];
const RELATIONS = ['Cónyuge', 'Hijo(a)', 'Padre / Madre', 'Hermano(a)', 'Otro'];

const LIST_PATH = '/MedPacientesLista';

export default function MedPacienteNuevo() {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState(SEXES[0]);
  const [blood, setBlood] = useState(BLOOD[0]);
  const [unit, setUnit] = useState(UNITS[0]);
  const [bed, setBed] = useState(BEDS[0]);
  const [doctor, setDoctor] = useState(DOCTORS[0]);
  const [relation, setRelation] = useState(RELATIONS[0]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const full = `${name} ${lastName}`.trim();
    toast(full ? `Paciente registrado · ${full}` : 'Paciente registrado');
    navigate(LIST_PATH);
  };

  return (
    <AppLayout breadcrumb="SIAPPC > Pacientes > Nuevo" title="Registro de Paciente" actions={<BackButton to={LIST_PATH}>Volver a Pacientes</BackButton>}>
      <form onSubmit={submit} className="contents">
        <PageBody>
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="flex flex-col gap-5">
              <CardHeader title="Identificación" subtitle="Datos del paciente" />
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <Input id="nombre" label="Nombre(s)" placeholder="Ej. María" value={name} onChange={(e) => setName(e.target.value)} />
                <Input id="apellidos" label="Apellidos" placeholder="Ej. González Pérez" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <Input id="cedula" label="Cédula o documento" placeholder="Ej. 8-123-4567" />
                <Input id="nacimiento" label="Fecha de nacimiento" type="date" />
                <Select variant="input-plain" fieldLabel="Sexo" options={SEXES} value={sex} onChange={setSex} />
                <Select variant="input-plain" fieldLabel="Tipo de sangre" options={BLOOD} value={blood} onChange={setBlood} />
              </div>
            </Card>

            <Card className="flex flex-col gap-5">
              <CardHeader title="Ingreso" subtitle="Unidad, cama y médico responsable" />
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <Select variant="input-plain" fieldLabel="Unidad" options={UNITS} value={unit} onChange={setUnit} />
                <Select variant="input-plain" fieldLabel="Cama" options={BEDS} value={bed} onChange={setBed} />
                <div className="sm:col-span-2">
                  <Select variant="input-plain" fieldLabel="Médico tratante" options={DOCTORS} value={doctor} onChange={setDoctor} />
                </div>
                <div className="sm:col-span-2">
                  <TextArea id="motivo" label="Motivo de ingreso" rows={3} placeholder="Ej. Insuficiencia respiratoria aguda" />
                </div>
              </div>
            </Card>

            <Card className="flex flex-col gap-5 lg:col-span-2">
              <CardHeader title="Contacto" subtitle="Teléfono del paciente y contacto de emergencia" />
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Input id="telefono" label="Teléfono" type="tel" placeholder="Ej. 6123-4567" />
                <Input id="emergencia" label="Contacto de emergencia" placeholder="Nombre completo" />
                <Select variant="input-plain" fieldLabel="Parentesco" options={RELATIONS} value={relation} onChange={setRelation} />
                <Input id="telefono-emergencia" label="Teléfono de emergencia" type="tel" placeholder="Ej. 6987-6543" />
              </div>
            </Card>
          </div>

          <div className="flex w-full flex-wrap justify-end gap-3">
            <Button variant="secondary" to={LIST_PATH}>
              Cancelar
            </Button>
            <Button type="submit">Registrar paciente</Button>
          </div>
        </PageBody>
      </form>
    </AppLayout>
  );
}
