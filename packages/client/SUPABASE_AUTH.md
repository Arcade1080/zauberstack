# Supabase Authentication Integration

This document explains how Supabase authentication has been integrated with the client application.

## Overview

The client now uses Supabase for authentication while maintaining compatibility with the existing backend API. The implementation:

1. Uses Supabase for authentication (login, signup, password reset)
2. Stores the Supabase access token in localStorage
3. Uses the Supabase token for API requests to the backend
4. Maintains session state with Supabase's built-in session management

## Files Modified

- `src/lib/supabaseClient.ts` - Supabase client instance
- `src/services/SupabaseAuthService.ts` - Service for Supabase auth operations
- `src/context/AuthContextProvider.tsx` - Updated to use Supabase auth
- `src/hooks/useLoginMutation.tsx` - Updated login hook
- `src/hooks/useSignUpMutation.tsx` - Updated signup hook
- `src/types/AuthContextFunctions.ts` - Updated auth context types

## Environment Variables

Add these to your `.env` file:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Authentication Flow

1. **Login**:

   - User enters credentials
   - Supabase authenticates and returns a session
   - Session token is stored and used for API requests

2. **Signup**:

   - User creates account with Supabase
   - After successful signup, organization is created in backend
   - User is automatically logged in if auto-confirmation is enabled

3. **Session Management**:
   - Supabase handles session refresh automatically
   - Auth state listener updates UI when session changes
   - Session is checked on app load

## Backend Integration

The client still communicates with the backend API, but now:

1. Uses Supabase tokens for authentication
2. Sends the Supabase token in the Authorization header
3. Backend validates the Supabase token

## Error Handling

- Authentication errors from Supabase are caught and displayed
- Network errors during authentication are handled gracefully
- Session expiration is handled by Supabase's auto-refresh

## Testing Authentication

To test the authentication flow:

1. Create a Supabase project and configure environment variables
2. Try logging in with existing credentials
3. Try signing up a new user
4. Test session persistence by refreshing the page
5. Test sign out functionality
