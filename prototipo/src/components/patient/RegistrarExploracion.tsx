// Acceso directo a registrar la exploración física (y con ella el Glasgow) cuando todavía no hay
// (REVISION-MEDICO.md, 3.6). Va dentro de filas y tarjetas que ya llevan al paciente: detiene el clic para no abrir
// también la fila. Solo con permiso para escribir en la historia clínica.
import type { MouseEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';
import { useSession } from '../auth/session';

export function RegistrarExploracion({ cedula, texto = 'Registrar exploración física', className }: { cedula: string; texto?: string; className?: string }) {
  const navigate = useNavigate();
  const { can } = useSession();
  if (!can('historia_clinica', 'editar')) return null;
  const ir = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(patientPath('/MedPacienteExploracionFisica', cedula));
  };
  return (
    <button
      type="button"
      onClick={ir}
      onKeyDown={(e: KeyboardEvent) => e.stopPropagation()}
      className={cn('w-fit text-left font-jakarta text-[12px] font-bold leading-[normal] text-primary underline-offset-2 hover:underline', className)}
    >
      {texto}
    </button>
  );
}
