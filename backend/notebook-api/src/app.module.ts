import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NoteModule } from './note/note.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    NoteModule,
    TagModule,
  ],
})
export class AppModule {}
