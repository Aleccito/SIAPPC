import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '../icons';
import { Button } from './Button';

/** Botón "Volver": regresa a la pantalla anterior o, con `to`, a una pantalla fija. */
export function BackButton({ children = 'Volver', to }: { children?: string; to?: string }) {
  const navigate = useNavigate();
  if (to) {
    return (
      <Button variant="secondary" icon={<IconArrowLeft size={14} />} to={to}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="secondary" icon={<IconArrowLeft size={14} />} onClick={() => navigate(-1)}>
      {children}
    </Button>
  );
}
