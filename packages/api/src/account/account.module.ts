import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from '../auth/auth.service';
import { MediaModule } from '../media/media.module';
import { StripeModule } from '../stripe/stripe.module';
import { MailModule } from './../mail/mail.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [AuthModule, MailModule, StripeModule, MediaModule, SupabaseModule],
  providers: [
    AccountService,
    UserService,
    AuthService,
    AccountResolver,
    PrismaService,
  ],
})
export class AccountModule {}
