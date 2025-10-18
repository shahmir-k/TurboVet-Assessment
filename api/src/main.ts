/**
 * TurboVet Task Management System API
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const port = process.env['API_PORT'] || process.env['PORT'] || 3000;
  
  await app.listen(port);
  
  Logger.log(
    `🚀 API is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📚 Documentation: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
