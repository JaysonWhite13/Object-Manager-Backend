import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService], // ← important pour que d’autres modules puissent l’utiliser
})
export class CommonModule {}