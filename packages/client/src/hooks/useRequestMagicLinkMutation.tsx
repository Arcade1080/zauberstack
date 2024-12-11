import { useMutation } from '@apollo/client';
import { MUTATION_REQUEST_MAGICLINK } from '../api/mutations';

export interface RequestMagicLinkDto {
  email: string;
}

export const useRequestMagicLinkMutation = (): Array<any> => {
  const [requestMagicLinkMutation, results] = useMutation(
    MUTATION_REQUEST_MAGICLINK,
  );

  const requestMagicLink = (data: RequestMagicLinkDto) => {
    const { email } = data;

    return requestMagicLinkMutation({
      variables: {
        data: {
          email,
        },
      },
    });
  };

  return [requestMagicLink, results];
};
