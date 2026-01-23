// backend/src/reviews/reviews.module.ts

import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { SM2Service } from './sm2.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // ✅ AJOUT

@Module({
  imports: [PrismaModule, AuthModule], // ✅ AJOUT AuthModule
  controllers: [ReviewsController],
  providers: [ReviewsService, SM2Service],
  exports: [ReviewsService, SM2Service],
})
export class ReviewsModule {}