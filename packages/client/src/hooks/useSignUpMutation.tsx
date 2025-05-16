import { useMutation } from '@apollo/client';
import useAuthContext from './useAuthContext';
import { MUTATION_SIGN_UP } from '../api/mutations';
import { SignUpCredentials } from '../services/SupabaseAuthService';

export interface SignUpDto {
  owner: {
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
  };
  organization: {
    name: string;
  };
}

export const useSignUpMutation = (): Array<any> => {
  const authContext = useAuthContext();

  // Legacy GraphQL mutation kept for compatibility
  const [signUpMutation, results] = useMutation(MUTATION_SIGN_UP);

  const signUp = async (data: SignUpDto) => {
    try {
      const {
        owner: { email, password, firstname, lastname },
        organization: { name },
      } = data;

      // First, sign up with Supabase
      const credentials: SignUpCredentials = {
        email,
        password,
        firstname,
        lastname,
      };

      await authContext.signUp(credentials);

      // After successful Supabase signup, we still need to create the organization
      // in our backend, but only if the user is confirmed (or auto-confirmed)
      if (authContext.isAuthenticated) {
        try {
          // This is now an authenticated request since we're logged in
          await signUpMutation({
            variables: {
              data: {
                organization: {
                  name,
                },
              },
            },
          });
        } catch (error) {
          console.error('Error creating organization:', error);
          // Don't fail the signup if org creation fails
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  return [signUp, { ...results, loading: authContext.loading }];
};
