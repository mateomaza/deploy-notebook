import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Note } from 'src/note/note.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  createTag = async (name: string): Promise<Tag> => {
    const tag = this.tagRepository.create({ name });
    return await this.tagRepository.save(tag);
  };

  addTagToNote = async (noteId: number, tagId: number): Promise<void> => {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['notes'],
    });
    const note = await this.noteRepository.findOne({ where: { id: noteId } });

    if (tag && note) {
      tag.notes.push(note);
      await this.tagRepository.save(tag);
    } else {
      throw new Error('Tag or Note not found');
    }
  };

  removeTagFromNote = async (noteId: number, tagId: number): Promise<void> => {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['notes'],
    });

    if (tag) {
      tag.notes = tag.notes.filter((note) => note.id !== noteId);
      await this.tagRepository.save(tag);
    } else {
      throw new Error('Tag not found');
    }
  };

  getTags = async (): Promise<Tag[]> => {
    return this.tagRepository.find();
  };

  async getNotesForTag(tagId: number): Promise<Note[]> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['notes', 'notes.tags'],
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag.notes;
  }
}
