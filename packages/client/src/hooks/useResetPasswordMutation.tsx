import { useMutation } from '@apollo/client';
import { MUTATION_RESET_PASSWORD } from '../api/mutations';

export interface ResetPasswordDto {
  password: string;
  token: string;
}

export const useResetPasswordMutation = (): Array<any> => {
  const [resetPasswordMutation, results] = useMutation(MUTATION_RESET_PASSWORD);

  const resetPassword = (data: ResetPasswordDto) => {
    const { password, token } = data;

    return resetPasswordMutation({
      variables: {
        data: {
          password,
          token,
        },
      },
    });
  };

  return [resetPassword, results];
};
