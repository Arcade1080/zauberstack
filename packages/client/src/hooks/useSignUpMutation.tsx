import { useMutation } from '@apollo/client';
import useAuthContext from './useAuthContext';
import { MUTATION_SIGN_UP } from '../api/mutations';

export interface SignUpDto {
  owner: {
    email: string;
    password: string;
  };
  organization: {
    name: string;
  };
}

export const useSignUpMutation = (): Array<any> => {
  const authContext = useAuthContext();

  const [signUpMutation, results] = useMutation(MUTATION_SIGN_UP, {
    onCompleted: ({ signUp }) => {
      authContext.signIn(signUp.accessToken);
    },
  });

  const signUp = (data: SignUpDto) => {
    const {
      owner: { email, password },
      organization: { name },
    } = data;

    return signUpMutation({
      variables: {
        data: {
          owner: {
            email,
            password,
          },
          organization: {
            name,
          },
        },
      },
    });
  };

  return [signUp, results];
};
