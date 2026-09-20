import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { StorageService } from './storage/storage.interface';
import { LocalStorageService } from './storage/local-storage.service';
import { SupabaseStorageService } from './storage/supabase-storage.service';
import { FallbackStorageService } from './storage/fallback-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    LocalStorageService,
    SupabaseStorageService,
    {
      provide: StorageService,
      useFactory: (configService: ConfigService, local: LocalStorageService, supabase: SupabaseStorageService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || configService.get<string>('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
          return local;
        }
        return new FallbackStorageService(supabase, local);
      },
      inject: [ConfigService, LocalStorageService, SupabaseStorageService],
    },
    UploadService,
  ],
  exports: [UploadService],
})
export class UploadModule {}
