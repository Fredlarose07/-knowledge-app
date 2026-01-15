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
        isMOC: true, // Filtrer uniquement les MOCs
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            mocNotes: true, // Nombre de notes dans ce MOC
          },
        },
      },
    });

    // Formatter pour renvoyer noteCount au lieu de _count
    return mocs.map((moc) => ({
      id: moc.id,
      title: moc.title,
      source: moc.source,
      createdAt: moc.createdAt,
      updatedAt: moc.updatedAt,
      noteCount: moc._count.mocNotes,
    }));
  }

  /**
   * POST /mocs - Créer un nouveau MOC
   */
  async create(userId: string, createMocDto: CreateMocDto) {
    return this.prisma.note.create({
      data: {
        title: createMocDto.title,
        content: createMocDto.content || { type: 'doc', content: [] }, // Contenu vide par défaut
        source: createMocDto.source,
        isMOC: true, // Important : marquer comme MOC
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
        isMOC: true, // Vérifier que c'est bien un MOC
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

    // Formatter la réponse pour simplifier la structure
    return {
      ...moc,
      notes: moc.mocNotes.map((mn) => mn.note),
      mocNotes: undefined, // Retirer mocNotes de la réponse
    };
  }

  /**
   * PUT /mocs/:id - Mettre à jour un MOC
   */
  async update(userId: string, id: string, updateMocDto: UpdateMocDto) {
    // Vérifier que le MOC existe
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
    // Vérifier que le MOC existe
    await this.findOne(userId, id);

    // Supprimer le MOC (les relations NoteMOC seront supprimées automatiquement grâce au cascade)
    await this.prisma.note.delete({
      where: { id },
    });

    return { message: 'MOC deleted successfully' };
  }

  /**
   * POST /mocs/:mocId/notes - Ajouter une note au MOC
   */
  async addNote(userId: string, mocId: string, noteId: string) {
    // Vérifier que le MOC existe
    const moc = await this.findOne(userId, mocId);

    // Vérifier que la note existe et appartient au user
    const note = await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isMOC: false, // Une note normale (pas un MOC dans un MOC pour l'instant)
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    // Vérifier si la relation existe déjà
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

    // Créer la relation
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
    // Vérifier que le MOC existe
    await this.findOne(userId, mocId);

    // Supprimer la relation
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