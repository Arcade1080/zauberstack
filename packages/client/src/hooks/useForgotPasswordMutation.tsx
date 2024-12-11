import { useMutation } from '@apollo/client';
import { MUTATION_SEND_RESET_PASSWORD_LINK } from '../api/mutations';

export interface SendResetPasswordLinkDto {
  email: string;
}

export const useSendResetPasswordMutation = (): Array<any> => {
  const [sendResetPasswordLinkMutation, results] = useMutation(
    MUTATION_SEND_RESET_PASSWORD_LINK,
  );

  const sendResetPasswordLink = (data: SendResetPasswordLinkDto) => {
    const { email } = data;
    return sendResetPasswordLinkMutation({
      variables: {
        data: {
          email,
        },
      },
    });
  };

  return [sendResetPasswordLink, results];
};
