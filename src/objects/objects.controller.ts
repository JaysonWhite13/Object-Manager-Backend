import { Controller, Get, Post, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse,ApiConsumes ,ApiBody} from '@nestjs/swagger';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { MinioService } from '../common/minio.service';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
@UseInterceptors(FileInterceptor('image'))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      image: { type: 'string', format: 'binary' }, // <-- obligatoire pour Swagger
    },
    required: ['title', 'description', 'image'],
  },
})
@ApiOperation({ summary: 'Create an object' })
@ApiResponse({ status: 201, description: 'Object created' })
create(@Body() dto: CreateObjectDto, @UploadedFile() file: Express.Multer.File) {
  return this.objectsService.create(dto, file);
}

  @Get()
  @ApiOperation({ summary: 'Get all objects' })
  findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one object' })
  findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

 @Delete(':id')
@ApiOperation({ summary: 'Delete object and its image' })
async remove(@Param('id') id: string) {
  const object = await this.objectsService.findOne(id);

  if (!object) {
    throw new Error('Object not found'); // ou NotFoundException de NestJS
    // throw new NotFoundException('Object not found'); // recommandé
  }

  // Récupérer le key de l'image
  const key = object.imageUrl.split('/').pop();
  if (!key) throw new Error('Invalid image URL');

  await this.minioService.deleteFile(key);

  return this.objectsService.remove(id);
}
}