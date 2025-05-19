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
  isAuthenticated: false,
  userDetails: Storage.getUserDetails(),
};

const initialAuthContextFunctions: AuthContextFunctions = {
  signIn: async () => Promise.resolve({}),
  signUp: async () => Promise.resolve({}),
  signOut: async () => Promise.resolve(),
  getUserDetails: () => null,
  setUserDetails: () => {},
  loading: false,
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

  const formatUserDetails = (userDetails: any): User | null => {
    if (!userDetails) return null;

    try {
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
    } catch (error) {
      console.error('Error formatting user details:', error);
      return null;
    }
  };

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setLoading(true);

      // Sign in with Supabase - it handles storing the session automatically
      const { session } =
        await SupabaseAuthService.signInWithPassword(credentials);

      if (!session) {
        throw new Error('No session returned from Supabase');
      }

      dispatch({
        type: AuthContextActionType.IS_AUTHENTICATED,
        payload: true,
      });

      // Use the Supabase API to get user details from our custom backend
      // try {
      //   const response = await apolloClient.query({
      //     query: QUERY_GET_ME,
      //     context: {
      //       headers: {
      //         Authorization: `Bearer ${session.access_token}`,
      //       },
      //     },
      //   });

      //   if (response?.data?.me) {
      //     const userDetails = response.data.me;
      //     const _userDetails = formatUserDetails(userDetails);
      //     if (_userDetails) {
      //       setUserDetails(_userDetails);

      //       // Update auth state
      //       dispatch({
      //         type: AuthContextActionType.IS_AUTHENTICATED,
      //         payload: true,
      //       });
      //     }
      //   }
      // } catch (error) {
      //   console.error('Failed to fetch user details:', error);
      //   // Don't update authentication state if we couldn't get user details
      // }

      return session;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setLoading(true);
      // Supabase handles session storage automatically
      const { session } = await SupabaseAuthService.signUp(credentials);

      if (session) {
        // Only if we have a session, try to get user details
        try {
          const response = await apolloClient.query({
            query: QUERY_GET_ME,
            context: {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            },
          });

          if (response?.data?.me) {
            const userDetails = response.data.me;
            const _userDetails = formatUserDetails(userDetails);
            if (_userDetails) {
              setUserDetails(_userDetails);

              // Update auth state only if we have user details
              dispatch({
                type: AuthContextActionType.IS_AUTHENTICATED,
                payload: true,
              });
            }
          }
        } catch (error) {
          console.error('Failed to fetch user details after signup:', error);
        }
      }

      return session;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Supabase signOut clears its own storage
      await SupabaseAuthService.signOut();

      // Clear user details from our storage
      Storage.setUserDetails(null);

      dispatch({
        type: AuthContextActionType.SIGN_OUT,
      });
    } finally {
      setLoading(false);
    }
  };

  const setUserDetails = (userDetails: User) => {
    if (!userDetails) return;

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

        // Check if we're currently in the OAuth callback flow
        const isOAuthCallback =
          window.location.pathname.includes('/auth/callback');
        console.log('Auth check - isOAuthCallback:', isOAuthCallback);

        // Get current session - Supabase handles retrieving from storage
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          dispatch({
            type: AuthContextActionType.IS_AUTHENTICATED,
            payload: true,
          });

          // Session exists, get user details from backend
          try {
            const response = await apolloClient.query({
              query: QUERY_GET_ME,
              context: {
                headers: {
                  Authorization: `Bearer ${data.session.access_token}`,
                },
              },
            });

            if (response?.data?.me) {
              const userDetails = response.data.me;
              const _userDetails = formatUserDetails(userDetails);
              if (_userDetails) {
                setUserDetails(_userDetails);

                dispatch({
                  type: AuthContextActionType.IS_AUTHENTICATED,
                  payload: true,
                });
              } else {
                // If we can't format user details, sign out
                // But skip during OAuth callback to let it create the user

                await signOut();
              }
            } else {
              // If no user details, sign out - unless in OAuth callback flow

              await signOut();
            }
          } catch (error) {
            console.error('Failed to fetch user details:', error);

            // Check if error is due to user not found
            const isUserNotFound = error.graphQLErrors?.some(
              (e) => e.extensions?.code === 'user_not_found',
            );

            // If error is "user not found" and we're in the OAuth callback flow,
            // don't sign out - let the callback create the user
            if (isUserNotFound) {
              console.log(
                'User not found during OAuth callback - this is expected',
              );
            } else {
              // Otherwise sign out
              await signOut();
            }
          }
        } else {
          // No session, make sure we're signed out
          Storage.setUserDetails(null);

          dispatch({
            type: AuthContextActionType.IS_AUTHENTICATED,
            payload: false,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        Storage.setUserDetails(null);

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
          dispatch({
            type: AuthContextActionType.IS_AUTHENTICATED,
            payload: true,
          });

          try {
            const response = await apolloClient.query({
              query: QUERY_GET_ME,
              context: {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              },
            });

            if (response?.data?.me) {
              const userDetails = response.data.me;
              const _userDetails = formatUserDetails(userDetails);
              if (_userDetails) {
                setUserDetails(_userDetails);
              }
            }
          } catch (error) {
            console.error('Failed to fetch user details:', error);
            // Don't update auth state if we can't get user details
          }
        } else if (event === 'SIGNED_OUT') {
          Storage.setUserDetails(null);

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

  // Use useMemo instead of useCallback to prevent infinite renders
  const contextValue = React.useMemo(
    () => ({
      ...authState,
      signIn,
      signUp,
      signOut,
      getUserDetails,
      setUserDetails,
      loading,
    }),
    [authState, loading],
  );

  //case is for user who needs a re-sign in (legacy)
  if (authState.isAuthenticated && data?.reSignIn) {
    signOut();
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const AuthContext = React.createContext(initialAuthenticationContext);
