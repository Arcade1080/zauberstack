import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
