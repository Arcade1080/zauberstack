import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AuthModule } from './../auth/auth.module';
import { MailModule } from './../mail/mail.module';
import { StripeService } from './../stripe/stripe.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [MailModule, AuthModule, MediaModule, SupabaseModule],
  providers: [UserResolver, UserService, StripeService],
  controllers: [UserController],
})
export class UserModule {}
