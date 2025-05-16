import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthService } from './supabase-auth.service';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseService, SupabaseAuthService],
  exports: [SupabaseService, SupabaseAuthService],
})
export class SupabaseModule {}
