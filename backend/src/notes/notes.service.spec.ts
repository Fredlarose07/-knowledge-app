// backend/src/notes/notes.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { LinksService } from './links.service';

describe('NotesService', () => {
  let service: NotesService;
  let prisma: PrismaService;
  let linksService: LinksService;

  const mockPrismaService = {
    note: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockLinksService = {
    syncNoteLinks: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LinksService, useValue: mockLinksService },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
    linksService = module.get<LinksService>(LinksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a note and sync links', async () => {
      const createDto = {
        title: 'New Note',
        content: { type: 'doc', content: [] },
      };

      mockPrismaService.note.create.mockResolvedValue(mockNote);
      mockLinksService.syncNoteLinks.mockResolvedValue({ linksCreated: 0 });

      const result = await service.create('user-123', createDto);

      expect(prisma.note.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          content: createDto.content,
          source: undefined,
          userId: 'user-123',
        },
      });
      expect(linksService.syncNoteLinks).toHaveBeenCalledWith(
        'user-123',
        mockNote.id,
        mockNote.content,
      );
      expect(result).toEqual(mockNote);
    });
  });

  describe('findAll', () => {
    it('should return all notes for a user', async () => {
      const notes = [mockNote];
      mockPrismaService.note.findMany.mockResolvedValue(notes);

      const result = await service.findAll('user-123');

      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          source: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(notes);
    });
  });

  describe('findOne', () => {
    it('should return a note by id', async () => {
      mockPrismaService.note.findFirst.mockResolvedValue(mockNote);

      const result = await service.findOne('user-123', 'note-123');

      expect(prisma.note.findFirst).toHaveBeenCalled();
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if note not found', async () => {
      mockPrismaService.note.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user-123', 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a note and sync links', async () => {
      const updateDto = {
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
      };

      mockPrismaService.note.findFirst.mockResolvedValue(mockNote);
      mockPrismaService.note.update.mockResolvedValue({ ...mockNote, ...updateDto });
      mockLinksService.syncNoteLinks.mockResolvedValue({ linksCreated: 0 });

      const result = await service.update('user-123', 'note-123', updateDto);

      expect(prisma.note.update).toHaveBeenCalled();
      expect(linksService.syncNoteLinks).toHaveBeenCalled();
      expect(result).toEqual({ ...mockNote, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should delete a note', async () => {
      mockPrismaService.note.findFirst.mockResolvedValue(mockNote);
      mockPrismaService.note.delete.mockResolvedValue(mockNote);

      const result = await service.remove('user-123', 'note-123');

      expect(prisma.note.delete).toHaveBeenCalledWith({ where: { id: 'note-123' } });
      expect(result).toEqual({ message: 'Note deleted successfully' });
    });
  });

  describe('checkNoteExists', () => {
    it('should return true if note exists', async () => {
      mockPrismaService.note.findFirst.mockResolvedValue({ id: 'note-123' });

      const result = await service.checkNoteExists('Test Note');

      expect(result).toEqual({ exists: true, noteId: 'note-123' });
    });

    it('should return false if note does not exist', async () => {
      mockPrismaService.note.findFirst.mockResolvedValue(null);

      const result = await service.checkNoteExists('Nonexistent');

      expect(result).toEqual({ exists: false });
    });
  });
});