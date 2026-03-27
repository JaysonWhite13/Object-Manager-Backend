import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectEntity, ObjectSchema } from './schemas/object.schema';
import { CommonModule } from '../common/common.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ObjectEntity.name, schema: ObjectSchema }]),
    CommonModule,
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}