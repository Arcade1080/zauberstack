# Supabase Integration Guide

This project has been configured to use Supabase for authentication and storage. Follow these steps to set up your Supabase project.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up for an account
2. Create a new project
3. Give your project a name and set a secure database password
4. Choose a region close to your users
5. Wait for your database to be provisioned (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

From your Supabase project dashboard:

1. Go to Project Settings -> API
2. Copy the following values:
   - Project URL (`https://your-project-ref.supabase.co`)
   - API Keys:
     - `anon` public key
     - `service_role` secret key (keep this secure!)

## Step 3: Configure Your Environment Variables

Add the following environment variables to your `.env` file in the `/packages/api` directory:

```
# Supabase
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-role-key"

# Database (Direct Connection)
DATABASE_URL="postgresql://postgres:your-db-password@your-project-ref.supabase.co:5432/postgres"
```

## Step 4: Set Up Storage Buckets

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `media`
3. Set the following permissions:
   - Enable public bucket access
   - Policy for Authenticated Users: Create, Select, Update, Delete
   - Policy for Anonymous Users: Select only

## Step 5: Configure Authentication

1. Go to Authentication -> Settings
2. Enable Email/Password provider
3. Configure any additional auth providers as needed (Google, GitHub, etc.)
   - For detailed instructions on setting up OAuth providers, see [SUPABASE_AUTH_PROVIDERS.md](./SUPABASE_AUTH_PROVIDERS.md)

## Step 6: Database Configuration

The database schema is managed by Prisma. Run the following commands to set up your database:

```bash
cd packages/api
npx prisma migrate deploy
npx prisma db seed
```

## Step 7: Testing Your Integration

You can test that everything is working by:

1. Starting the API server: `yarn api`
2. Creating a new user through the API
3. Testing file uploads and authentication

## Security Considerations

- Always keep your `service_role` key secure and never expose it in client-side code
- Use Row Level Security (RLS) policies in Supabase to restrict access to data
- Regularly review and rotate API keys

For more information, refer to the [Supabase documentation](https://supabase.io/docs).
