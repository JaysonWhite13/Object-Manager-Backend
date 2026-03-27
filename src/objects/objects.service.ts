import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntity } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { SupabaseService } from '../common/supabase.service';
import { Express } from 'express';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectEntity.name) private objectModel: Model<ObjectEntity>,
    private readonly supabaseService: SupabaseService,
  ) {}

  /**
   * Crée un nouvel objet et upload l'image sur Supabase
   */
  async create(dto: CreateObjectDto, file: Express.Multer.File) {
  try {
    const imageUrl = await this.supabaseService.uploadFile(file);

    const createdObject = new this.objectModel({
      ...dto,
      imageUrl,
      createdAt: new Date(),
    });

    return await createdObject.save();
  } catch (err) {
    console.error('Error creating object:', err); // ← log complet
    throw err; // on renvoie l’erreur originale pour debugger
  }
}

  /**
   * Retourne tous les objets
   */
  async findAll() {
    return this.objectModel.find().exec();
  }

  /**
   * Retourne un objet par son ID
   */
  async findOne(id: string) {
    const object = await this.objectModel.findById(id).exec();
    if (!object) throw new NotFoundException('Object not found');
    return object;
  }

  /**
   * Supprime un objet et son image dans Supabase
   */
  async remove(id: string) {
    const object = await this.objectModel.findById(id);
    if (!object) throw new NotFoundException('Object not found');

    // Récupérer le nom du fichier depuis l'URL
    const fileName = object.imageUrl.split('/').pop()!;
    
    // Supprimer le fichier sur Supabase
    await this.supabaseService.deleteFile(fileName);

    // Supprimer le document MongoDB
    const deleted = await this.objectModel.findByIdAndDelete(id);
    return deleted;
  }
}