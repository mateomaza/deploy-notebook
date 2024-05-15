import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from 'src/tag/tag.module';
import { DatabaseModule } from 'src/database/database.module';
import { Note } from './note.entity';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    forwardRef(() => TagModule),
    DatabaseModule,
  ],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [TypeOrmModule],
})
export class NoteModule {}
