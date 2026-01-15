// backend/src/notes/notes.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LinksService } from './links.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private linksService: LinksService,
  ) {}

  /**
   * Créer une nouvelle note
   * IMPORTANT: userId EN PREMIER pour correspondre au controller
   */
  async create(userId: string, createNoteDto: CreateNoteDto) {
    // Créer la note
    const note = await this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        source: createNoteDto.source,
        userId
      },
    });

    // Synchroniser les liens automatiquement
    await this.linksService.syncNoteLinks(userId, note.id, note.content);

    return note;
  }

  /**
   * Récupérer toutes les notes d'un user
   */
  async findAll(userId: string) {
  return this.prisma.note.findMany({
    where: { 
      userId,
      isMOC: false  // ← AJOUTE CETTE LIGNE ICI
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      source: true,
      createdAt: true,
      updatedAt: true,
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
        userId,
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
    // Vérifier que la note existe
    await this.findOne(userId, id);

    // Mettre à jour la note
    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
        source: updateNoteDto.source,
      },
    });

    // Synchroniser les liens si le contenu a changé
    if (updateNoteDto.content) {
      await this.linksService.syncNoteLinks(userId, id, updatedNote.content);
    }

    return updatedNote;
  }

  /**
   * Supprimer une note
   */
  async remove(userId: string, id: string) {
    // Vérifier que la note existe
    await this.findOne(userId, id);

    // Supprimer (les liens seront supprimés automatiquement grâce au onDelete: Cascade)
    await this.prisma.note.delete({
      where: { id },
    });

    return { message: 'Note deleted successfully' };
  }

  /**
   * GET /notes/exists?title=Budget
   * Vérifie si une note existe par son titre (case-insensitive)
   */
  async checkNoteExists(title: string): Promise<{ exists: boolean; noteId?: string }> {
    const note = await this.prisma.note.findFirst({
      where: {
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });

    if (note) {
      return { exists: true, noteId: note.id };
    }

    return { exists: false };
  }
}