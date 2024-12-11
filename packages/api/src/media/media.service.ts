import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createMedia(
    file: Express.Multer.File,
    userId: string,
    collection?: string,
  ) {
    const { originalname, mimetype, filename, size, path } = file;

    const createdMedia = await this.prisma.media.create({
      data: {
        filename,
        originalFilename: originalname,
        mimeType: mimetype,
        size,
        path,
        url: this.getFileUrl(path),
        collection,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return createdMedia;
  }

  // async getMediaByUser(userId: string, collection?: string) {
  //   return this.prisma.media.findMany({
  //     where: {
  //       userId,
  //       collection,
  //     },
  //   });
  // }

  async deleteMedia(id: string, userId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    // if (!media || media.userId !== userId) {
    //   throw new Error('Media not found or unauthorized');
    // }

    await this.prisma.media.delete({
      where: { id },
    });

    // TODO: Implement file deletion from storage
  }

  private getFileUrl(path: string) {
    return `${this.configService.get(
      'FILE_SERVER_URL',
      'http://localhost:4000',
    )}/${path}`;
  }
}
