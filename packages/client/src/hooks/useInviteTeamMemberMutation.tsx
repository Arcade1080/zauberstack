import { useMutation } from '@apollo/client';
import { MUTATION_INVITE_TEAM_MEMBER } from '../api/mutations';
import { QUERY_GET_ME } from '../api/queries';

export interface InviteTeamMemberDto {
  invitees: Array<string>;
}

export const useInviteTeamMemberMutation = (): Array<any> => {
  const [inviteTeamMemberMutation, results] = useMutation(
    MUTATION_INVITE_TEAM_MEMBER,
    {
      refetchQueries: [{ query: QUERY_GET_ME }],
    },
  );

  const inviteTeamMember = (data: InviteTeamMemberDto) => {
    const { invitees } = data;
    return inviteTeamMemberMutation({
      variables: {
        data: {
          invitees,
        },
      },
    });
  };

  return [inviteTeamMember, results];
};
