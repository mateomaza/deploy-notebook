import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

  beforeEach(async () => {
    const mockTagService = {
      createTag: jest.fn((name) => Promise.resolve({ id: 1, name })),
      addTagToNote: jest.fn((noteId, tagId) => Promise.resolve()),
      removeTagFromNote: jest.fn((noteId, tagId) => Promise.resolve()),
      getTags: jest.fn(() => Promise.resolve([])),
      getNotesForTag: jest.fn((tagId) => Promise.resolve([])),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a tag', async () => {
    const name = 'Test Tag';
    const result = await controller.createTag(name);
    expect(result).toBeDefined();
    expect(result.name).toEqual(name);
    expect(service.createTag).toHaveBeenCalledWith(name);
  });

  it('should add a tag to a note', async () => {
    await controller.addTagToNote(1, 2);
    expect(service.addTagToNote).toHaveBeenCalledWith(2, 1);
  });

  it('should remove a tag from a note', async () => {
    await controller.removeTagFromNote(1, 2);
    expect(service.removeTagFromNote).toHaveBeenCalledWith(2, 1);
  });

  it('should get all tags', async () => {
    await controller.getTags();
    expect(service.getTags).toHaveBeenCalled();
  });

  it('should get notes for a tag', async () => {
    await controller.getNotesForTag(1);
    expect(service.getNotesForTag).toHaveBeenCalledWith(1);
  });
});
