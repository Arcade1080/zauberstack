import { User } from '@supabase/supabase-js';
import supabase from '../lib/supabaseClient';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  firstname?: string;
  lastname?: string;
}

export interface ResetPasswordData {
  password: string;
}

class SupabaseAuthService {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(credentials: SignInCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          firstname: credentials.firstname,
          lastname: credentials.lastname,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return true;
    } catch (error) {
      // Ignore AuthSessionMissingError, but rethrow others
      if (error?.message && error.message.includes('Auth session missing')) {
        // No session to sign out, safe to ignore
        return true;
      }
      throw error;
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return data.user;
  }

  /**
   * Send a password reset email
   */
  async resetPasswordForEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    return true;
  }

  /**
   * Update password for authenticated user
   */
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    return true;
  }

  /**
   * Get session data
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  }

  /**
   * Sign in with magic link (passwordless)
   */
  async signInWithOtp(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      throw error;
    }

    return true;
  }

  /**
   * Set up auth state change listener
   */
  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default new SupabaseAuthService();
