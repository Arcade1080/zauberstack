import axios from 'axios';
import supabase from './supabaseClient';

const { VITE_API_URL } = import.meta.env;
const API_URL = `${VITE_API_URL}/graphql`;

export const refreshAccessToken = async () => {
  // Use Supabase's built-in token refresh
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }

  // Return the new access token
  return data?.session?.access_token || null;
};
