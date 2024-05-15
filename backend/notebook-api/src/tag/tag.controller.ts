import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  Query
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { Note } from 'src/note/note.entity';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createTag(@Body('name') name: string): Promise<Tag> {
    return this.tagService.createTag(name);
  }

  @Put(':tagId/notes/:noteId')
  addTagToNote(
    @Param('tagId') tagId: number,
    @Param('noteId') noteId: number,
  ): Promise<void> {
    return this.tagService.addTagToNote(noteId, tagId);
  }

  @Delete(':tagId/notes/:noteId')
  removeTagFromNote(
    @Param('tagId') tagId: number,
    @Param('noteId') noteId: number,
  ): Promise<void> {
    return this.tagService.removeTagFromNote(noteId, tagId);
  }

  @Get()
  getTags(): Promise<Tag[]> {
    return this.tagService.getTags();
  }

  @Get(':tagId/notes')
  async getNotesForTag(
    @Param('tagId') tagId: number,
    @Query('type') type: string
  ): Promise<Note[]> {
    return this.tagService.getNotesForTag(tagId, type);
  }
}
