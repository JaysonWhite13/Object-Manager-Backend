import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Express } from 'express';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('SUPABASE_BUCKET')!;
    this.supabase = createClient(
      this.config.get<string>('SUPABASE_URL')!,
      this.config.get<string>('SUPABASE_SERVICE_KEY')!
    );
  }

 async uploadFile(file: Express.Multer.File): Promise<string> {
  const fileName = `${Date.now()}-${file.originalname}`;
  const { error } = await this.supabase.storage
    .from(this.bucket)
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });

  if (error) throw error;

  const { data } = this.supabase
    .storage
    .from(this.bucket)
    .getPublicUrl(fileName);

  return data.publicUrl; // ✅ doit être une string
}

  async deleteFile(fileName: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([fileName]);

    if (error) throw error;
  }

  async listFiles(): Promise<string[]> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .list();

    if (error) throw error;

    return data.map(f => f.name);
  }
}