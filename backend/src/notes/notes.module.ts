import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { AuthModule } from '../auth/auth.module';


@Module({
    imports: [AuthModule], // ← Importer AuthModule pour avoir accès à AuthService
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
