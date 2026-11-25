// Pantalla "med/paciente/config-umbrales" (Figma node 140:259): Umbrales de alarma.
// De solo lectura con los umbrales REALES del sistema (backend/src/services/mqttIngest.ts, src/lib/alerts.ts), que son
// los mismos para todos los pacientes. Antes se podían editar y guardar en el navegador, pero eso no cambiaba cuándo
// suena una alerta: engañaba (REVISION-MEDICO.md, 5.4 y 6). Editar por paciente depende del pedido 8.
import imgActivity7 from '../../assets/activity-7.svg';
import imgHeart5 from '../../assets/heart-5.svg';
import imgThermometer from '../../assets/thermometer.svg';
import imgTrendingUp from '../../assets/trending-up.svg';
import imgWind from '../../assets/wind.svg';
import { AppLink, BackButton, Card, PatientLayout, Table, usePatient } from '../../components';
import { UMBRALES_SISTEMA } from '../../lib/alerts';
import { cn } from '../../lib/cn';

const ICONO: Record<string, string> = { hr: imgHeart5, spo2: imgActivity7, resp: imgWind, temp: imgThermometer, pa: imgTrendingUp };

export default function MedPacienteConfigUmbrales() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Umbrales`} title="Umbrales de Alarma" tab="monitoreo" actions={<BackButton />}>
      {view && (
        <div className="flex w-full flex-col gap-5">
          <Card className="flex w-full flex-col gap-2">
            <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Umbrales del sistema</h2>
            <p className="font-jakarta text-[13px] font-normal leading-[1.5] text-muted">
              {`Son los que usa el sistema para crear las alertas de ${view.name} y de todos los pacientes: cada lectura fuera de estos rangos genera una alerta. Todavía no se pueden ajustar por paciente.`}
            </p>
          </Card>
          <Card padding="none" className="w-full overflow-hidden">
            <Table minWidth={720}>
              <div className="flex w-full gap-3 border-b border-line bg-surface px-5 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
                <p className="w-[200px] shrink-0">Signo</p>
                <p className="w-[190px] shrink-0">Alerta alta</p>
                <p className="w-[190px] shrink-0">Alerta crítica</p>
                <p className="min-w-[120px] flex-1">Nota</p>
              </div>
              {UMBRALES_SISTEMA.map((u) => (
                <div key={u.signo} className="flex w-full items-center gap-3 border-b border-line px-5 py-4 font-jakarta text-[13px] leading-[normal] last:border-b-0">
                  <div className="flex w-[200px] shrink-0 items-center gap-2">
                    <img className="size-4 shrink-0" alt="" src={ICONO[u.signo]} />
                    <p className="font-bold text-ink">{u.nombre}</p>
                  </div>
                  <p className={cn('w-[190px] shrink-0', u.alta ? 'font-semibold text-[#b45309]' : 'text-muted')}>{u.alta ?? '—'}</p>
                  <p className={cn('w-[190px] shrink-0', u.critica ? 'font-semibold text-danger' : 'text-muted')}>{u.critica ?? '—'}</p>
                  <p className="min-w-[120px] flex-1 text-muted">{u.nota}</p>
                </div>
              ))}
            </Table>
          </Card>
          <AppLink to="/MedPacienteMonitoreoDetallado" className="w-fit font-jakarta text-[13px] font-bold text-primary hover:underline">
            Ver el monitoreo del paciente
          </AppLink>
        </div>
      )}
    </PatientLayout>
  );
}
