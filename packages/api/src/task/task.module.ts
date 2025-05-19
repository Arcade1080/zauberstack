import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PasswordService } from '../auth/password.service';
import { MailModule } from '../mail/mail.module';
import { MediaModule } from '../media/media.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { UserService } from '../user/user.service';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [MailModule, AuthModule, MediaModule, SupabaseModule],
  providers: [TaskService, TaskResolver, UserService, PasswordService],
})
export class TaskModule {}
