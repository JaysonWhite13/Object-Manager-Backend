import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntity } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { MinioService } from '../common/minio.service';
import { Express } from 'express';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectEntity.name) private objectModel: Model<ObjectEntity>,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateObjectDto, file: Express.Multer.File) {
    // 1️⃣ Upload image sur MinIO
    const imageUrl = await this.minioService.uploadFile(file);

    // 2️⃣ Créer l'objet dans MongoDB
    const createdObject = new this.objectModel({
      ...dto,
      imageUrl,
      createdAt: new Date(),
    });

    return createdObject.save();
  }

  async findAll() {
    return this.objectModel.find().exec();
  }

  async findOne(id: string) {
    return this.objectModel.findById(id).exec();
  }

  async remove(id: string) {
    return this.objectModel.findByIdAndDelete(id).exec();
  }
}