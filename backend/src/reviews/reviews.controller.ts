// backend/src/reviews/reviews.controller.ts

import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { User } from '@prisma/client';

@Controller('reviews')
@UseGuards(AuthGuard)
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post(':noteId/enable')
    enableReview(@CurrentUser() user: User, @Param('noteId') noteId: string) {
        return this.reviewsService.enableReview(user.id, noteId);
    }

    @Delete(':noteId/disable')
    disableReview(@CurrentUser() user: User, @Param('noteId') noteId: string) {
        return this.reviewsService.disableReview(user.id, noteId);
    }

    @Get('all')
    getAllReviews(@CurrentUser() user: User) {
        return this.reviewsService.getAllReviews(user.id);
    }

    @Get('due')
    getDueToday(@CurrentUser() user: User) {
        return this.reviewsService.getDueToday(user.id);
    }

    @Post(':noteId/submit')
    submitReview(
        @CurrentUser() user: User,
        @Param('noteId') noteId: string,
        @Body('quality') quality: number,
    ) {
        return this.reviewsService.submitReview(user.id, noteId, quality);
    }

    @Get('stats')
    getStats(@CurrentUser() user: User) {
        return this.reviewsService.getStats(user.id);
    }

    @Get(':noteId/status')
    getReviewStatus(@CurrentUser() user: User, @Param('noteId') noteId: string) {
        return this.reviewsService.getReviewStatus(user.id, noteId);
    }

}