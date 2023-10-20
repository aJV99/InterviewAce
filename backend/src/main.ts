import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  // const csurf = require('csurf');
  // app.use(csurf());
  app.enableCors();
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
