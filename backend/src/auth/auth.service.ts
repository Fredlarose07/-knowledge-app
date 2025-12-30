import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  // User ID en dur pour le MVP
  private readonly DEMO_USER_EMAIL = 'demo@knowledge.app';

  constructor(private prisma: PrismaService) {}

  /**
   * Récupère l'utilisateur unique du MVP
   * Plus tard, ce sera remplacé par une vraie authentification
   */
  async getDemoUser() {
    const user = await this.prisma.user.findUnique({
      where: { email: this.DEMO_USER_EMAIL },
    });

    if (!user) {
      throw new Error('Demo user not found. Run: npx prisma db seed');
    }

    return user;
  }

  /**
   * Valide un userId (pour plus tard)
   */
  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}