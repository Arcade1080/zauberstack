import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      signIn(accessToken);
      navigate('/'); // Redirect to your app's main page
    } else {
      navigate('/sign-in'); // Redirect to login if tokens are missing
    }
  }, [location, navigate, signIn]);

  return <div>Authenticating...</div>;
}

export default AuthCallback;
