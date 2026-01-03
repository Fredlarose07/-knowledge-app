import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Extrait tous les liens [[note]] du contenu JSON
   * Format Novel/Tiptap : cherche dans le texte des nodes
   */
  extractLinksFromContent(content: any): string[] {
    const links: string[] = [];

    // Fonction récursive pour parcourir l'arbre JSON
    const traverse = (node: any) => {
      if (!node) return;

      // Si c'est un node de type texte, chercher les patterns [[xxx]]
      if (node.type === 'text' && node.text) {
        const regex = /\[\[([^\]]+)\]\]/g;
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          links.push(match[1].trim()); // Extraire le titre entre [[]]
        }
      }

      // Parcourir les enfants si présents
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    traverse(content);

    // Retourner les liens uniques
    return [...new Set(links)];
  }

  /**
   * Synchronise les liens d'une note
   * Supprime les anciens liens et crée les nouveaux
   */
  async syncNoteLinks(userId: string, noteId: string, content: any) {
    // 1. Extraire les titres des notes mentionnées
    const linkedTitles = this.extractLinksFromContent(content);

    // 2. Supprimer tous les anciens liens de cette note
    await this.prisma.noteLink.deleteMany({
      where: { sourceId: noteId },
    });

    // 3. Si pas de liens, on s'arrête là
    if (linkedTitles.length === 0) {
      return { linksCreated: 0, linkedTitles: [] };
    }

    // 4. Chercher les notes correspondantes (appartenant au même user)
    const targetNotes = await this.prisma.note.findMany({
      where: {
        userId,
        title: {
          in: linkedTitles,
          mode: 'insensitive', // Insensible à la casse
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    // 5. Créer les nouveaux liens
    if (targetNotes.length > 0) {
      await this.prisma.noteLink.createMany({
        data: targetNotes.map((target) => ({
          sourceId: noteId,
          targetId: target.id,
        })),
        skipDuplicates: true, // Éviter les doublons
      });
    }

    return {
      linksCreated: targetNotes.length,
      linkedTitles: targetNotes.map((n) => n.title),
      notFound: linkedTitles.filter(
        (title) => !targetNotes.some((n) => n.title.toLowerCase() === title.toLowerCase()),
      ),
    };
  }

  /**
   * Récupère toutes les notes qui pointent vers une note donnée (backlinks)
   */
  async getBacklinks(userId: string, noteId: string) {
    const backlinks = await this.prisma.noteLink.findMany({
      where: {
        targetId: noteId,
        source: {
          userId, // Sécurité : seulement les notes du user
        },
      },
      include: {
        source: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return backlinks.map((link) => link.source);
  }
}