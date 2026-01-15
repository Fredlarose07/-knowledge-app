import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MocsService } from './mocs.service';
import { CreateMocDto } from './dto/create-moc.dto';
import { UpdateMocDto } from './dto/update-moc.dto';
import { AddNoteToMocDto } from './dto/add-note-to-moc.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';

@Controller('mocs')
@UseGuards(AuthGuard)
export class MocsController {
  constructor(private readonly mocsService: MocsService) {}

  /**
   * GET /mocs - Liste tous les MOCs
   */
  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.mocsService.findAll(userId);
  }

  /**
   * POST /mocs - Créer un nouveau MOC
   */
  @Post()
  create(@CurrentUser('id') userId: string, @Body() createMocDto: CreateMocDto) {
    return this.mocsService.create(userId, createMocDto);
  }

  /**
   * GET /mocs/:id - Récupérer un MOC avec ses notes
   */
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.mocsService.findOne(userId, id);
  }

  /**
   * PUT /mocs/:id - Mettre à jour un MOC
   */
  @Put(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateMocDto: UpdateMocDto,
  ) {
    return this.mocsService.update(userId, id, updateMocDto);
  }

  /**
   * DELETE /mocs/:id - Supprimer un MOC
   */
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.mocsService.remove(userId, id);
  }

  /**
   * POST /mocs/:mocId/notes - Ajouter une note au MOC
   */
  @Post(':mocId/notes')
  addNote(
    @CurrentUser('id') userId: string,
    @Param('mocId') mocId: string,
    @Body() addNoteDto: AddNoteToMocDto,
  ) {
    return this.mocsService.addNote(userId, mocId, addNoteDto.noteId);
  }

  /**
   * DELETE /mocs/:mocId/notes/:noteId - Retirer une note du MOC
   */
  @Delete(':mocId/notes/:noteId')
  removeNote(
    @CurrentUser('id') userId: string,
    @Param('mocId') mocId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.mocsService.removeNote(userId, mocId, noteId);
  }
}