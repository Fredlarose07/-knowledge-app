import { PartialType } from '@nestjs/mapped-types';
import { CreateMocDto } from './create-moc.dto';

export class UpdateMocDto extends PartialType(CreateMocDto) {}