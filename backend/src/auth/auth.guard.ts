import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // Pour le MVP : on injecte automatiquement le user démo
      const user = await this.authService.getDemoUser();
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Injecter le user dans la requête
      request.user = user;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}