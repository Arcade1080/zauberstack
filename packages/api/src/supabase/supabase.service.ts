import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase credentials not found in environment variables',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Storage operations
  async uploadFile(bucket: string, path: string, fileData: any, options?: any) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, fileData, options);

    if (error) throw error;
    return data;
  }

  async getFileUrl(bucket: string, path: string) {
    const { data } = await this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data;
  }

  async removeFile(bucket: string, path: string) {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
    return true;
  }
}
