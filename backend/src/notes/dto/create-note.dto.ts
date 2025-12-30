import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsObject()
  content: Record<string, any>; // JSON Novel/Tiptap

  @IsOptional()
  @IsString()
  source?: string;
}