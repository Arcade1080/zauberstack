# Environment Variables Documentation

This document provides guidance on setting up and maintaining the environment variables for the API.

## Improved Structure

The environment variables have been reorganized into logical sections:

1. **Authentication & Security**: JWT tokens and security-related settings
2. **Supabase Configuration**: Supabase API keys and connection details
3. **Database Connection**: PostgreSQL connection strings and parameters
4. **Application URLs**: Frontend and backend endpoint configuration
5. **Email Settings**: SMTP server configuration for sending emails
6. **Payment Integration**: Stripe API keys and settings
7. **OAuth & Social Login**: Configuration for third-party authentication
8. **File Storage**: Settings for file storage (local or S3)
9. **Application Settings**: General application configuration

## How to Update Your Files

Two template files have been created for reference:

- `env-example-improved.txt`: An improved `.env.example` file
- `env-secure-template.txt`: A template for your actual `.env` file

To update your environment files:

1. Replace your current `.env.example` file:

   ```bash
   cp env-example-improved.txt .env.example
   ```

2. Create a new secure `.env` file based on the template:

   ```bash
   cp env-secure-template.txt .env
   ```

3. Update the `.env` file with your actual credentials and configuration.

## Security Best Practices

1. **Never commit your actual `.env` file to version control**
2. Use long, random strings for JWT secrets (you can generate them with `openssl rand -hex 32`)
3. Keep your Supabase Service Key secure and never expose it in client-side code
4. Regularly rotate API keys and credentials
5. Use environment-specific variables for different deployments (dev, staging, production)

## Required Variables for Supabase Integration

The following variables are required for the Supabase integration:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@your-project-ref.pooler.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:password@your-project-ref.supabase.co:5432/postgres
```

The `DATABASE_URL` uses connection pooling for better performance, while `DIRECT_URL` is needed for database migrations.

## Environment-Specific Configuration

Consider creating different environment files for different environments:

- `.env.development`
- `.env.test`
- `.env.production`

Then load the appropriate one based on the `NODE_ENV` setting.
