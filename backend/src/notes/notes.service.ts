import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Créer une nouvelle note
   */
  async create(userId: string, createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        source: createNoteDto.source,
        userId,
      },
    });
  }

  /**
   * Récupérer toutes les notes d'un user
   */
  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }, // Les plus récentes en premier
      select: {
        id: true,
        title: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        // On ne retourne pas le content ici (trop lourd pour la liste)
      },
    });
  }

  /**
   * Récupérer une note par son ID
   */
  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: {
        id,
        userId, // Sécurité : vérifie que la note appartient au user
      },
      include: {
        linksTo: {
          include: {
            target: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        linkedFrom: {
          include: {
            source: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  /**
   * Mettre à jour une note
   */
  async update(userId: string, id: string, updateNoteDto: UpdateNoteDto) {
    // Vérifier que la note existe et appartient au user
    await this.findOne(userId, id);

    return this.prisma.note.update({
      where: { id },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
        source: updateNoteDto.source,
      },
    });
  }

  /**
   * Supprimer une note
   */
  async remove(userId: string, id: string) {
    // Vérifier que la note existe et appartient au user
    await this.findOne(userId, id);

    await this.prisma.note.delete({
      where: { id },
    });

    return { message: 'Note deleted successfully' };
  }
}