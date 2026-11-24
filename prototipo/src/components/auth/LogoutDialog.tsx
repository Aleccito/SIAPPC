import { ConfirmDialog } from '../ui/Modal';
import { useDisplayUser } from './session';
import { useLogout } from './useLogout';

/** Confirmación de "Cerrar sesión". La abre el menú lateral; la dibuja `AppLayout`. */
export function LogoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const logout = useLogout();
  const user = useDisplayUser();
  return (
    <ConfirmDialog
      open={open}
      title="¿Cerrar sesión?"
      confirmLabel="Cerrar sesión"
      confirmVariant="danger"
      onCancel={onClose}
      onConfirm={() => {
        onClose();
        void logout();
      }}
    >
      Se cerrará la sesión de {user.name} en este equipo.
    </ConfirmDialog>
  );
}
