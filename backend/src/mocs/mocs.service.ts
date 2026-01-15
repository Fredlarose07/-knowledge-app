import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMocDto } from './dto/create-moc.dto';
import { UpdateMocDto } from './dto/update-moc.dto';

@Injectable()
export class MocsService {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /mocs - Liste tous les MOCs d'un user
   */
  async findAll(userId: string) {
    const mocs = await this.prisma.note.findMany({
      where: {
        userId,
        isMOC: true,
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        source: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Pour chaque MOC, extraire et compter les liens [[note]]
    return await Promise.all(
      mocs.map(async (moc) => {
        const noteLinks = this.extractNoteLinks(moc.content);
        
        if (noteLinks.length === 0) {
          return {
            id: moc.id,
            title: moc.title,
            source: moc.source,
            createdAt: moc.createdAt,
            updatedAt: moc.updatedAt,
            noteCount: {
              total: 0,
              created: 0,
              pending: 0,
            },
          };
        }

        // Vérifier combien de ces notes existent
        const existingNotes = await this.prisma.note.findMany({
          where: {
            userId,
            title: { in: noteLinks },
            isMOC: false,
          },
          select: { title: true },
        });

        const existingTitles = new Set(existingNotes.map(n => n.title));
        const createdCount = noteLinks.filter(title => existingTitles.has(title)).length;
        const totalCount = noteLinks.length;

        return {
          id: moc.id,
          title: moc.title,
          source: moc.source,
          createdAt: moc.createdAt,
          updatedAt: moc.updatedAt,
          noteCount: {
            total: totalCount,
            created: createdCount,
            pending: totalCount - createdCount,
          },
        };
      })
    );
  }

  /**
   * Helper pour extraire les liens [[note]] du contenu JSON
   */
  private extractNoteLinks(content: any): string[] {
    const links: string[] = [];
    const regex = /\[\[([^\]]+)\]\]/g;

    const traverse = (node: any) => {
      if (!node) return;

      if (node.type === 'text' && node.text) {
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(node.text)) !== null) {
          if (!links.includes(match[1])) {
            links.push(match[1]);
          }
        }
      }

      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    traverse(content);
    return links;
  }

  /**
   * POST /mocs - Créer un nouveau MOC
   */
  async create(userId: string, createMocDto: CreateMocDto) {
    return this.prisma.note.create({
      data: {
        title: createMocDto.title,
        content: createMocDto.content || { type: 'doc', content: [] },
        source: createMocDto.source,
        isMOC: true,
        userId,
      },
    });
  }

  /**
   * GET /mocs/:id - Récupérer un MOC avec ses notes
   */
  async findOne(userId: string, id: string) {
    const moc = await this.prisma.note.findFirst({
      where: {
        id,
        userId,
        isMOC: true,
      },
      include: {
        mocNotes: {
          include: {
            note: {
              select: {
                id: true,
                title: true,
                source: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!moc) {
      throw new NotFoundException(`MOC with ID ${id} not found`);
    }

    return {
      ...moc,
      notes: moc.mocNotes.map((mn) => mn.note),
      mocNotes: undefined,
    };
  }

  /**
   * PUT /mocs/:id - Mettre à jour un MOC
   */
  async update(userId: string, id: string, updateMocDto: UpdateMocDto) {
    await this.findOne(userId, id);

    return this.prisma.note.update({
      where: { id },
      data: {
        title: updateMocDto.title,
        content: updateMocDto.content,
        source: updateMocDto.source,
      },
    });
  }

  /**
   * DELETE /mocs/:id - Supprimer un MOC
   */
  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.note.delete({
      where: { id },
    });

    return { message: 'MOC deleted successfully' };
  }

  /**
   * POST /mocs/:mocId/notes - Ajouter une note au MOC
   */
  async addNote(userId: string, mocId: string, noteId: string) {
    await this.findOne(userId, mocId);

    const note = await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isMOC: false,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    const existingRelation = await this.prisma.noteMOC.findUnique({
      where: {
        mocId_noteId: {
          mocId,
          noteId,
        },
      },
    });

    if (existingRelation) {
      throw new BadRequestException('Note is already in this MOC');
    }

    await this.prisma.noteMOC.create({
      data: {
        mocId,
        noteId,
      },
    });

    return { message: 'Note added to MOC successfully' };
  }

  /**
   * DELETE /mocs/:mocId/notes/:noteId - Retirer une note du MOC
   */
  async removeNote(userId: string, mocId: string, noteId: string) {
    await this.findOne(userId, mocId);

    const relation = await this.prisma.noteMOC.findUnique({
      where: {
        mocId_noteId: {
          mocId,
          noteId,
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Note is not in this MOC');
    }

    await this.prisma.noteMOC.delete({
      where: {
        mocId_noteId: {
          mocId,
          noteId,
        },
      },
    });

    return { message: 'Note removed from MOC successfully' };
  }
}