import { Link, type LinkProps } from 'react-router-dom';
import { useWithPatient } from '../../lib/patientLink';

/** `Link` de react-router que, dentro del expediente, conserva el paciente de la URL (`?paciente=`). */
export function AppLink({ to, ...rest }: Omit<LinkProps, 'to'> & { to: string }) {
  const keepPatient = useWithPatient();
  return <Link to={keepPatient(to)} {...rest} />;
}
