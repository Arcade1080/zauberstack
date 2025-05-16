import User from '../types/User';

const STORAGE_KEY_USER_DETAILS = 'user_details';

/**
 * Store and retrieve user details from localStorage
 * Authentication token and session management is handled by Supabase
 */

// Set or remove user details in localStorage
const setUserDetails = (user: User | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_USER_DETAILS);
  } else {
    try {
      localStorage.setItem(STORAGE_KEY_USER_DETAILS, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data', error);
    }
  }
};

// Returns user object from local storage or null if no user is logged in
const getUserDetails = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEY_USER_DETAILS);
    if (userJson == null) {
      return null;
    }
    return JSON.parse(userJson);
  } catch (e) {
    // handle errors
    return null;
  }
};

const Storage = {
  getUserDetails,
  setUserDetails,
};

export default Storage;
