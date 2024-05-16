import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://deploy-notebook-4x8ljww9e-mateomazas-projects.vercel.app/',
  });
  if (process.env.NODE_ENV !== 'test') {
    await app.listen(3001);
  }
}
bootstrap();
