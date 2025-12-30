import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer la validation des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Retire les propriétés non définies dans les DTOs
      forbidNonWhitelisted: true, // Rejette les requêtes avec des props inconnues
      transform: true, // Transforme les payloads selon les DTOs
    }),
  );

  // Activer CORS pour le frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL du frontend
    credentials: true,
  });

  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
}
bootstrap();