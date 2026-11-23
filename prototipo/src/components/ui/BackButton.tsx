import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '../icons';
import { Button } from './Button';

/** Botón "Volver": regresa a la pantalla anterior. */
export function BackButton({ children = 'Volver' }: { children?: string }) {
  const navigate = useNavigate();
  return (
    <Button variant="secondary" icon={<IconArrowLeft size={14} />} onClick={() => navigate(-1)}>
      {children}
    </Button>
  );
}
