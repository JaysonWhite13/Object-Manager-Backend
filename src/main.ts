import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  // ⚡ Activer CORS pour le frontend
  app.enableCors({
    origin: '*',
    // origin: 'https://objecte-manager-frontend.vercel.app',// ton frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
//   const allowedOrigins = [
//   'http://192.168.1.55:3000',
//   'https://objecte-manager-frontend.vercel.app',
//   'https://autre-frontend.com',
// ];

// app.enableCors({
//   origin: (origin, callback) => {
//     // Si aucune origine (ex: Postman) ou si l’origine est dans la liste
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Origin non autorisée'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// });

  const config = new DocumentBuilder()
    .setTitle('Objects API')
    .setDescription('API for managing objects with MinIO')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
