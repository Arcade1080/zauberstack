import { useMutation } from '@apollo/client';
import useAuthContext from './useAuthContext';
import { MUTATION_SIGN_IN } from '../api/mutations';

export interface SignInDto {
  email: string;
  password: string;
}

export const useSignInMutation = (): Array<any> => {
  const authContext = useAuthContext();

  const [signInMutation, results] = useMutation(MUTATION_SIGN_IN, {
    onCompleted: ({ signIn }) => {
      authContext.signIn(signIn.accessToken);
    },
  });

  const signIn = (data: SignInDto) => {
    const { email, password } = data;
    return signInMutation({
      variables: {
        data: {
          email,
          password,
        },
      },
    });
  };

  return [signIn, results];
};
