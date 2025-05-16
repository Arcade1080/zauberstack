import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Resolver('Example')
export class ExampleResolver {
  // Protect a query with Supabase authentication
  @Query(() => String)
  @UseGuards(SupabaseAuthGuard)
  async protectedQuery(@GetUser() user: any) {
    // This query is protected and will only execute if a valid Supabase token is provided
    // The user parameter will contain the authenticated user data from Supabase
    return `Hello, ${user.email}! This query is protected by Supabase authentication.`;
  }

  // Protect a mutation with Supabase authentication
  @Mutation(() => Boolean)
  @UseGuards(SupabaseAuthGuard)
  async protectedMutation(@GetUser() user: any, @Args('data') data: any) {
    // This mutation is protected and will only execute if a valid Supabase token is provided
    console.log(`User ${user.email} is performing a mutation with data:`, data);
    return true;
  }
}

// NOTE: This is just an example file and is not included in the application.
// To use Supabase authentication in your resolvers, copy this pattern.
