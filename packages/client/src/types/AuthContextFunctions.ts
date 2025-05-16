import User from './User';
import {
  SignInCredentials,
  SignUpCredentials,
} from '../services/SupabaseAuthService';

interface AuthContextFunctions {
  signIn: (credentials: SignInCredentials) => Promise<any>;
  signUp: (credentials: SignUpCredentials) => Promise<any>;
  signOut: () => Promise<void>;
  getUserDetails: () => User | null;
  setUserDetails: (user: User) => void;
  loading: boolean;
}

export default AuthContextFunctions;
