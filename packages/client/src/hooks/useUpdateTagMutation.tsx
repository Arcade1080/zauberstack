import { useMutation } from '@apollo/client';
import { MUTATION_UPDATE_TAG } from '../api/mutations';

export interface UpdateTagDto {
  name: string;
  id: string;
}

export const useUpdateTagMutation = (): Array<any> => {
  const [updateTagMutation, results] = useMutation(MUTATION_UPDATE_TAG, {});

  const updateTag = (data: UpdateTagDto) => {
    const { name, id } = data;
    return updateTagMutation({
      variables: {
        id,
        name,
      },
    });
  };

  return [updateTag, results];
};
