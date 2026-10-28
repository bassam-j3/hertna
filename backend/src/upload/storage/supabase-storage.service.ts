import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService implements StorageService {
  private supabase?: SupabaseClient;
  private readonly logger = new Logger(SupabaseStorageService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase credentials missing — storage will use local fallback');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase storage initialized');
  }

  async upload(fileBuffer: Buffer, bucket: string, destinationKey: string, mimetype: string): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase storage not initialized — use local storage fallback');
    }
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(destinationKey, fileBuffer, {
        contentType: mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(destinationKey);

    return publicUrlData.publicUrl;
  }
}
