import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      endPoint: this.configService.get('MINIO_ENDPOINT')!,
      port: parseInt(this.configService.get('MINIO_PORT')!),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY')!,
      secretKey: this.configService.get('MINIO_SECRET_KEY')!,
    });
  }

  // Méthode test pour lister les fichiers
  async listFiles(bucket: string) {
    const objects: string[] = [];
    const stream = this.client.listObjectsV2(bucket, '', true);
    return new Promise<string[]>((resolve, reject) => {
      stream.on('data', obj => objects.push(obj.name!));
      stream.on('end', () => resolve(objects));
      stream.on('error', err => reject(err));
    });
  }

  async upload(bucket: string, fileName: string, buffer: Buffer, mimetype: string) {
    await this.client.putObject(bucket, fileName, buffer, buffer.length, { 'Content-Type': mimetype });
    return `${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${bucket}/${fileName}`;
  }

  async delete(bucket: string, fileName: string) {
    await this.client.removeObject(bucket, fileName);
  }
}