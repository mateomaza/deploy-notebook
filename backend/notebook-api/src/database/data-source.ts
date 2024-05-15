import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const createAppDataSource = (configService: ConfigService) =>
  new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('TYPEORM_SYNC', false),
  });
