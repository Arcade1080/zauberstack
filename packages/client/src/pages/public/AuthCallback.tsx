import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import { Alert, Center, Loader, Stack, Text } from '@mantine/core';
import { gql, useMutation } from '@apollo/client';
import apolloClient, { RESIGN_IN } from '../../lib/apolloClient';
import { QUERY_GET_ME } from '../../api/queries';

// Mutation to create a user from OAuth data
const CREATE_USER_FROM_OAUTH = gql`
  mutation CreateUserFromOAuth($input: CreateUserFromOAuthInput!) {
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
        console.log('sessionData', sessionData);
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
            console.log('response', response);
            if (!response?.data?.me) {
              // User doesn't exist in your system but exists in Supabase
              // First, get Google user profile data from Supabase
              console.log('no user found');
              setStatusMessage('Creating new account...');
              const { data: userData } = await supabase.auth.getUser();
              const googleData = userData?.user?.user_metadata;
              // Create user in your database with data from Google profile
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
            }
            // Redirect to dashboard after successful sign-in or creation
            navigate('/');
          } catch (err: any) {
            console.log('err', err);
            console.error('Error processing user:', err);
            setError(`Failed to create or retrieve account: ${err.message}`);
            setTimeout(() => navigate('/sign-in'), 3000);
          }
        } else {
          // No session found
          console.log('No session found');
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/sign-in'), 3000);
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
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
