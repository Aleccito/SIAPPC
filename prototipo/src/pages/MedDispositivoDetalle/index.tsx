// Pantalla nueva del paso 2: no viene de Figma. Detalle de un monitor de UCI; se llega
// desde "Ver Detalle" o la fila de un monitor en Dispositivos (?cama=C-06).
import { useSearchParams } from 'react-router-dom';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  CardHeader,
  InfoField,
  PageBody,
  Table,
  TableHead,
  TableRow,
} from '../../components';
import { calibrationsOf, deviceByBed, eventsOf, firmwareOf, lastSeenOf, STATUS_TONE } from '../../data/devices';
import { useDevices, type DeviceLive } from '../../data/useDevices';
import { cn } from '../../lib/cn';

// El médico ve el estado del equipo; calibraciones y fallas son de Ingeniería Biomédica y todavía no hay a dónde
// mandarlas (pedido 18), así que no hay botones para pedirlas.

const DOT = { danger: 'bg-danger', warning: 'bg-warning', success: 'bg-success', neutral: 'bg-subtle' } as const;

export default function MedDispositivoDetalle() {
  const [params] = useSearchParams();
  const cama = params.get('cama');
  // Con el backend, el monitor de esa cama en GET /dashboard/devices; sin él, el del seed (src/data/useDevices.ts).
  const { devices, isPending } = useDevices();
  const device: DeviceLive | undefined = devices.find((d) => d.bed === cama) ?? (isPending ? undefined : (devices[0] ?? deviceByBed(cama)));
  if (!device) {
    return (
      <AppLayout breadcrumb={`SIAPPC > Dispositivos > ${cama ?? '…'}`} title="Monitor" back="/MedDispositivosMonitores">
        <PageBody>
          <Card className="w-full font-jakarta text-[13px] text-muted">Cargando monitor…</Card>
        </PageBody>
      </AppLayout>
    );
  }
  return <Detalle device={device} />;
}

function Detalle({ device }: { device: DeviceLive }) {
  const free = !device.age;
  const low = device.battery < 20;


  const calibrations = calibrationsOf(device);
  const events = [
    ...eventsOf(device),
  ];

  return (
    <AppLayout
      breadcrumb={`SIAPPC > Dispositivos > ${device.bed}`}
      title={`Monitor ${device.model}`}
      back="/MedDispositivosMonitores"
    >
      <PageBody>
        <Card className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONE[device.status]} dot>
                {device.status}
              </Badge>
              <Badge tone="info">Cama {device.bed}</Badge>
              {device.calibrationDue && <Badge tone="warning">Calibración vencida</Badge>}
            </div>
            <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-muted">
              {free ? 'Cama disponible · sin paciente asignado' : `${device.patient} · ${device.age}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* "Solicitar calibración" y "Reportar falla" se quitaron: no le llegaban a nadie (pedido 18; docs/historial/REVISION-MEDICO.md, 6). */}
            {!free && device.cedula && <Button to={`/MedPacienteResumen?paciente=${device.cedula}`}>Ver paciente</Button>}
          </div>
        </Card>

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="flex flex-col gap-5 lg:col-span-2">
            <CardHeader title="Equipo" subtitle="Datos del monitor registrado en la central" />
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoField label="Modelo">{device.model}</InfoField>
              <InfoField label="Número de serie">{device.serial}</InfoField>
              <InfoField label="Cama">{`${device.bed} · ${device.unit ?? '—'}`}</InfoField>
              <InfoField label="Paciente">{free ? '—' : device.patient}</InfoField>
              <InfoField label="Firmware">{firmwareOf(device)}</InfoField>
              <InfoField label="Última conexión">{device.lastSeen ?? lastSeenOf(device)}</InfoField>
            </div>
          </Card>

          <Card className="flex flex-col gap-5">
            <CardHeader title="Batería y señales" />
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3 font-jakarta leading-[normal]">
                <p className="text-[12px] font-semibold uppercase text-muted">Batería</p>
                <p className={cn('text-[24px] font-extrabold', low ? 'text-danger' : 'text-ink')}>{device.battery}%</p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]" role="meter" aria-valuenow={device.battery} aria-valuemin={0} aria-valuemax={100} aria-label="Nivel de batería">
                <div className={cn('h-full rounded-full', low ? 'bg-danger' : 'bg-success')} style={{ width: `${device.battery}%` }} />
              </div>
              <p className="font-jakarta text-[12px] font-medium leading-[normal] text-muted">
                {low ? 'Conectar a la red eléctrica: autonomía menor a 30 min.' : 'Autonomía estimada: más de 4 h.'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-jakarta text-[12px] font-semibold uppercase leading-[normal] text-muted">Señales activas</p>
              <div className="flex flex-wrap gap-1.5">
                {device.signals.map((s) => (
                  <span key={s} className="rounded border border-line bg-surface px-2 py-1 font-jakarta text-[12px] font-semibold leading-[normal] text-muted">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <Card padding="none" className="overflow-hidden">
            <CardHeader title="Calibraciones" className="p-5" />
            <Table minWidth={420}>
              <TableHead>
                <p className="flex-1">Fecha</p>
                <p className="flex-1">Técnico</p>
                <p className="w-[100px] shrink-0 text-right">Resultado</p>
              </TableHead>
              {calibrations.map((c) => (
                <TableRow key={c.date} className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">
                  <p className="flex-1">{c.date}</p>
                  <p className="flex-1 font-medium text-muted">{c.tech}</p>
                  <div className="flex w-[100px] shrink-0 justify-end">
                    <Badge tone={c.result === 'Aprobada' ? 'success' : c.result === 'Vencida' ? 'warning' : 'info'} size="sm">
                      {c.result}
                    </Badge>
                  </div>
                </TableRow>
              ))}
            </Table>
          </Card>

          <Card className="flex flex-col gap-4">
            <CardHeader title="Eventos recientes" />
            <ul className="flex flex-col">
              {events.map((e, i) => (
                <li key={`${e.time}-${i}`} className="flex gap-3 border-b border-line py-3 last:border-b-0">
                  <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', DOT[e.tone])} aria-hidden="true" />
                  <div className="flex min-w-0 flex-col gap-1 font-jakarta leading-[normal]">
                    <p className="text-[13px] font-semibold text-ink">{e.text}</p>
                    <p className="text-[12px] font-medium text-muted">{e.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </PageBody>

    </AppLayout>
  );
}
