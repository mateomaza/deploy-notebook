import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  if (process.env.NODE_ENV !== 'test') {
    await app.listen(3001);
  }
}
bootstrap();
