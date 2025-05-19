import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SupabaseAuthService {
  constructor(
    private supabaseService: SupabaseService,
    private prismaService: PrismaService,
  ) {}

  async signUp(email: string, password: string, userData: Partial<User>) {
    // First create the user in Supabase
    const { data, error } = await this.supabaseService.getClient().auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // If successful, create/update the user in our Prisma database
    const user = await this.prismaService.user.upsert({
      where: { email },
      update: {
        ...userData,
        supabaseId: data.user.id,
      },
      create: {
        email,
        password: 'supabase-managed', // We don't store the actual password since Supabase handles it
        supabaseId: data.user.id,
        ...userData,
        // Include required fields for role and account
        roleId: userData.roleId,
        accountId: userData.accountId,
      },
    });

    return { supabaseUser: data.user, user };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }

    // Get the user from our database
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    return { supabaseSession: data.session, user };
  }

  async signOut(token: string) {
    const { error } = await this.supabaseService.getClient().auth.signOut();

    if (error) {
      throw error;
    }

    return true;
  }

  async resetPassword(email: string) {
    const { error } = await this.supabaseService
      .getClient()
      .auth.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    return true;
  }

  async getCurrentUser(token: string) {
    // Set the session in the Supabase client
    const {
      data: { user },
      error,
    } = await this.supabaseService.getClient().auth.getUser(token);

    if (error || !user) {
      throw error || new Error('User not found');
    }

    // Get the user from our database, preferring supabaseId but falling back to email
    const dbUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ supabaseId: user.id }, { email: user.email }],
      },
    });

    return dbUser;
  }

  /**
   * Delete a Supabase user by ID
   * This requires admin privileges (using the service key)
   */
  async deleteSupabaseUser(supabaseUserId: string): Promise<boolean> {
    if (!supabaseUserId) {
      throw new Error('Supabase user ID is required');
    }

    try {
      const { error } = await this.supabaseService
        .getClient()
        .auth.admin.deleteUser(supabaseUserId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting Supabase user:', error);
      throw error;
    }
  }
}
