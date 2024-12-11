import { Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import * as Yup from 'yup';
import { MUTATION_CREATE_TAG } from '../../../api/mutations';
import { QUERY_GET_TAGS, QUERY_GET_TASK_DETAIL } from '../../../api/queries';
import { ComboMultiSelect } from '../../../components/form/ComboMultiSelect';
import FormBase, { FORM_MODE } from '../../../components/forms/FormBase';
import { useCreateTaskMutation } from '../../../hooks/useCreateTaskMutation';
import { useUpdateTaskMutation } from '../../../hooks/useUpdateTaskMutation';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Please enter a title'),
  description: Yup.string().required('Please enter a description'),
});

const TaskForm = ({ mode, entityId, onSubmit }: any) => (
  <FormBase
    loader={QUERY_GET_TASK_DETAIL}
    initialValues={{
      title: '',
      tags: [],
      description: '',
      id: entityId,
    }}
    queryVariables={{
      taskId: entityId,
    }}
    formatInitialValues={(data: any) => {
      const { title, description, tags: rawTags } = data?.getTaskById ?? {};

      return {
        title,
        description,
        tags: rawTags?.map((item: any) => item.id),
      };
    }}
    onSubmit={onSubmit}
    submitAction={
      mode === FORM_MODE.CREATE ? useCreateTaskMutation : useUpdateTaskMutation
    }
    mode={mode}
    validationSchema={validationSchema}
  >
    {(form: any) => (
      <>
        <Stack>
          <TextInput
            required
            size="md"
            label="Title"
            placeholder="Enter the title of the task"
            {...form.getInputProps('title')}
          />
          <ComboMultiSelect
            createMutationConfig={{
              mutation: MUTATION_CREATE_TAG,
              variables: (itemLabel: any) => ({ name: itemLabel }),
              formatMutationResponse: (data: any) => data.createTag.id,
            }}
            label="Tags"
            loaderQuery={QUERY_GET_TAGS}
            placeholder="Select tags or create new ones"
            formatData={(data: any) =>
              data?.getTags?.edges?.map((item: any) => ({
                value: item.node.id,
                label: item.node.name,
              }))
            }
            selectedValues={form?.values?.tags || []}
            {...form.getInputProps('tags')}
          />

          <Textarea
            required
            size="md"
            label="Description"
            placeholder="Describe the task"
            {...form.getInputProps('description')}
          />
        </Stack>
        <Group justify="flex-end" mt="xl">
          <Button size="md" type="submit">
            {mode === FORM_MODE.CREATE ? 'Create task' : 'Save changes'}
          </Button>
        </Group>
      </>
    )}
  </FormBase>
);

export default TaskForm;
