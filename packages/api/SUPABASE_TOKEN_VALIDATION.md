# Supabase Token Validation Guide

This guide explains how to use Supabase token validation in your API.

## Overview

The backend has been configured to validate Supabase JWT tokens, allowing seamless integration between Supabase Authentication and your NestJS API.

## Setup

### 1. Environment Variables

First, ensure the following environment variable is set:

```
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-dashboard
```

You can find this JWT secret in your Supabase dashboard:

1. Go to your project in Supabase
2. Navigate to Project Settings > API
3. Scroll down to "JWT Settings"
4. Copy the "JWT Secret"

### 2. Required Files

The implementation consists of:

- `src/auth/supabase-jwt.strategy.ts`: The Passport strategy for validating Supabase JWTs
- `src/auth/guards/supabase-auth.guard.ts`: The guard to protect routes
- `src/auth/decorators/get-user.decorator.ts`: A decorator to access the authenticated user

All these files have been created and configured.

## How It Works

1. When a request comes in with a Supabase JWT token in the Authorization header:

   - The `SupabaseJwtStrategy` validates the token using the JWT secret
   - If valid, it finds the user in the database using the `supabaseId` field
   - The user object is attached to the request

2. The `SupabaseAuthGuard` protects routes by requiring a valid token

   - If no valid token is present, a 401 Unauthorized response is returned
   - If a valid token is present, the route handler executes

3. The `GetUser` decorator extracts the authenticated user from the request
   - This gives easy access to the user in your resolvers and controllers

## Using Supabase Authentication

### In GraphQL Resolvers

```typescript
import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Resolver()
export class YourResolver {
  @Query(() => String)
  @UseGuards(SupabaseAuthGuard)
  async protectedQuery(@GetUser() user: any) {
    // Access the authenticated user
    return `Hello, ${user.email}!`;
  }
}
```

### In REST Controllers

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('your-route')
export class YourController {
  @Get()
  @UseGuards(SupabaseAuthGuard)
  async getResource(@GetUser() user: any) {
    // Access the authenticated user
    return { userId: user.id };
  }
}
```

## Testing

To test Supabase authentication:

1. Generate a valid token by authenticating a user in your client application
2. Use the token in the Authorization header with Bearer prefix:
   ```
   Authorization: Bearer your-supabase-token
   ```
3. Make a request to a protected endpoint
4. If the token is valid and the user exists in your database, the request should succeed

## Troubleshooting

### Common Issues

1. **Invalid JWT Secret**: Verify that the `SUPABASE_JWT_SECRET` in your .env file matches the JWT secret in your Supabase dashboard.

2. **User Not Found**: The strategy looks for a user with the `supabaseId` matching the `sub` claim in the token. Make sure:

   - The user exists in your database
   - The `supabaseId` field is set correctly

3. **Token Expired**: Supabase tokens expire. The client should refresh tokens automatically, but check the token expiration if you're having issues.

4. **CORS Issues**: If using from a browser, ensure your CORS settings allow the necessary headers.

### Debugging

To debug token validation:

1. Add logging to your `SupabaseJwtStrategy`:

   ```typescript
   console.log('Token payload:', payload);
   console.log('Looking for user with supabaseId:', payload.sub);
   ```

2. Check your database to verify user records have the correct `supabaseId`.

## Security Considerations

- Keep your `SUPABASE_JWT_SECRET` secure and never expose it in client-side code
- Regularly audit your protected routes to ensure proper authentication
- Consider adding role-based access control for more fine-grained permissions
