// backend/src/notes/links.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LinksService', () => {
  let service: LinksService;
  let prisma: PrismaService;

  const mockPrismaService = {
    noteLink: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    note: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractLinksFromContent', () => {
    it('should extract [[note]] mentions from content', () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Voir [[Budget]] et [[Épargne]].' },
            ],
          },
        ],
      };

      const result = service.extractLinksFromContent(content);

      expect(result).toEqual(['Budget', 'Épargne']);
    });

    it('should handle content without links', () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'No links here.' }],
          },
        ],
      };

      const result = service.extractLinksFromContent(content);

      expect(result).toEqual([]);
    });

    it('should deduplicate repeated mentions', () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: '[[Budget]] [[Budget]] [[Épargne]]' },
            ],
          },
        ],
      };

      const result = service.extractLinksFromContent(content);

      expect(result).toEqual(['Budget', 'Épargne']);
    });
  });

  describe('syncNoteLinks', () => {
    it('should create links for existing notes', async () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'See [[Budget]]' }],
          },
        ],
      };

      const existingNotes = [{ id: 'note-budget', title: 'Budget' }];

      mockPrismaService.noteLink.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.note.findMany.mockResolvedValue(existingNotes);
      mockPrismaService.noteLink.createMany.mockResolvedValue({ count: 1 });

      const result = await service.syncNoteLinks('user-123', 'note-123', content);

      expect(result.linksCreated).toBe(1);
      expect(result.linkedTitles).toEqual(['Budget']);
      expect(prisma.noteLink.deleteMany).toHaveBeenCalledWith({
        where: { sourceId: 'note-123' },
      });
    });

    it('should return notFound for non-existing notes', async () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'See [[Nonexistent]]' }],
          },
        ],
      };

      mockPrismaService.noteLink.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.note.findMany.mockResolvedValue([]);

      const result = await service.syncNoteLinks('user-123', 'note-123', content);

      expect(result.linksCreated).toBe(0);
      expect(result.notFound).toEqual(['Nonexistent']);
    });

    it('should handle content without links', async () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'No links.' }],
          },
        ],
      };

      mockPrismaService.noteLink.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.syncNoteLinks('user-123', 'note-123', content);

      expect(result.linksCreated).toBe(0);
      expect(result.linkedTitles).toEqual([]);
    });
  });

  describe('getBacklinks', () => {
    it('should return notes that link to the target note', async () => {
      const backlinks = [
        {
          source: {
            id: 'note-source',
            title: 'Source Note',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      mockPrismaService.noteLink.findMany.mockResolvedValue(backlinks);

      const result = await service.getBacklinks('user-123', 'note-target');

      expect(result).toEqual([backlinks[0].source]);
    });

    it('should return empty array if no backlinks exist', async () => {
      mockPrismaService.noteLink.findMany.mockResolvedValue([]);

      const result = await service.getBacklinks('user-123', 'note-orphan');

      expect(result).toEqual([]);
    });
  });
});