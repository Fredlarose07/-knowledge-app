import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { CurrentUser } from './auth/user.decorator';
import type { User } from '@prisma/client'; // ← Ajoute "type" ici

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Route de test protégée
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: User) {
    return {
      message: 'User authenticated',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}