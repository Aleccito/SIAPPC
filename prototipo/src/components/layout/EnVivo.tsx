// Alertas en vivo (GET /alerts/stream, src/api/alertStream.ts). Lo monta AppLayout, así está en todas las pantallas:
// - `alerta` (una alerta alta o crítica nueva en el hospital): vuelve a pedir lo que depende de ella (la lista de
//   alertas, los pacientes a cargo, las camas de la central) sin esperar al refresco de 15 s. Si es crítica y de un
//   paciente a cargo, avisa con un toast (como mucho uno por paciente por minuto: el backend crea una alerta por
//   cada lectura fuera de rango).
// - `notificacion` (hay algo nuevo en la bandeja de ESTA persona): vuelve a pedir la campana y la bandeja.
// - Si el flujo se corta, la barra superior dice "Sin conexión en vivo" hasta que vuelve (se reintenta cada 3 s).
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useSyncExternalStore } from 'react';
import { suscribirEventos } from '../../api/alertStream';
import type { AssignedPatient } from '../../api/types/dashboard';
import { useSession } from '../auth/session';
import { useToast } from '../ui/Toast';

type Estado = 'conectando' | 'abierto' | 'cortado';
let estado: Estado = 'conectando';
const avisar = new Set<() => void>();
function cambiar(e: Estado) {
  if (e === estado) return;
  estado = e;
  avisar.forEach((f) => f());
}

/** Junta las alertas que llegan seguidas: una ráfaga de lecturas fuera de rango es un solo refresco. */
const ESPERA_MS = 800;
const TOAST_CADA_MS = 60_000;

export function useEnVivo() {
  const { user, can } = useSession();
  const queryClient = useQueryClient();
  const toast = useToast();
  const activo = !!user && user.role !== 'admin' && can('alertas', 'ver');

  useEffect(() => {
    if (!activo) return;
    let pendiente: ReturnType<typeof setTimeout> | undefined;
    const claves = new Set<string>();
    const refrescar = (...nuevas: string[]) => {
      nuevas.forEach((c) => claves.add(c));
      if (pendiente) return;
      pendiente = setTimeout(() => {
        pendiente = undefined;
        for (const c of claves) void queryClient.invalidateQueries({ queryKey: [c] });
        claves.clear();
      }, ESPERA_MS);
    };
    const ultimoToast = new Map<string, number>();

    const cancelar = suscribirEventos((evento, datos) => {
      if (evento === '_abierto' || evento === 'listo') cambiar('abierto');
      else if (evento === '_cortado') cambiar('cortado');
      else if (evento === 'notificacion') refrescar('notifications');
      else if (evento === 'alerta') {
        cambiar('abierto');
        refrescar('alerts', 'assignedPatients', 'monitoredBeds');
        const a = datos as { patientId?: string | null; patientName?: string | null; device?: string; message?: string | null; severity?: string } | null;
        if (a?.severity !== 'critica') return;
        const mios = queryClient.getQueryData<AssignedPatient[]>(['assignedPatients']);
        if (mios && !mios.some((p) => p.id === String(a.patientId))) return;
        const clave = String(a.patientId ?? a.device);
        if (Date.now() - (ultimoToast.get(clave) ?? 0) < TOAST_CADA_MS) return;
        ultimoToast.set(clave, Date.now());
        toast(`Alerta crítica: ${a.patientName ?? a.device ?? 'paciente'} — ${a.message ?? 'fuera de rango'}`, 'danger');
      }
    });
    return () => {
      cancelar();
      clearTimeout(pendiente);
      cambiar('conectando');
    };
  }, [activo, queryClient, toast]);
}

/** "Sin conexión en vivo", junto a la campana, mientras el flujo de alertas está cortado. */
export function EnVivoAviso() {
  const e = useSyncExternalStore(
    (f) => {
      avisar.add(f);
      return () => avisar.delete(f);
    },
    () => estado,
  );
  if (e !== 'cortado') return null;
  return (
    <span role="status" className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-warning-soft px-2.5 py-1 font-jakarta text-[12px] font-bold leading-[normal] text-[#b45309]">
      <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
      Sin conexión en vivo
    </span>
  );
}
