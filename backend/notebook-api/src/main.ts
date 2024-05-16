import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://deploy-notebook.vercel.app'],
    credentials: true,
  });
  if (process.env.NODE_ENV !== 'test') {
    await app.listen(process.env.PORT, '0.0.0.0');
  }
}
bootstrap();
