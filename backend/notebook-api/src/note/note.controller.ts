import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from './note.entity';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  createNote(
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<Note> {
    return this.noteService.createNote(title, content);
  }

  @Put(':id')
  editNote(
    @Param('id') noteId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<Note> {
    return this.noteService.updateNote(noteId, title, content);
  }

  @Delete(':id')
  deleteNote(@Param('id') noteId: number): Promise<void> {
    return this.noteService.deleteNote(noteId);
  }

  @Put(':id/archive')
  archiveNote(@Param('id') noteId: number): Promise<Note> {
    return this.noteService.archiveNote(noteId);
  }

  @Put(':id/unarchive')
  unarchiveNote(@Param('id') noteId: number): Promise<Note> {
    return this.noteService.unarchiveNote(noteId);
  }

  @Get('active')
  getActiveNotes(): Promise<Note[]> {
    return this.noteService.getActiveNotes();
  }

  @Get('archived')
  getArchivedNotes(): Promise<Note[]> {
    return this.noteService.getArchivedNotes();
  }
}
