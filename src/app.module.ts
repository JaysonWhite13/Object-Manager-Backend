import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsModule } from './objects/objects.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ← très important
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/objects-db'),
    CommonModule,
    ObjectsModule,
  ],
})
export class AppModule {}