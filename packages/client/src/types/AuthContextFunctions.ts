import User from './User';

interface AuthContextFunctions {
  signIn: (token: string) => void;
  signOut: () => void;
  getUserDetails: () => User | null;
  setUserDetails: () => void;
}

export default AuthContextFunctions;
