import { useMutation } from '@apollo/client';
import useAuthContext from './useAuthContext';
import { MUTATION_ACCEPT_INVITATION } from '../api/mutations';

export interface AcceptInvitationDto {
  token: string;
  user: {
    password: string;
  };
}

export const useAcceptInvitationMutation = (): Array<any> => {
  const authContext = useAuthContext();

  const [acceptInvitationMutation, results] = useMutation(
    MUTATION_ACCEPT_INVITATION,
    {
      onCompleted: ({ acceptInvitation }) => {
        authContext.signIn(acceptInvitation.accessToken);
      },
    },
  );

  const acceptInvitation = (data: AcceptInvitationDto) => {
    const { token, user } = data;

    return acceptInvitationMutation({
      variables: {
        data: {
          token,
          user,
        },
      },
    });
  };

  return [acceptInvitation, results];
};
