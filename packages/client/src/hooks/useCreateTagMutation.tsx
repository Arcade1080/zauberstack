import { useMutation } from '@apollo/client';
import { MUTATION_CREATE_TAG } from '../api/mutations';

export interface CreateTagDto {
  name: string;
}

export const useCreateTagMutation = (): Array<any> => {
  const [createTagMutation, results] = useMutation(MUTATION_CREATE_TAG, {});

  const createTag = (data: CreateTagDto) =>
    createTagMutation({
      variables: {
        name: data.name,
      },
    });

  return [createTag, results];
};
