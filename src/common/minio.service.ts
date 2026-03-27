import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';

@Injectable()
export class MinioService {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET')!;
    this.publicUrl = this.config.get<string>('S3_PUBLIC_URL')!;

    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: this.config.get<string>('S3_ENDPOINT')!,
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY')!,
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY')!,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(key: string) {
    if (!key) throw new Error('Invalid key');
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}