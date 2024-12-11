import { MediaController } from './media.controller';
import { Module } from '@nestjs/common';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
