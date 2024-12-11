import { useMutation } from '@apollo/client';
import axios from 'axios';
import { MUTATION_UPDATE_PROFILE } from '../api/mutations';
import { QUERY_GET_ME } from '../api/queries';
import Storage from '../services/Storage';

const { VITE_API_URL } = import.meta.env;

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

  const updateProfile = async (data: UpdateProfileDto) => {
    const { lastname, firstname, avatar } = data;

    const authToken = Storage.getAuthToken();

    if (avatar instanceof File) {
      const formData = new FormData();
      formData.append('file', avatar);

      return axios
        .post(`${VITE_API_URL}/media/upload`, formData, {
          withCredentials: true,
          headers: {
            'content-Type': 'multipart/form-data',
            authorization: `Bearer ${Storage.getAuthToken()}`,
          },
        })
        .then(({ data }) =>
          updateProfileMutation({
            variables: {
              data: {
                firstname,
                lastname,
                avatarId: data.id,
              },
            },
          }),
        )
        .catch((error) => {
          console.log(error);
        });
    }

    return updateProfileMutation({
      variables: {
        data: {
          firstname,
          lastname,
          avatarId: avatar === null ? null : undefined,
        },
      },
    });
  };

  return [updateProfile, results];
};
