import { Module } from '@nestjs/common';
import { MocsController } from './mocs.controller';
import { MocsService } from './mocs.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, 
  ],
  controllers: [MocsController],
  providers: [MocsService],
})
export class MocsModule {}