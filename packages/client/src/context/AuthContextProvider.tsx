import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { QUERY_GET_ME } from '../api/queries';
import apolloClient, { RESIGN_IN } from '../lib/apolloClient';
import Storage from '../services/Storage';
import AuthContextFunctions from '../types/AuthContextFunctions';
import { AuthContextState } from '../types/AuthContextState';
import User from '../types/User';
import SupabaseAuthService, {
  SignInCredentials,
  SignUpCredentials,
} from '../services/SupabaseAuthService';
import supabase from '../lib/supabaseClient';

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
  const [loading, setLoading] = useState(true);

  // Legacy auth check
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
      account: account?.id,
      role: role?.name,
      permissions:
        role?.permissions?.map((permission: any) => permission.name) || [],
    };

    return _userDetails;
  };

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setLoading(true);

      // Sign in with Supabase
      const { session } =
        await SupabaseAuthService.signInWithPassword(credentials);

      if (!session) {
        throw new Error('No session returned from Supabase');
      }

      // Store the Supabase access token
      Storage.setAuthToken(session.access_token);
      Storage.setAuthenticated(true);

      // Use the Supabase API to get user details from our custom backend
      try {
        const response = await apolloClient.query({
          query: QUERY_GET_ME,
          context: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        });

        const userDetails = response.data.me;
        const _userDetails = formatUserDetails(userDetails);
        setUserDetails(_userDetails);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }

      // Update auth state
      dispatch({
        type: AuthContextActionType.IS_AUTHENTICATED,
        payload: true,
      });

      return session;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setLoading(true);
      const { session } = await SupabaseAuthService.signUp(credentials);

      if (session) {
        // If auto-confirmation is enabled, handle like sign in
        Storage.setAuthToken(session.access_token);
        Storage.setAuthenticated(true);

        dispatch({
          type: AuthContextActionType.IS_AUTHENTICATED,
          payload: true,
        });
      }

      return session;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await SupabaseAuthService.signOut();
      Storage.flush();

      dispatch({
        type: AuthContextActionType.SIGN_OUT,
      });
    } finally {
      setLoading(false);
    }
  };

  const setUserDetails = (userDetails: User) => {
    dispatch({
      type: AuthContextActionType.SET_USER_DETAILS,
      payload: userDetails,
    });

    Storage.setUserDetails(userDetails);
  };

  const getUserDetails = () => authState.userDetails;

  // Check auth state on load and setup auth state change listener
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);

        // Get current session
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          // Session exists, get user details from backend
          Storage.setAuthToken(data.session.access_token);
          Storage.setAuthenticated(true);

          try {
            const response = await apolloClient.query({
              query: QUERY_GET_ME,
              context: {
                headers: {
                  Authorization: `Bearer ${data.session.access_token}`,
                },
              },
            });

            const userDetails = response.data.me;
            const _userDetails = formatUserDetails(userDetails);
            setUserDetails(_userDetails);

            dispatch({
              type: AuthContextActionType.IS_AUTHENTICATED,
              payload: true,
            });
          } catch (error) {
            console.error('Failed to fetch user details:', error);
            // If we can't get user details, sign out
            await signOut();
          }
        } else {
          // No session, make sure we're signed out
          Storage.flush();
          dispatch({
            type: AuthContextActionType.IS_AUTHENTICATED,
            payload: false,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        Storage.flush();
        dispatch({
          type: AuthContextActionType.IS_AUTHENTICATED,
          payload: false,
        });
      } finally {
        setLoading(false);
      }
    };

    // Check auth status when component mounts
    checkAuthStatus();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session) {
          Storage.setAuthToken(session.access_token);
          Storage.setAuthenticated(true);

          try {
            const response = await apolloClient.query({
              query: QUERY_GET_ME,
              context: {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              },
            });

            const userDetails = response.data.me;
            const _userDetails = formatUserDetails(userDetails);
            setUserDetails(_userDetails);

            dispatch({
              type: AuthContextActionType.IS_AUTHENTICATED,
              payload: true,
            });
          } catch (error) {
            console.error('Failed to fetch user details:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          Storage.flush();
          dispatch({
            type: AuthContextActionType.SIGN_OUT,
          });
        }
      },
    );

    // Clean up the listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const initialContext: any = useCallback(
    () => ({
      ...authState,
      signIn,
      signUp,
      signOut,
      getUserDetails,
      loading,
    }),
    [authState, getUserDetails, loading],
  );

  //case is for user who needs a re-sign in (legacy)
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
