import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { createAppDataSource } from './data-source';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async (configService: ConfigService) => {
        const dataSource = createAppDataSource(configService);
        await dataSource.initialize();
        return dataSource;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule implements OnModuleInit {
  private static dataSource: DataSource;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    DatabaseModule.dataSource = createAppDataSource(this.configService);
    await DatabaseModule.dataSource.initialize();
  }

  static getDataSource(): DataSource {
    return DatabaseModule.dataSource;
  }
}
