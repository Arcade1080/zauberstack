import { useMutation } from '@apollo/client';
import useAuthContext from './useAuthContext';
import { MUTATION_SIGN_IN } from '../api/mutations';
import { SignInCredentials } from '../services/SupabaseAuthService';

export interface SignInDto {
  email: string;
  password: string;
}

export const useSignInMutation = (): Array<any> => {
  const authContext = useAuthContext();

  // Legacy GraphQL mutation kept for compatibility
  const [signInMutation, results] = useMutation(MUTATION_SIGN_IN);

  const signIn = async (data: SignInDto) => {
    try {
      const { email, password } = data;

      // Use the Supabase auth context directly instead of GraphQL
      const credentials: SignInCredentials = { email, password };
      await authContext.signIn(credentials);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  return [signIn, { ...results, loading: authContext.loading }];
};
