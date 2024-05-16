import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = ['https://deploy-notebook.vercel.app', 'https://deploy-notebook.vercel.app/'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  if (process.env.NODE_ENV !== 'test') {
    await app.listen(3001);
  }
}
bootstrap();
