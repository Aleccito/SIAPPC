import { CURRENT_USER } from '../layout/nav';
import { ConfirmDialog } from '../ui/Modal';
import { useLogout } from './useLogout';

/** Confirmación de "Cerrar sesión". La abre el menú lateral; la dibuja `AppLayout`. */
export function LogoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const logout = useLogout();
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
      Se cerrará la sesión de {CURRENT_USER.name} en este equipo.
    </ConfirmDialog>
  );
}
