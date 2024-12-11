import axios from 'axios';
import Storage from '../services/Storage';

const { VITE_API_URL } = import.meta.env;
const API_URL = `${VITE_API_URL}/graphql`;

export const refreshAccessToken = async () => {
  const response = await axios.post(
    API_URL,
    {
      query: `
      mutation RefreshAccessToken {
          refreshToken {
            accessToken
          }
      }`,
    },
    {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${Storage.getAuthToken()}`,
      },
    },
  );

  const accessToken = response?.data?.data?.refreshToken?.accessToken;
  if (accessToken) {
    Storage.setAuthToken(accessToken);
  }
  return accessToken;
};
