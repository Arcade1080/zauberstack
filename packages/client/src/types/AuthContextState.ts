import User from './User';

export interface AuthContextState {
  isAuthenticated: boolean;
  userDetails: User | null;
}
