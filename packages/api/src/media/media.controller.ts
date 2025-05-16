import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RequiredPermissions } from '../auth/decorators/required-permissions.decorator';
import { Permission } from '../auth/enums/permission';
import { CurrentUser } from '../user/decorators/user.decorator';
import { User } from '../user/graphql/models/user.model';
import { MediaService } from './media.service';

const supportedFiles = ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'webm'];

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @RequiredPermissions(Permission.Upload_Media)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const extension = extname(file.originalname)
          .split('.')
          .pop()
          .toLowerCase();
        if (!supportedFiles.includes(extension)) {
          return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  // @Public()
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body('collection') collection?: string,
  ) {
    const createdMedia = await this.mediaService.create(file, user.id);
    return createdMedia;
  }

  // @Get()
  // @RequiredPermissions(Permission.View_Media)
  // async getMedia(
  //   @CurrentUser() user: any,
  //   @Query('collection') collection?: string,
  // ) {
  //   return this.mediaService.getMediaByUser(user.id, collection);
  // }

  @Delete(':id')
  @RequiredPermissions(Permission.Delete_Media)
  async deleteMedia(@Param('id') id: string, @CurrentUser() user: any) {
    await this.mediaService.delete(id);
    return { success: true };
  }
}
