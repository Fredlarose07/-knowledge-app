import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    PrismaModule,  // Global module pour Prisma
    AuthModule, NotesModule,    // Module d'authentification
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}