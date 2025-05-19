# Google OAuth Implementation Guide

This guide explains how to implement Google OAuth authentication with Supabase in the Zauberstack frontend.

## Overview

When a user authenticates with Google OAuth via Supabase, we need to ensure they're properly registered in our backend system. This involves:

1. Handling the Supabase OAuth flow
2. Checking if the user exists in our backend
3. If not, registering them using the OAuth data

## Implementation

### Step 1: Update AuthCallback Component

Add handling for OAuth users in your AuthCallback component:

```tsx
// components/auth/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { gql, useMutation } from '@apollo/client';
import { Loader } from '@mantine/core';

// GraphQL mutation to register OAuth users
const REGISTER_FROM_OAUTH = gql`
  mutation RegisterFromOAuth($data: CreateUserFromOAuthInput!) {
    registerFromOAuth(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [registerFromOAuth] = useMutation(REGISTER_FROM_OAUTH);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Get user details from Supabase session
            const { user } = session;

            // Check if this is OAuth user
            const isOAuthUser =
              user.app_metadata.provider &&
              user.app_metadata.provider !== 'email';

            if (isOAuthUser) {
              // Get user profile details
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

              // Try to register OAuth user in our backend
              try {
                const { data } = await registerFromOAuth({
                  variables: {
                    data: {
                      email: user.email,
                      firstname:
                        user.user_metadata.full_name?.split(' ')[0] || '',
                      lastname:
                        user.user_metadata.full_name
                          ?.split(' ')
                          .slice(1)
                          .join(' ') || '',
                      avatarUrl: user.user_metadata.avatar_url,
                      provider: user.app_metadata.provider,
                    },
                  },
                });

                // Store tokens and redirect to dashboard
                localStorage.setItem(
                  'accessToken',
                  data.registerFromOAuth.accessToken,
                );
                localStorage.setItem(
                  'refreshToken',
                  data.registerFromOAuth.refreshToken,
                );
                router.push('/dashboard');
              } catch (err) {
                console.error('Failed to register OAuth user:', err);
                setError('Failed to complete registration');
              }
            } else {
              // Handle regular email login as before
              // Existing login flow...
            }
          } catch (err) {
            console.error('Auth callback error:', err);
            setError('Authentication error');
          }
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, registerFromOAuth]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader color="blue" size="xl" />
    </div>
  );
}
```

### Step 2: Update Auth Provider Component

Ensure your Auth context provider properly handles OAuth tokens:

```tsx
// Use your existing Auth provider and add support for OAuth tokens
const AuthProvider = ({ children }) => {
  // Existing auth context code...

  useEffect(() => {
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          // The tokens will be handled in the AuthCallback component
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Rest of your auth provider code...
};
```

### Step 3: Add Google Login Button

Add a button to trigger Google OAuth:

```tsx
// components/auth/GoogleLoginButton.tsx
import { Button } from '@mantine/core';
import { supabase } from '@/lib/supabase';
import { FaGoogle } from 'react-icons/fa';

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <Button
      leftIcon={<FaGoogle />}
      variant="outline"
      fullWidth
      onClick={handleGoogleLogin}
      mb="md"
    >
      Continue with Google
    </Button>
  );
}
```

## Troubleshooting

### Common Issues

1. **Missing Backend Registration**: If users can log in with Google but their data doesn't appear in your backend, check the AuthCallback implementation and verify the registerFromOAuth mutation is working.

2. **Token Storage**: Make sure tokens from OAuth registration are properly stored in localStorage.

3. **Profile Data**: If user profile data (name, avatar) is missing, ensure the Supabase metadata is correctly passed to the backend registration mutation.

## Testing the Implementation

1. Configure Supabase OAuth with Google provider in the Supabase dashboard
2. Set proper redirect URLs in both Supabase and Google developer console
3. Implement the code shown above
4. Test the full flow from Google login to dashboard redirect

If any issues occur, check browser console logs and API responses for specific error messages.
