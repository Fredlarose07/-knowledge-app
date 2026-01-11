// backend/src/notes/notes.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { LinksService } from './links.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import type { User } from '@prisma/client';

describe('NotesController', () => {
  let controller: NotesController;
  let notesService: NotesService;
  let linksService: LinksService;

  const mockUser: User = {
    id: 'user-123',
    email: 'demo@knowledge.app',
    name: 'Demo User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNote = {
    id: 'note-123',
    title: 'Test Note',
    content: { type: 'doc', content: [] },
    source: null,
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkNoteExists: jest.fn(),
  };

  const mockLinksService = {
    syncNoteLinks: jest.fn(),
    getBacklinks: jest.fn(),
  };

  // Mock AuthGuard pour bypasser l'authentification dans les tests
  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        { provide: NotesService, useValue: mockNotesService },
        { provide: LinksService, useValue: mockLinksService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
    linksService = module.get<LinksService>(LinksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a note successfully', async () => {
      const createDto: CreateNoteDto = {
        title: 'New Note',
        content: { type: 'doc', content: [] },
      };
      mockNotesService.create.mockResolvedValue({ ...mockNote, ...createDto });

      const result = await controller.create(mockUser, createDto);

      expect(notesService.create).toHaveBeenCalledWith(mockUser.id, createDto);
      expect(result).toEqual({ ...mockNote, ...createDto });
    });
  });

  describe('findAll', () => {
    it('should return all notes for user', async () => {
      const notes = [mockNote];
      mockNotesService.findAll.mockResolvedValue(notes);

      const result = await controller.findAll(mockUser);

      expect(notesService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(notes);
    });
  });

  describe('findOne', () => {
    it('should return a note by id', async () => {
      mockNotesService.findOne.mockResolvedValue(mockNote);

      const result = await controller.findOne(mockUser, 'note-123');

      expect(notesService.findOne).toHaveBeenCalledWith(mockUser.id, 'note-123');
      expect(result).toEqual(mockNote);
    });
  });

  describe('update', () => {
    it('should update a note successfully', async () => {
      const updateDto: UpdateNoteDto = {
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
      };
      mockNotesService.update.mockResolvedValue({ ...mockNote, ...updateDto });

      const result = await controller.update(mockUser, 'note-123', updateDto);

      expect(notesService.update).toHaveBeenCalledWith(mockUser.id, 'note-123', updateDto);
      expect(result).toEqual({ ...mockNote, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should delete a note', async () => {
      mockNotesService.remove.mockResolvedValue({ message: 'Note deleted successfully' });

      await controller.remove(mockUser, 'note-123');

      expect(notesService.remove).toHaveBeenCalledWith(mockUser.id, 'note-123');
    });
  });

  describe('checkNoteExists', () => {
    it('should return true if note exists', async () => {
      mockNotesService.checkNoteExists.mockResolvedValue({ exists: true, noteId: 'note-123' });

      const result = await controller.checkNoteExists('Test Note');

      expect(result).toEqual({ exists: true, noteId: 'note-123' });
    });

    it('should return false if note does not exist', async () => {
      mockNotesService.checkNoteExists.mockResolvedValue({ exists: false });

      const result = await controller.checkNoteExists('Nonexistent');

      expect(result).toEqual({ exists: false });
    });
  });

  describe('getBacklinks', () => {
    it('should return backlinks for a note', async () => {
      const backlinks = [mockNote];
      mockLinksService.getBacklinks.mockResolvedValue(backlinks);

      const result = await controller.getBacklinks(mockUser, 'note-123');

      expect(linksService.getBacklinks).toHaveBeenCalledWith(mockUser.id, 'note-123');
      expect(result).toEqual(backlinks);
    });
  });
});