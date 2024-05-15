import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { Note } from './note.entity';

describe('NoteController', () => {
  let noteController: NoteController;
  let noteService: NoteService;

  beforeEach(async () => {
    const mockNoteService = {
      createNote: jest.fn((title, content) => Promise.resolve({ id: Date.now(), title, content })),
      updateNote: jest.fn((id, title, content) => Promise.resolve({ id, title, content })),
      deleteNote: jest.fn((id) => Promise.resolve()),
      archiveNote: jest.fn((id) => Promise.resolve({ id, archived: true })),
      unarchiveNote: jest.fn((id) => Promise.resolve({ id, archived: false })),
      getActiveNotes: jest.fn(() => Promise.resolve([])),
      getArchivedNotes: jest.fn(() => Promise.resolve([])),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        {
          provide: NoteService,
          useValue: mockNoteService,
        },
      ],
    }).compile();

    noteController = module.get<NoteController>(NoteController);
    noteService = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(noteController).toBeDefined();
    expect(noteService).toBeDefined();
  });

  it('should create a note', async () => {
    const note = await noteController.createNote('Test Note', 'This is a test note.');
    expect(note).toBeDefined();
    expect(noteService.createNote).toHaveBeenCalled();
  });

  it('should update a note', async () => {
    const note = await noteController.editNote(1, 'Updated Note', 'Updated content.');
    expect(note).toBeDefined();
    expect(noteService.updateNote).toHaveBeenCalled();
  });

  it('should delete a note', async () => {
    await noteController.deleteNote(1);
    expect(noteService.deleteNote).toHaveBeenCalled();
  });

  it('should archive a note', async () => {
    const note = await noteController.archiveNote(1);
    expect(note).toBeDefined();
    expect(note.archived).toBeTruthy();
    expect(noteService.archiveNote).toHaveBeenCalled();
  });

  it('should unarchive a note', async () => {
    const note = await noteController.unarchiveNote(1);
    expect(note).toBeDefined();
    expect(note.archived).toBeFalsy();
    expect(noteService.unarchiveNote).toHaveBeenCalled();
  });

  it('should get active notes', async () => {
    const notes = await noteController.getActiveNotes();
    expect(notes).toBeDefined();
    expect(noteService.getActiveNotes).toHaveBeenCalled();
  });

  it('should get archived notes', async () => {
    const notes = await noteController.getArchivedNotes();
    expect(notes).toBeDefined();
    expect(noteService.getArchivedNotes).toHaveBeenCalled();
  });
});
