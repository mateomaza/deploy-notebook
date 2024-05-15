import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Note } from 'src/note/note.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TagService', () => {
    let service: TagService;
    let tagRepository: MockRepository<Tag>;
    let noteRepository: MockRepository<Note>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TagService,
          {
            provide: getRepositoryToken(Tag),
            useValue: {
              create: jest.fn().mockImplementation(dto => ({ ...dto })),
              save: jest.fn().mockResolvedValue(undefined),
              findOne: jest.fn().mockResolvedValue(undefined),
              find: jest.fn().mockResolvedValue([]),
              delete: jest.fn().mockResolvedValue(undefined),
            },
          },
          {
            provide: getRepositoryToken(Note),
            useValue: {
              findOne: jest.fn().mockResolvedValue(undefined),
            },
          },
        ],
      }).compile();
  
      service = module.get<TagService>(TagService);
      tagRepository = module.get(getRepositoryToken(Tag));
      noteRepository = module.get(getRepositoryToken(Note));
    });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tag', async () => {
    const tagData = { name: 'Urgent' };
    tagRepository.create.mockReturnValue(tagData);
    tagRepository.save.mockResolvedValue({ id: 1, ...tagData });

    const result = await service.createTag('Urgent');
    expect(tagRepository.create).toHaveBeenCalledWith({ name: 'Urgent' });
    expect(tagRepository.save).toHaveBeenCalledWith(tagData);
    expect(result).toEqual({ id: 1, name: 'Urgent' });
  });

  it('should add a tag to a note', async () => {
    const tag = { id: 1, notes: [] };
    const note = { id: 2, title: 'Test Note', content: 'Content' };
    tagRepository.findOne.mockResolvedValue(tag);
    noteRepository.findOne.mockResolvedValue(note);

    await service.addTagToNote(2, 1);
    expect(tagRepository.save).toHaveBeenCalledWith({...tag, notes: [note]});
  });

  it('should throw an error if tag or note not found when adding tag to note', async () => {
    tagRepository.findOne.mockResolvedValue(null);
    noteRepository.findOne.mockResolvedValue(null);

    await expect(service.addTagToNote(2, 1)).rejects.toThrow('Tag or Note not found');
  });

  it('should remove a tag from a note', async () => {
    const note = { id: 2 };
    const tag = { id: 1, notes: [note] };
    tagRepository.findOne.mockResolvedValue(tag);

    await service.removeTagFromNote(2, 1);
    expect(tag.notes.length).toBe(0);
    expect(tagRepository.save).toHaveBeenCalledWith({ id: 1, notes: [] });
  });

  it('should throw an error if tag not found when removing tag from note', async () => {
    tagRepository.findOne.mockResolvedValue(null);

    await expect(service.removeTagFromNote(2, 1)).rejects.toThrow('Tag not found');
  });

  it('should retrieve all tags', async () => {
    const tags = [{ id: 1, name: 'Urgent' }];
    tagRepository.find.mockResolvedValue(tags);

    const result = await service.getTags();
    expect(result).toEqual(tags);
    expect(tagRepository.find).toHaveBeenCalled();
  });

  it('should retrieve notes for a specific tag', async () => {
    const notes = [{ id: 1, title: 'Note 1', content: 'Content' }];
    const tag = { id: 1, notes: notes };
    tagRepository.findOne.mockResolvedValue(tag);

    const result = await service.getNotesForTag(1);
    expect(result).toEqual(notes);
    expect(tagRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['notes', 'notes.tags'] });
  });

  it('should throw an error if tag not found when getting notes for tag', async () => {
    tagRepository.findOne.mockResolvedValue(null);

    await expect(service.getNotesForTag(1)).rejects.toThrow(new NotFoundException('Tag not found'));
  });
});
