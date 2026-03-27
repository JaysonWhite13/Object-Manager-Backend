import { Controller, Get, Post, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' },
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
  remove(@Param('id') id: string) {
    return this.objectsService.remove(id);
  }
}