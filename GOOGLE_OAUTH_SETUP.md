# Setting Up Google OAuth for Supabase

This guide will walk you through the process of setting up Google OAuth credentials for your Supabase project.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Navigate to "APIs & Services" > "Credentials"

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace account)
3. Fill in the required fields:
   - App name: Your application name
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue"
5. Add the necessary scopes:
   - `email`
   - `profile`
   - `openid`
6. Click "Save and Continue"
7. Add test users if needed, then click "Save and Continue"
8. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth Client ID

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name for your client
5. Add the following Authorized JavaScript origins:
   - `https://your-supabase-project.supabase.co` (replace with your actual Supabase URL)
   - Your local development URL (e.g., `http://localhost:5173`)
6. Add the following Authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback` (replace with your actual Supabase URL)
   - Your local callback URL (e.g., `http://localhost:5173/auth/callback`)
7. Click "Create"
8. Note down the "Client ID" and "Client Secret" - you'll need these for Supabase

## Step 4: Configure Supabase Auth Settings

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click on it
4. Toggle the "Enable" switch
5. Enter the Client ID and Client Secret from Google Cloud Console
6. Save the changes

Now your Supabase project is configured to use Google for authentication.
