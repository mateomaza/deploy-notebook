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

  async deleteTag(tagId: number): Promise<void> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['notes'],
    });

    if (tag) {
      tag.notes = [];
      await this.tagRepository.save(tag);
      await this.tagRepository.delete(tagId);
    }
  }

  addTagToNote = async (noteId: number, tagId: number): Promise<void> => {
    const note = await this.noteRepository.findOne({ where: { id: noteId } });

    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['notes'],
    });

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
      await this.tagRepository
        .createQueryBuilder()
        .relation(Tag, 'notes')
        .of(tag)
        .remove(noteId);
    } else {
      throw new Error('Tag not found');
    }
  };

  getTags = async (): Promise<Tag[]> => {
    return this.tagRepository.find();
  };

  async getNotesForTag(tagId: number, type: string): Promise<Note[]> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['notes', 'notes.tags'],
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    const isArchived = type === 'archived';
    return tag.notes.filter((note) => note.archived === isArchived);
  }
}
