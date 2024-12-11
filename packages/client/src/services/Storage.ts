import User from '../types/User';

const STORAGE_KEY_AUTH_TOKEN = 'auth_token';
const STORAGE_KEY_USER_DETAILS = 'user_details';
const STORAGE_KEY_AUTHENTICATED = 'is_authenticated';

// This function sets the auth token in local storage. It is used to persist the user's
// authentication state across page reloads.
const setAuthToken = (token: string) => {
  try {
    if (!token) {
      localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
      return;
    }

    localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
  } catch (e) {
    console.error('Could not set auth token', e);
  }
};

// This function retrieves the authentication token from localStorage
const getAuthToken = (): string | null =>
  localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);

const setUserDetails = (user: User) => {
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

// Returns user object from local storage or null if no user is logged in.
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

// Set a boolean value in local storage to indicate whether the user is authenticated.
const setAuthenticated = (isAuthenticated: boolean): void => {
  try {
    if (isAuthenticated) {
      localStorage.setItem(
        STORAGE_KEY_AUTHENTICATED,
        Boolean(isAuthenticated).toString(),
      );
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTHENTICATED);
    }
  } catch (error) {
    console.error('Error setting authentication status', error);
  }
};

// Returns a boolean value indicating whether the user is authenticated.
// Returns false if the value is not set or is not a boolean value.
const getIsAuthenticated = () => {
  try {
    const authenticated = localStorage.getItem(STORAGE_KEY_AUTHENTICATED);
    return authenticated === 'true';
  } catch (e) {
    return false;
  }
};

// This code flushes the local storage. It is used to clear the local storage. It is called when a user logs out.
const flush = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error(e);
  }
};

const Storage = {
  setAuthToken,
  getUserDetails,
  getAuthToken,
  setAuthenticated,
  getIsAuthenticated,
  setUserDetails,
  flush,
};

export default Storage;
