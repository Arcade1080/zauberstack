import { Button, Group, Stack, TextInput } from '@mantine/core';
import * as Yup from 'yup';
import { QUERY_GET_TAG_DETAIL } from '../../../api/queries';
import { useUpdateTagMutation } from '../../../hooks/useUpdateTagMutation';
import FormBase, { FORM_MODE } from '../../../components/forms/FormBase';
import { useCreateTagMutation } from '../../../hooks/useCreateTagMutation';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter a title'),
});

const TagForm = ({ mode, entityId, onSubmit }: any) => (
  <FormBase
    loader={QUERY_GET_TAG_DETAIL}
    queryVariables={{
      id: entityId,
    }}
    initialValues={{
      name: '',
      id: entityId,
    }}
    formatInitialValues={(data: any) => {
      const { name, id } = data?.tag ?? {};
      return {
        name,
        id,
      };
    }}
    onSubmit={onSubmit}
    submitAction={
      mode === FORM_MODE.CREATE ? useCreateTagMutation : useUpdateTagMutation
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
            label="Name"
            placeholder="Enter the name of the tag"
            {...form.getInputProps('name')}
          />
        </Stack>
        <Group justify="right" mt="xl">
          <Button type="submit" size="md">
            {mode === FORM_MODE.CREATE ? 'Create tag' : 'Save changes'}
          </Button>
        </Group>
      </>
    )}
  </FormBase>
);

export default TagForm;
