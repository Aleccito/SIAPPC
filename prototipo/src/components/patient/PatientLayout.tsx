import type { ReactNode } from 'react';
import { ApiError } from '../../api/http';
import { cn } from '../../lib/cn';
import { AppLayout } from '../layout/AppLayout';
import type { TopBarProps } from '../layout/TopBar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PatientHeader, PatientTabs, type PatientTab } from './PatientHeader';
import { usePatient } from './usePatient';

type PatientLayoutProps = Omit<TopBarProps, 'onMenuClick'> & {
  /** Pestaña marcada. Sin valor no se muestran las pestañas. */
  tab?: PatientTab;
  children: ReactNode;
  className?: string;
};

/** Aviso en lugar del contenido: paciente inexistente, sin permiso o error del servidor. */
export function PatientProblem({ title, text }: { title: string; text: string }) {
  return (
    <Card className="flex w-full flex-col items-start gap-3">
      <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">{title}</h2>
      <p className="font-jakarta text-[14px] font-normal leading-[1.5] text-muted">{text}</p>
      <Button variant="secondary" to="/MedPacientesLista">
        Ver mis pacientes
      </Button>
    </Card>
  );
}

/** Mientras llegan los datos de la pantalla. */
export function ContentLoading() {
  return (
    <div className="flex w-full flex-col gap-3" aria-busy="true" aria-label="Cargando">
      <span className="h-32 w-full animate-pulse rounded-xl bg-line/60" />
      <span className="h-48 w-full animate-pulse rounded-xl bg-line/60" />
    </div>
  );
}

/**
 * Pantallas del expediente: AppLayout + cabecera del paciente de la URL + pestañas + contenido.
 * Si la cédula no existe (404) o falla la carga, muestra el aviso en lugar del contenido.
 */
export function PatientLayout({ tab, children, className, ...topBar }: PatientLayoutProps) {
  const patient = usePatient();
  const forbidden = patient.status === 'error' && patient.error instanceof ApiError && patient.error.status === 403;
  return (
    <AppLayout {...topBar}>
      <div className={cn('flex w-full min-w-0 flex-1 flex-col gap-5 p-4 md:p-8', className)}>
        {patient.status === 'notFound' ? (
          <PatientProblem title="Paciente no encontrado" text={`No hay ningún paciente con la cédula ${patient.cedula}.`} />
        ) : patient.status === 'error' ? (
          <PatientProblem
            title={forbidden ? 'Sin permiso' : 'No se pudo cargar el paciente'}
            text={forbidden ? 'Su rol no tiene permiso para ver este expediente.' : 'Intente de nuevo en unos segundos.'}
          />
        ) : (
          <>
            <PatientHeader view={patient.view} />
            {tab && <PatientTabs active={tab} />}
            {patient.view ? children : <ContentLoading />}
          </>
        )}
      </div>
    </AppLayout>
  );
}
