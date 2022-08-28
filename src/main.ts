import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE',
    credentials: true
  })
  await app.listen(3000);
}
bootstrap();
