import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: 'https://deploy-notebook.vercel.app',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  if (process.env.NODE_ENV !== 'test') {
    await app.listen(3001);
  }
}
bootstrap();
