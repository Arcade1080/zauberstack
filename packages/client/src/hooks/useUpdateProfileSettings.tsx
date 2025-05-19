import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { MUTATION_UPDATE_PROFILE } from '../api/mutations';
import { QUERY_GET_ME } from '../api/queries';
import useAuthContext from './useAuthContext';
import supabase from '../lib/supabaseClient';

export interface UpdateProfileDto {
  firstname: string;
  lastname: string;
  avatar: File | null;
}

export const useUpdateProfileSettingsMutation = (): Array<any> => {
  const [updateProfileMutation, results] = useMutation(
    MUTATION_UPDATE_PROFILE,
    {
      refetchQueries: [{ query: QUERY_GET_ME }],
    },
  );

  const { getUserDetails } = useAuthContext();

  const updateProfile = async (data: UpdateProfileDto) => {
    const { lastname, firstname, avatar } = data;
    let avatarUrl: string | null;

    try {
      // 1. Handle avatar upload to Supabase Storage if a new file is provided
      if (avatar instanceof File) {
        // Get user from context
        const user = getUserDetails();

        // If user context isn't available, try getting directly from Supabase
        let userId;
        if (!user) {
          const { data: supabaseData } = await supabase.auth.getUser();
          if (!supabaseData?.user?.id) {
            console.error('Failed to get user ID from Supabase or context');
            throw new Error(
              'Authentication error - please try signing in again',
            );
          }
          userId = supabaseData.user.id;
        } else {
          userId = user.id;
        }

        // Create a unique file name
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `avatars/${userId}/${fileName}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media') // Bucket name - make sure this exists in your Supabase project
          .upload(filePath, avatar, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          throw uploadError;
        }

        // Get the public URL
        // NOTE: We're setting the avatarUrl value to just the relative path
        // within the bucket, rather than the full URL. This simplifies handling
        // when environment URLs change.
        avatarUrl = filePath;

        // 2. Update Supabase user metadata with the avatar URL
        const { error: updateUserError } = await supabase.auth.updateUser({
          data: {
            avatar_url: avatarUrl,
            firstname,
            lastname,
          },
        });

        if (updateUserError) {
          console.error('Supabase user update error:', updateUserError);
          throw updateUserError;
        }
      } else if (avatar === null) {
        avatarUrl = null;

        // Update Supabase user metadata to remove avatar
        const { error: updateUserError } = await supabase.auth.updateUser({
          data: {
            avatar_url: null,
            firstname,
            lastname,
          },
        });

        if (updateUserError) {
          console.error('Supabase user update error:', updateUserError);
          throw updateUserError;
        }
      }

      // 3. Update user profile in backend via GraphQL
      const updateData = {
        firstname,
        lastname,
      };

      // Only add avatarUrl if it's been set (either to a URL or null)
      if (avatarUrl !== undefined) {
        Object.assign(updateData, { avatarUrl });
      }

      return await updateProfileMutation({
        variables: {
          data: updateData,
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return [updateProfile, results];
};
