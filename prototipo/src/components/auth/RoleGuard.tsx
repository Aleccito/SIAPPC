// Qué pantallas abre cada rol (CONEXION-BACKEND.md, 9.1). Va alrededor de las rutas: si la cuenta no tiene los
// permisos de la pantalla (matriz de seed.sql), o es el admin en una pantalla clínica, se ve un aviso en lugar de
// la pantalla, sin pedirle nada al servidor. El backend decide igual con su 403; esto evita llegar a él.
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { accessForPath } from '../layout/nav';
import { AppLayout } from '../layout/AppLayout';
import { Card } from '../ui/Card';
import { landingFor, useSession } from './session';

export function RoleGuard({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, mfaPending, can } = useSession();
  const access = accessForPath(pathname);
  if (!user || mfaPending || !access) return <>{children}</>;
  const technical = user.role === 'admin' && access.clinical;
  const allowed = !technical && access.perm.every((p) => can(p, 'ver'));
  if (allowed) return <>{children}</>;
  return (
    <AppLayout breadcrumb="SIAPPC" title={technical ? 'Cuenta técnica' : 'Sin permiso'}>
      <div className="flex w-full flex-1 p-4 md:p-8">
        <Card padding="lg" className="flex w-full max-w-[640px] flex-col gap-3">
          <h2 className="font-jakarta text-[18px] font-extrabold leading-[normal] text-ink">
            {technical ? 'Esta cuenta es técnica: no ve información clínica.' : 'No tiene permiso para ver esto.'}
          </h2>
          <p className="font-jakarta text-[14px] leading-[1.5] text-muted">
            {technical
              ? 'El administrador gestiona usuarios, roles y la bitácora; los datos de los pacientes los ven el personal médico y de enfermería.'
              : `Su rol (${user.roleLabel}) no tiene acceso a esta pantalla. Si lo necesita, pídaselo al administrador.`}
          </p>
          <Link to={landingFor(user.role)} className="w-fit font-jakarta text-[14px] font-bold text-primary hover:underline">
            Ir a mi inicio
          </Link>
        </Card>
      </div>
    </AppLayout>
  );
}
