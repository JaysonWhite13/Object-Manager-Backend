import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { ObjectEntity, ObjectSchema } from './schemas/object.schema';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ObjectEntity.name, schema: ObjectSchema }]),
    CommonModule, // ← important pour accéder à SupabaseService
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}