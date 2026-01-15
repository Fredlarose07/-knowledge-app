import { IsString, IsNotEmpty } from 'class-validator';

export class AddNoteToMocDto {
  @IsString()
  @IsNotEmpty()
  noteId: string;
}