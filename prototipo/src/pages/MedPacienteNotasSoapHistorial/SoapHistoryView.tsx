// Lista de notas SOAP + detalle de la nota seleccionada. La usan el historial y el detalle de notas.
import { Link } from 'react-router-dom';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgChevronRight from '../../assets/chevron-right.svg';
import imgChevronRight2 from '../../assets/chevron-right-2.svg';
import imgIconwrapper15 from '../../assets/iconwrapper-15.svg';
import imgSliders from '../../assets/sliders.svg';
import { Badge, Button, Card, Divider, SoapSections } from '../../components';
import { cn } from '../../lib/cn';

const NOTES: Array<{ date: string; doctor: string; subjective: string; done: boolean; to?: string }> = [
  { date: '24 Oct 2025, 09:15', doctor: 'Dr. Carlos Méndez', subjective: 'Disnea progresiva y dificultad para respirar en reposo. Refiere empeoramiento desde anoche.', done: true, to: '/MedPacienteNotasSoapDetalle' },
  { date: '22 Oct 2025, 14:30', doctor: 'Dra. Ana Rodríguez', subjective: 'Paciente refiere mejoría parcial, menos fatiga al sentarse, pero persiste tos seca esporádica.', done: true },
  { date: '18 Oct 2025, 10:00', doctor: 'Dr. Carlos Méndez', subjective: 'Dolor torácico intermitente al esfuerzo moderado. No refiere mareos ni síncope reciente.', done: true },
  { date: '15 Oct 2025, 08:45', doctor: 'Dra. Ana Rodríguez', subjective: 'Disnea severa durante ingreso inicial, ortopnea marcada, sibilancias inspiratorias.', done: true },
  { date: '10 Oct 2025, 16:20', doctor: 'Dr. Luis Peralta', subjective: 'Seguimiento de rutina pre-admisión. Reporta hinchazón en extremidades inferiores.', done: false },
];

const SELECTED = {
  s: 'Disnea progresiva y dificultad para respirar en reposo. Paciente refiere empeoramiento de la fatiga al realizar movimientos mínimos y ortopnea marcada durante la noche anterior.',
  o: 'Frecuencia Cardíaca 134 lpm, SpO2 89% con aire ambiente, Temperatura 38.5°C. Se auscultan estertores crepitantes bilaterales en bases pulmonares. Presión arterial de 140/90 mmHg.',
  a: 'Paciente con cuadro clínico compatible con descompensación aguda de Insuficiencia Cardíaca Congestiva (ICC) secundaria a probable proceso infeccioso respiratorio en evolución.',
  p: 'Ajustar dosis de diuréticos intravenosos, iniciar aporte de oxígeno por mascarilla para mantener SpO2 > 92%, solicitar radiografía de tórax urgente y paraclínicos inflamatorios.',
};

/** Historial de notas SOAP con la nota del 24 Oct seleccionada. */
export function SoapHistoryView({ linkSelected = false }: { linkSelected?: boolean }) {
  return (
    <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
      <Card className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Historial de Notas SOAP</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5">
              <img className="size-3" alt="" src={imgIconwrapper15} />
              <p className="font-jakarta text-[12px] font-normal leading-[normal] text-muted">Buscar notas...</p>
            </div>
            <Button variant="secondary" size="sm" icon={<img className="size-3" alt="" src={imgSliders} />}>
              Filtrar
            </Button>
          </div>
        </div>
        <ul className="flex w-full flex-col gap-[10px]">
          {NOTES.map((n) => {
            const content = (
              <>
                <div className="flex w-full flex-col gap-1 leading-[normal] sm:w-[150px] sm:shrink-0">
                  <p className="font-jakarta text-[13px] font-bold text-ink">{n.date}</p>
                  <p className="truncate font-jakarta text-[12px] font-normal text-muted">{n.doctor}</p>
                </div>
                <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[1.4] text-ink sm:truncate">
                  <span className="font-bold text-primary">S: </span>
                  {n.subjective}
                </p>
                <div className="flex items-center gap-4">
                  <Badge tone={n.done ? 'success' : 'warning'}>{n.done ? 'Completada' : 'En progreso'}</Badge>
                  <img className="size-3.5 shrink-0" alt="" src={n.to ? imgChevronRight : imgChevronRight2} />
                </div>
              </>
            );
            const classes = cn(
              'flex w-full flex-col gap-3 rounded-[10px] bg-white p-4 text-left drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:gap-4',
              n.to ? 'border-[1.5px] border-primary' : 'border border-line',
            );
            return (
              <li key={n.date}>
                {n.to && linkSelected ? (
                  <Link to={n.to} className={classes}>
                    {content}
                  </Link>
                ) : (
                  <div className={classes}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Card raised className="flex w-full min-w-0 flex-col gap-[14px] xl:w-[380px] xl:shrink-0">
        <div className="flex w-full items-center justify-between gap-3">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Detalle de Nota Seleccionada</h2>
          <Badge tone="neutral" size="sm">24 Oct 2025, 09:15</Badge>
        </div>
        <div className="flex items-center gap-2">
          <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
          <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">Dr. Carlos Méndez</p>
        </div>
        <Divider />
        <SoapSections note={SELECTED} />
      </Card>
    </div>
  );
}
