import { MediaController } from './media.controller';
import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
