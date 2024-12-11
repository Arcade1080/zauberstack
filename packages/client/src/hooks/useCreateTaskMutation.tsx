import { useMutation } from '@apollo/client';
import { MUTATION_CREATE_TASK } from '../api/mutations';
import { QUERY_GET_TASKS } from '../api/queries';

export interface CreateTaskDto {
  title: string;
  description: string;
  tags: Array<string>;
}

export const useCreateTaskMutation = (): Array<any> => {
  const [createTaskMutation, results] = useMutation(MUTATION_CREATE_TASK, {
    refetchQueries: [{ query: QUERY_GET_TASKS }],
  });

  const createTask = (data: CreateTaskDto) => {
    const { title, description, tags } = data;
    return createTaskMutation({
      variables: {
        data: {
          title,
          description,
          tags,
        },
      },
    });
  };

  return [createTask, results];
};
