import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { AppLayout } from '../layout/AppLayout';
import type { TopBarProps } from '../layout/TopBar';
import { PatientHeader, PatientTabs, type PatientTab } from './PatientHeader';

type PatientLayoutProps = Omit<TopBarProps, 'onMenuClick'> & {
  /** Pestaña marcada. Sin valor no se muestran las pestañas. */
  tab?: PatientTab;
  children: ReactNode;
  className?: string;
};

/** Pantallas del expediente: AppLayout + cabecera del paciente + pestañas + contenido. */
export function PatientLayout({ tab, children, className, ...topBar }: PatientLayoutProps) {
  return (
    <AppLayout {...topBar}>
      <div className={cn('flex w-full min-w-0 flex-1 flex-col gap-5 p-4 md:p-8', className)}>
        <PatientHeader />
        {tab && <PatientTabs active={tab} />}
        {children}
      </div>
    </AppLayout>
  );
}
