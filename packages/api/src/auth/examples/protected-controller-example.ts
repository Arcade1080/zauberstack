import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('example')
export class ExampleController {
  // Protect a GET endpoint with Supabase authentication
  @Get()
  @UseGuards(SupabaseAuthGuard)
  async getProtectedResource(@GetUser() user: any) {
    // This endpoint is protected and will only execute if a valid Supabase token is provided
    // The user parameter will contain the authenticated user data from Supabase
    return {
      message: `Hello, ${user.email}! This endpoint is protected by Supabase authentication.`,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  // Protect a POST endpoint with Supabase authentication
  @Post()
  @UseGuards(SupabaseAuthGuard)
  async createResource(@GetUser() user: any, @Body() data: any) {
    // This endpoint is protected and will only execute if a valid Supabase token is provided
    console.log(`User ${user.email} is creating a resource with data:`, data);
    return {
      success: true,
      message: 'Resource created successfully',
      userId: user.id,
    };
  }
}

// NOTE: This is just an example file and is not included in the application.
// To use Supabase authentication in your controllers, copy this pattern.
