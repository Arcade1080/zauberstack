import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Center, Loader, Stack, Text } from '@mantine/core';
import { gql, useMutation } from '@apollo/client';
import supabase from '../../lib/supabaseClient';
import apolloClient, { RESIGN_IN } from '../../lib/apolloClient';
import { QUERY_GET_ME } from '../../api/queries';

// Mutation to create a user from OAuth data
const CREATE_USER_FROM_OAUTH = gql`
  mutation CreateUserFromOAuth($input: OAuthUserInput!) {
    createUserFromOAuth(data: $input) {
      id
      email
      firstname
      lastname
      avatar
    }
  }
`;

function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Completing authentication, please wait...',
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Process the OAuth callback
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (sessionData?.session) {
          try {
            setStatusMessage('Verifying account...');
            // Try to fetch the user from your database
            const response = await apolloClient.query({
              query: QUERY_GET_ME,
              context: {
                headers: {
                  Authorization: `Bearer ${sessionData.session.access_token}`,
                },
              },
            });
            console.log('existing user', response);

            // User exists, redirect to dashboard
            navigate('/');
          } catch (err: any) {
            console.error('Error processing user:', err);

            // Check if this is a USER_NOT_FOUND error
            const isUserNotFound = err.graphQLErrors?.some(
              (e: any) => e.extensions?.code === 'user_not_found',
            );

            if (isUserNotFound) {
              // User doesn't exist in database but exists in Supabase

              setStatusMessage('Creating new account...');

              // Get user data from Supabase
              const { data: userData } = await supabase.auth.getUser();

              const googleData = userData?.user?.user_metadata;

              // Create user in database with data from Google profile
              await apolloClient.mutate({
                mutation: CREATE_USER_FROM_OAUTH,
                variables: {
                  input: {
                    email: userData?.user?.email,
                    firstname: googleData?.full_name?.split(' ')[0] || '',
                    lastname:
                      googleData?.full_name?.split(' ').slice(1).join(' ') ||
                      '',
                    avatar: googleData?.avatar_url,
                    supabaseId: userData?.user?.id,
                  },
                },
                context: {
                  headers: {
                    Authorization: `Bearer ${sessionData.session.access_token}`,
                  },
                },
              });

              setStatusMessage('Account created successfully!');
              // Redirect to dashboard after creating account
              navigate('/');
            } else {
              // Other error occurred
              console.log('Error details:', err.graphQLErrors);
              setError(`Failed to authenticate: ${err.message}`);
            }
          }
        } else {
          // No session found
          console.log('No session found');
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/sign-in'), 3000);
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        console.log('Error details:', err.graphQLErrors);
        setError(err.message || 'Authentication failed. Please try again.');
        setTimeout(() => navigate('/sign-in'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <Center style={{ height: '100vh' }}>
      <Stack align="center">
        {error ? (
          <Alert color="red" title="Authentication Error">
            {error}
          </Alert>
        ) : (
          <>
            <Loader size="lg" />
            <Text>{statusMessage}</Text>
          </>
        )}
      </Stack>
    </Center>
  );
}

export default AuthCallback;
