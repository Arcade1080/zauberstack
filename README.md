# Zauberstack with Supabase Integration

Follow these instructions to get started
https://docs.zauberstack.com/

## Supabase Integration

This project has been configured to use Supabase for authentication and storage. For detailed setup instructions, see [SUPABASE_SETUP.md](packages/api/SUPABASE_SETUP.md).

### Key Features

- **Authentication**: User authentication is handled by Supabase with a fallback to the local authentication system
- **Storage**: File uploads are stored in Supabase Storage buckets
- **Database**: PostgreSQL database provided by Supabase is used with Prisma ORM

### Getting Started with Supabase

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Configure your environment variables with Supabase credentials
3. Run database migrations with `npx prisma migrate deploy`
4. Start the application with `yarn start`
