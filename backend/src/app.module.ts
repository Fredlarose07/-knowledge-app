import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { MocsModule } from './mocs/mocs.module';

@Module({
  imports: [
    PrismaModule,  // Global module pour Prisma
    AuthModule, NotesModule, MocsModule,    // Module d'authentification
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}