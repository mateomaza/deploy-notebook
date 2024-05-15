import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';

describe('NoteService', () => {
  let service: NoteService;
  let mockRepository: Partial<Repository<Note>>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(note => Promise.resolve({ id: Date.now(), ...note })),
      findOneBy: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({ id, title: 'Existing note', content: 'Content', archived: false })),
      delete: jest.fn().mockResolvedValue(undefined),
      find: jest.fn().mockImplementation(({ where: { archived } }) =>
        Promise.resolve([{ id: Date.now(), title: 'Note', content: 'Content', archived }])),
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        tags: []
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a note', async () => {
    const note = await service.createNote('Test Note', 'This is a test note');
    expect(note).toBeDefined();
    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should update a note', async () => {
    const note = await service.updateNote(1, 'Updated Note', 'Updated content');
    expect(note).toBeDefined();
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepository.save).toHaveBeenCalledWith({ id: 1, title: 'Updated Note', content: 'Updated content', archived: false });
  });

  it('should throw an error if note to update is not found', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue(null);
    await expect(service.updateNote(999, 'Updated Note', 'Updated content')).rejects.toThrow('Note not found');
  });

  it('should delete a note', async () => {
    await service.deleteNote(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['tags']
    });
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should archive a note', async () => {
    const note = await service.archiveNote(1);
    expect(note).toBeDefined();
    expect(note.archived).toBeTruthy();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should unarchive a note', async () => {
    const note = await service.unarchiveNote(1);
    expect(note).toBeDefined();
    expect(note.archived).toBeFalsy();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should retrieve active notes', async () => {
    const notes = await service.getActiveNotes();
    expect(notes).toBeDefined();
    expect(notes.every(note => !note.archived)).toBe(true);
    expect(mockRepository.find).toHaveBeenCalledWith({ where: { archived: false }, relations: ['tags'] });
  });

  it('should retrieve archived notes', async () => {
    const notes = await service.getArchivedNotes();
    expect(notes).toBeDefined();
    expect(notes.every(note => note.archived)).toBe(true);
    expect(mockRepository.find).toHaveBeenCalledWith({ where: { archived: true }, relations: ['tags'] });
  });
});
