import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MyZodValidationPipe } from './validation_pipe/CustomZodValidationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
    exposedHeaders: ['set-cookie'],
  });
  app.useGlobalPipes(new MyZodValidationPipe());
  await app.listen(8080);
}
bootstrap();
