import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { checkPermissions } from '../components/common/PermissionGate';
import useAuthContext from '../hooks/useAuthContext';
import { reSignIn } from '../lib/apolloClient';
import { Paths } from './paths';

interface PrivateRouteProps {
  children?: JSX.Element;
  redirectPath?: string;
  requiredPermissions?: string[] | null;
}

const PrivateRoute = ({
  children,
  redirectPath,
  requiredPermissions,
}: PrivateRouteProps) => {
  const { isAuthenticated, getUserDetails } = useAuthContext();
  const userDetails = getUserDetails();
  const location = useLocation();

  if (reSignIn() && !isAuthenticated) {
    reSignIn(false);
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectPath || Paths.SignIn}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredPermissions && userDetails) {
    const hasPermissions = checkPermissions(
      requiredPermissions,
      userDetails.permissions,
    );

    if (!hasPermissions) {
      return <Navigate to={redirectPath || Paths.Home} replace />;
    }
  }

  return children || <Outlet />;
};

export default PrivateRoute;
