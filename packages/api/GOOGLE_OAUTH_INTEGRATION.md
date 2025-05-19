# Google OAuth Integration for API

This document describes how Google OAuth is integrated into the Zauberstack API.

## Overview

When users authenticate with Google OAuth through Supabase on the frontend, we need to:

1. Register the user in our backend database if they don't exist yet
2. Provide authentication tokens for API access
3. Create necessary account and role associations

## Backend Components

### GraphQL Schema

The backend exposes a GraphQL mutation for registering OAuth users:

```graphql
# User from OAuth Input
input CreateUserFromOAuthInput {
  email: String!
  firstname: String
  lastname: String
  avatarUrl: String
  provider: String!
}

# Mutation type
type Mutation {
  registerFromOAuth(data: CreateUserFromOAuthInput!): Token!
}
```

### Service Implementation

The `UserService` includes a method to create users from OAuth data:

```typescript
async createUserFromOAuth(input: CreateUserFromOAuthInput): Promise<User> {
  // Check if user exists, if so return existing user
  // Otherwise create a new account and user
  // Handle profile data like avatar
  // Return the user
}
```

### Resolver Implementation

The `UserResolver` exposes the GraphQL mutation:

```typescript
@Public()
@Mutation(() => Token)
async registerFromOAuth(
  @Args('data') userData: CreateUserFromOAuthInput,
) {
  // Create user with OAuth data
  // Generate authentication tokens
  // Return tokens to client
}
```

## OAuth User Creation Process

1. Check if a user with the provided email already exists
2. If user exists, return the existing user
3. If user doesn't exist:
   - Create a new account
   - Create a new user associated with that account
   - Set user as account owner
   - Handle avatar if provided
   - Create necessary role associations
4. Generate and return JWT tokens

## Security Considerations

1. The `registerFromOAuth` mutation is marked with `@Public()` to allow unauthenticated access
2. We trust Supabase's authentication and use the email from the Supabase session
3. OAuth users don't have traditional passwords but we generate a random one to satisfy database requirements
4. We handle user data and permissions appropriately

## Integration with Supabase

1. Supabase handles the OAuth provider authentication (Google)
2. After successful Supabase authentication, frontend calls our API to register/login the user
3. We use Supabase's user data to create or retrieve the user in our system
4. JWT tokens from our system are used for API authorization

## Testing

To test this integration:

1. Configure Google OAuth provider in Supabase
2. Ensure frontend correctly calls the `registerFromOAuth` mutation after Google login
3. Verify user creation and account association in the database
4. Test that returned tokens allow access to protected API resources

## Troubleshooting

Common issues and solutions:

1. **User Not Created**: Check Prisma logs for transaction errors
2. **Missing Role**: Ensure default 'user' role exists in the database
3. **Token Generation Failure**: Verify JWT configuration and secrets
