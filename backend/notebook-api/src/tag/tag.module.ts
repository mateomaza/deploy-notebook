import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteModule } from 'src/note/note.module';
import { DatabaseModule } from 'src/database/database.module';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    forwardRef(() => NoteModule),
    DatabaseModule,
  ],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
