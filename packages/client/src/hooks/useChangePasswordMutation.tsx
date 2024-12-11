import { useMutation } from '@apollo/client';
import { MUTATION_CHANGE_PASSWORD } from '../api/mutations';

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export const useChangePasswordMutation = (): Array<any> => {
  const [changePasswordMutation, results] = useMutation(
    MUTATION_CHANGE_PASSWORD,
  );

  const changePassword = (data: ChangePasswordDto) => {
    const { oldPassword, newPassword } = data;
    return changePasswordMutation({
      variables: {
        data: {
          oldPassword,
          newPassword,
        },
      },
    });
  };

  return [changePassword, results];
};
