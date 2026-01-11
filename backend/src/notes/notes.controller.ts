// backend/src/notes/notes.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { LinksService } from './links.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { User } from '@prisma/client';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly linksService: LinksService,
  ) {}

  /**
   * POST /notes - Créer une note
   */
  @Post()
  create(@CurrentUser() user: User, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(user.id, createNoteDto);
  }

  /**
   * GET /notes - Liste toutes les notes
   */
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.notesService.findAll(user.id);
  }

  /**
   * GET /notes/exists?title=Budget
   * Vérifie si une note existe par son titre
   * IMPORTANT: Doit être AVANT @Get(':id') sinon "exists" sera traité comme un ID
   */
  @Get('exists')
  async checkNoteExists(@Query('title') title: string) {
    if (!title) {
      throw new BadRequestException('Le paramètre "title" est requis');
    }

    const result = await this.notesService.checkNoteExists(title);
    return result;
  }

  /**
   * GET /notes/:id/backlinks - Notes qui mentionnent cette note
   */
  @Get(':id/backlinks')
  getBacklinks(@CurrentUser() user: User, @Param('id') id: string) {
    return this.linksService.getBacklinks(user.id, id);
  }

  /**
   * GET /notes/:id - Détail d'une note avec liens
   */
  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.notesService.findOne(user.id, id);
  }

  /**
   * PATCH /notes/:id - Modifier une note
   */
  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(user.id, id, updateNoteDto);
  }

  /**
   * DELETE /notes/:id - Supprimer une note
   */
  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.notesService.remove(user.id, id);
  }
}