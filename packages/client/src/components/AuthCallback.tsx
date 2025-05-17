import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { Alert, Center, Loader, Stack, Text } from '@mantine/core';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        console.log('Supabase user:', data?.session?.user);

        if (error) {
          throw error;
        }

        if (data?.session) {
          // Debug: Log if the user is actually authenticated with Supabase
          console.log('Supabase user:', data?.session?.user);
          // Redirect to dashboard or home page
          navigate('/dashboard');
        } else {
          // No session found
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
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
            <Text>Completing authentication, please wait...</Text>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default AuthCallback;
