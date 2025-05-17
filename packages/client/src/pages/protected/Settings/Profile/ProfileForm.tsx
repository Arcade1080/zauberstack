import {
  Avatar,
  Button,
  FileInput,
  Group,
  Space,
  Stack,
  TextInput,
  rem,
} from '@mantine/core';
import { IconUpload, IconX } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { QUERY_GET_ME } from '../../../../api/queries';
import FormBase, { FORM_MODE } from '../../../../components/forms/FormBase';
import Section from '../../../../components/page/Section';
import { useUpdateProfileSettingsMutation } from '../../../../hooks/useUpdateProfileSettings';
import { getMediaUrl } from '../../../../utils/utils';

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required('Please enter a title'),
  lastname: Yup.string().required('Please enter a description'),
});

interface ProfileFormProps {
  onSubmit: any;
}

const ProfileForm = ({ onSubmit }: ProfileFormProps) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [debug, setDebug] = useState({
    avatarPath: null,
    mediaUrl: null,
    formValues: null,
  });

  const iconFileinput = (
    <IconUpload style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const handleFileChange = (file: any) => {
    if (file) {
      setPreviewFile(file);
    } else {
      setPreviewFile(null);
    }
  };

  // Helper function for avatar URL display
  const getAvatarDisplayUrl = (avatarPath: string | null | File) => {
    if (!avatarPath) return null;

    // If avatarPath is a File object (from file input), create an object URL
    if (avatarPath instanceof File) {
      return URL.createObjectURL(avatarPath);
    }

    // Otherwise, treat it as a string path
    return getMediaUrl(avatarPath);
  };

  return (
    <FormBase
      loader={QUERY_GET_ME}
      onSubmit={onSubmit}
      formatInitialValues={(data: any) => {
        console.log('Complete API response:', JSON.stringify(data, null, 2));
        const { firstname, lastname, email, id, avatar } = data?.me ?? {};
        console.log('Avatar from API:', avatar);
        return {
          firstname,
          lastname,
          email,
          id,
          avatar,
        };
      }}
      formatPreSubmit={(data: any) => {
        // If the avatar was not changed (not a File and not explicitly set to null),
        // then we should avoid sending it in the update to preserve the existing avatar
        if (!(data.avatar instanceof File) && data.avatar !== null) {
          // Clone the data without the avatar field to avoid changing the original form data
          const { avatar, ...dataWithoutAvatar } = data;
          return dataWithoutAvatar;
        }
        return data;
      }}
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        id: '',
        avatar: null,
      }}
      submitAction={useUpdateProfileSettingsMutation}
      mode={FORM_MODE.EDIT}
      validationSchema={validationSchema}
    >
      {(form: any) => {
        // Update debug state
        useEffect(() => {
          setDebug({
            avatarPath: form.values.avatar,
            mediaUrl: form.values.avatar
              ? getMediaUrl(form.values.avatar)
              : null,
            formValues: form.values,
          });
        }, [form.values]);

        return (
          <>
            <Stack gap="xl">
              <Section
                heading="Personal information"
                description="Change your personal information here."
              >
                <Stack gap="lg" maw={400}>
                  <TextInput
                    required
                    size="md"
                    label="First name"
                    placeholder="Enter the title of the task"
                    {...form.getInputProps('firstname')}
                  />
                  <TextInput
                    required
                    size="md"
                    label="Last name"
                    placeholder="Describe the task"
                    {...form.getInputProps('lastname')}
                  />

                  <TextInput
                    disabled
                    size="md"
                    readOnly
                    label="Email"
                    {...form.getInputProps('email')}
                  />
                </Stack>
              </Section>
              <Section
                heading="Profile picture"
                description="Your picture should have one of the following endings: png, jpeg, gif, jpg."
              >
                <Stack maw={400}>
                  <Group gap="lg" justify="flex-start" align="center">
                    <Avatar
                      src={
                        previewFile
                          ? URL.createObjectURL(previewFile)
                          : getAvatarDisplayUrl(form.values.avatar)
                      }
                      alt="Your profile pic"
                      size="lg"
                      mr="xs"
                    />
                    {form.values.avatar && !previewFile ? (
                      <Button
                        variant="default"
                        leftSection={<IconX size={16} />}
                        onClick={() => form.setFieldValue('avatar', null)}
                      >
                        Remove
                      </Button>
                    ) : (
                      <FileInput
                        placeholder="Upload your photo"
                        leftSection={iconFileinput}
                        accept={[
                          'image/png',
                          'image/jpeg',
                          'image/gif',
                          'image/jpg',
                        ]}
                        variant="default"
                        clearable
                        {...form.getInputProps('avatar')}
                        onChange={(file) => {
                          handleFileChange(file);
                          form.setFieldValue('avatar', file);
                        }}
                      />
                    )}
                  </Group>
                </Stack>
                <Space h="xl" />
                <Space h="xl" />
                {/* Debug display */}
                <div
                  style={{
                    marginTop: '20px',
                    padding: '10px',
                    background: '#f5f5f5',
                    fontSize: '12px',
                  }}
                >
                  <div>Avatar path: {JSON.stringify(debug.avatarPath)}</div>
                  <div>Media URL: {debug.mediaUrl}</div>
                  <div>
                    Supabase URL:{' '}
                    {import.meta.env.VITE_SUPABASE_URL || 'Not set'}
                  </div>
                  <div>Form values: {JSON.stringify(form.values)}</div>
                  <div>
                    Is submitting: {form.isSubmitting ? 'true' : 'false'}
                  </div>
                </div>
                <Button size="md" disabled={form.isSubmitting} type="submit">
                  Save changes
                </Button>
              </Section>
            </Stack>
          </>
        );
      }}
    </FormBase>
  );
};

export default ProfileForm;
