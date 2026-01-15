import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateMocDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @IsOptional()
  content?: any; // Format Tiptap JSON

  @IsString()
  @IsOptional()
  source?: string;
}