import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { MocsModule } from './mocs/mocs.module';
import { ReviewsModule } from './reviews/reviews.module'; // ✅ NOUVEAU

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NotesModule,
    MocsModule,
    ReviewsModule, // ✅ NOUVEAU
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}