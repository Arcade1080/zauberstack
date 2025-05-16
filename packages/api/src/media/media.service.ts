import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MediaService {
  private readonly MEDIA_BUCKET = 'media';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async create(file: Express.Multer.File, userId?: string) {
    const filename = this.generateUniqueName(file.originalname);
    const path = `${userId || 'public'}/${filename}`;

    // Upload to Supabase storage
    await this.supabaseService.uploadFile(
      this.MEDIA_BUCKET,
      path,
      file.buffer,
      {
        contentType: file.mimetype,
        upsert: true,
      },
    );

    // Get public URL
    const { publicUrl } = await this.supabaseService.getFileUrl(
      this.MEDIA_BUCKET,
      path,
    );

    // Save to database
    const media = await this.prisma.media.create({
      data: {
        filename,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path,
        url: publicUrl,
        user: userId ? { connect: { id: userId } } : undefined,
      },
    });

    return media;
  }

  async findOne(id: string) {
    return this.prisma.media.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new Error('Media not found');
    }

    // Delete from Supabase storage
    if (media.path) {
      await this.supabaseService.removeFile(this.MEDIA_BUCKET, media.path);
    }

    // Delete from database
    await this.prisma.media.delete({
      where: { id },
    });

    return { success: true };
  }

  private generateUniqueName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
  }

  private getFileUrl(path: string) {
    return `${this.configService.get(
      'FILE_SERVER_URL',
      'http://localhost:4000',
    )}/${path}`;
  }
}
