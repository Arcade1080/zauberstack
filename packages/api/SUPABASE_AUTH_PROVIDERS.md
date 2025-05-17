# Setting Up OAuth Providers in Supabase

This guide explains how to configure OAuth providers (like Google) for authentication in your Zauberstack project using Supabase.

## Google OAuth Integration

Follow these steps to set up Google as an OAuth provider:

### Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Configure the OAuth consent screen:
   - Set user type (External or Internal)
   - Add app name, support email, and developer contact information
   - Add scopes: `email`, `profile`, `openid`
5. Create OAuth client ID:
   - Select "Web application" as the application type
   - Add authorized JavaScript origins:
     - `https://your-supabase-project.supabase.co`
     - Your local development URL (e.g., `http://localhost:5173`)
   - Add authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`
     - Your local callback URL (e.g., `http://localhost:5173/auth/callback`)
6. Note down the Client ID and Client Secret

### Step 2: Configure Supabase Auth Settings

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click on it
4. Enable Google authentication
5. Enter the Client ID and Client Secret from Google Cloud Console
6. Save the changes

### Step 3: Update Environment Variables (if needed)

If you want to customize redirect URLs or other settings, you can add these to your environment variables:

```
# For the client
VITE_SUPABASE_REDIRECT_URL=http://localhost:5173/auth/callback

# For the API (if needed)
SUPABASE_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Testing Google Authentication

After setting up Google authentication:

1. Go to your application's sign-in page
2. Click the "Continue with Google" button
3. Complete the Google authentication flow
4. You should be redirected back to your application and signed in

## Troubleshooting

If you encounter issues with Google authentication:

1. **Redirect URI Mismatch**: Ensure the redirect URI in Google Cloud Console exactly matches the one Supabase is using
2. **CORS Issues**: Check that your application's domain is added to the allowed origins in Google Cloud Console
3. **Scopes**: Make sure the required scopes are added to your project
4. **Supabase Settings**: Verify that the Client ID and Client Secret in Supabase match those from Google Cloud Console
5. **Check Logs**: Review the Supabase authentication logs for any error messages

## Adding Other OAuth Providers

Supabase supports many other OAuth providers such as GitHub, Facebook, Twitter, and more. The setup process is similar:

1. Obtain credentials from the provider's developer console
2. Configure the provider in Supabase Authentication settings
3. Update your application to include the sign-in button for the provider

For more information, refer to the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth).
