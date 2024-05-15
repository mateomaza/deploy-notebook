import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async createNote(title: string, content: string): Promise<Note> {
    const note = this.noteRepository.create({ title, content });
    return this.noteRepository.save(note);
  }

  async updateNote(id: number, title: string, content: string): Promise<Note> {
    const note = await this.noteRepository.findOneBy({ id });
    if (note) {
      note.title = title;
      note.content = content;
      return this.noteRepository.save(note);
    }
    throw new Error('Note not found');
  }

  async deleteNote(noteId: number): Promise<void> {
    const note = await this.noteRepository.findOne({
        where: { id: noteId },
        relations: ['tags']
    });

    if (note) {
        note.tags = [];
        await this.noteRepository.save(note);
        await this.noteRepository.delete(noteId);
    }
}

  async archiveNote(id: number): Promise<Note> {
    const note = await this.noteRepository.findOneBy({ id });
    if (note) {
      note.archived = true;
      return this.noteRepository.save(note);
    }
    throw new Error('Note not found');
  }

  async unarchiveNote(id: number): Promise<Note> {
    const note = await this.noteRepository.findOneBy({ id });
    if (note) {
      note.archived = false;
      return this.noteRepository.save(note);
    }
    throw new Error('Note not found');
  }

  async getActiveNotes(): Promise<Note[]> {
    return this.noteRepository.find({
      where: { archived: false },
      relations: ['tags'],
    });
  }

  async getArchivedNotes(): Promise<Note[]> {
    return this.noteRepository.find({
      where: { archived: true },
      relations: ['tags'],
    });
  }
}
