import { Button } from '@mantine/core';
import { useState } from 'react';
import { GoogleIcon } from './GoogleIcon';
import SupabaseAuthService from '../../services/SupabaseAuthService';

interface GoogleSignInButtonProps {
  fullWidth?: boolean;
}

const GoogleSignInButton = ({ fullWidth = false }: GoogleSignInButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await SupabaseAuthService.signInWithGoogle();
      // The redirect happens automatically from Supabase
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoading(false);
    }
  };

  return (
    <Button
      leftSection={<GoogleIcon />}
      variant="default"
      fullWidth={fullWidth}
      onClick={handleGoogleSignIn}
      loading={loading}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
