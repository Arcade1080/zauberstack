import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useReducer } from 'react';
import { QUERY_GET_ME } from '../api/queries';
import apolloClient, { RESIGN_IN } from '../lib/apolloClient';
import Storage from '../services/Storage';
import AuthContextFunctions from '../types/AuthContextFunctions';
import { AuthContextState } from '../types/AuthContextState';
import User from '../types/User';

enum AuthContextActionType {
  IS_AUTHENTICATED = 'isAuthenticated',
  SIGN_OUT = 'signOut',
  SET_USER_DETAILS = 'setUserDetails',
}

const initialAuthContextState: AuthContextState = {
  isAuthenticated: Storage.getIsAuthenticated(),
  userDetails: Storage.getUserDetails(),
};

const initialAuthContextFunctions: AuthContextFunctions = {
  signIn: () => {},
  signOut: () => {},
  getUserDetails: () => null,
  setUserDetails: () => {},
};

const initialAuthenticationContext = {
  ...initialAuthContextState,
  ...initialAuthContextFunctions,
};

const AuthContextReducer = (
  authState: AuthContextState,
  action: { type: AuthContextActionType; payload?: any },
): AuthContextState => {
  switch (action.type) {
    case AuthContextActionType.IS_AUTHENTICATED:
      return {
        ...authState,
        isAuthenticated: action.payload,
      };

    case AuthContextActionType.SIGN_OUT:
      return {
        ...authState,
        isAuthenticated: false,
        userDetails: null,
      };

    case AuthContextActionType.SET_USER_DETAILS:
      return {
        ...authState,
        userDetails: action.payload,
      };

    default:
      return authState;
  }
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, dispatch] = useReducer(
    AuthContextReducer,
    initialAuthContextState,
  );

  const { data } = useQuery(RESIGN_IN);

  const formatUserDetails = (userDetails: any): User => {
    const {
      avatar,
      email,
      id,
      firstname,
      plan,
      lastname,
      isAccountOwner,
      role,
      account,
    } = userDetails;
    const _userDetails = {
      avatar,
      plan,
      email,
      id,
      isAccountOwner,
      firstname,
      lastname,
      account: account.id,
      role: role.name,
      permissions: role.permissions.map((permission: any) => permission.name),
    };

    return _userDetails;
  };

  const signIn = async (token: string) => {
    // Update state of Storage, so that we can persist the authentication status and the token
    Storage.setAuthToken(token);
    Storage.setAuthenticated(true);

    // Fetch user details immediately after signing in
    try {
      const response = await apolloClient.query({ query: QUERY_GET_ME });
      const userDetails = response.data.me;
      const _userDetails = formatUserDetails(userDetails);
      setUserDetails(_userDetails); // Update user details in the auth context
    } catch (error) {
      // Handle any errors that occur while fetching user details
      console.error('Failed to fetch user details:', error);
    }

    // Update state of auth context
    dispatch({
      type: AuthContextActionType.IS_AUTHENTICATED,
      payload: true,
    });
  };

  const signOut = () => {
    Storage.flush();

    dispatch({
      type: AuthContextActionType.SIGN_OUT,
    });
  };

  const setUserDetails = (userDetails: User) => {
    dispatch({
      type: AuthContextActionType.SET_USER_DETAILS,
      payload: userDetails,
    });

    Storage.setUserDetails(userDetails);
  };

  const getUserDetails = () => authState.userDetails;

  const pollUserDetails = useCallback(() => {
    const interval = setInterval(
      () => {
        if (authState.isAuthenticated) {
          apolloClient
            .query({ query: QUERY_GET_ME })
            .then((response) => {
              const userDetails = response.data.me;
              const _userDetails = formatUserDetails(userDetails);
              setUserDetails(_userDetails); // Update user details in the auth context
            })
            .catch((error) => {
              // Handle any errors that occur while fetching user details
              console.error('Failed to fetch user details:', error);
            });
        }
      },
      1 * 10 * 1000,
    ); // Poll every 1 minutes (1 * 60 * 1000 milliseconds)

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, setUserDetails]);

  useEffect(() => {
    const cleanup = pollUserDetails();
    return () => cleanup();
  }, [pollUserDetails]);

  const initialContext: any = useCallback(
    () => ({
      ...authState,
      signIn,
      signOut,
      getUserDetails,
    }),
    [authState, getUserDetails],
  );

  //case is for user who needs a re-sign in
  if (authState.isAuthenticated && data?.reSignIn) {
    signOut();
  }

  return (
    <AuthContext.Provider value={initialContext()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const AuthContext = React.createContext(initialAuthenticationContext);
