import { useMutation } from '@apollo/client';
import { MUTATION_UPDATE_TASK } from '../api/mutations';

export interface UpdateTaskDto {
  name: string;
  id: string;
  description: string;
  tags: Array<string>;
  title: string;
}

export const useUpdateTaskMutation = (): Array<any> => {
  const [updateTaskMutation, results] = useMutation(MUTATION_UPDATE_TASK, {});

  const updateTask = (data: UpdateTaskDto) => {
    const { title, id, description, tags } = data;
    return updateTaskMutation({
      variables: {
        data: {
          taskId: id,
          title,
          description,
          tags,
        },
      },
    });
  };

  return [updateTask, results];
};
