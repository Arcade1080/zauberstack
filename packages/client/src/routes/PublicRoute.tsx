import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';

type Props = {
  children?: JSX.Element;
};

const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (isAuthenticated) {
    const redirectLocation = location.state?.from || '/';
    return <Navigate to={redirectLocation} />;
  }

  return children || <Outlet />;
};

export default PublicRoute;
