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
import type { User } from '@prisma/client';

@Controller('mocs')
@UseGuards(AuthGuard)
export class MocsController {
  constructor(private readonly mocsService: MocsService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    const userId = typeof user === 'object' ? user.id : user;
    return this.mocsService.findAll(userId);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() createMocDto: CreateMocDto) {
    const userId = typeof user === 'object' ? user.id : user;
    return this.mocsService.create(userId, createMocDto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    const userId = typeof user === 'object' ? user.id : user;
    return this.mocsService.findOne(userId, id);
  }

  @Put(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateMocDto: UpdateMocDto,
  ) {
    const userId = typeof user === 'object' ? user.id : user;
    return this.mocsService.update(userId, id, updateMocDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    const userId = typeof user === 'object' ? user.id : user;
    return this.mocsService.remove(userId, id);
  }

  @Post(':mocId/notes')
  addNote(
    @CurrentUser() user: User,
    @Param('mocId') mocId: string,
    @Body() addNoteDto: AddNoteToMocDto,
  ) {
    const userId = typeof user === 'object' ? user.id : user;
    return this.mocsService.addNote(userId, mocId, addNoteDto.noteId);
  }

  @Delete(':mocId/notes/:noteId')
  removeNote(
    @CurrentUser() user: User,
    @Param('mocId') mocId: string,
    @Param('noteId') noteId: string,
  ) {
    const userId = typeof user === 'object' ? user.id : user;
    return this.mocsService.removeNote(userId, mocId, noteId);
  }
}