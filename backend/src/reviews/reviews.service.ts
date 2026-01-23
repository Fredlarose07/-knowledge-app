// backend/src/reviews/reviews.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SM2Service } from './sm2.service';

@Injectable()
export class ReviewsService {
    constructor(
        private prisma: PrismaService,
        private sm2: SM2Service,
    ) { }

    async enableReview(userId: string, noteId: string) {
        const note = await this.prisma.note.findFirst({
            where: { id: noteId, userId },
        });

        if (!note) {
            throw new NotFoundException('Note not found');
        }

        const existing = await this.prisma.review.findUnique({
            where: { noteId },
        });

        if (existing) {
            return existing;
        }

        const tomorrow = this.sm2.addDays(new Date(), 1);

        return this.prisma.review.create({
            data: {
                noteId,
                userId,
                easiness: 2.5,
                interval: 1,
                repetitions: 0,
                nextReview: tomorrow,
            },
            include: {
                note: {
                    select: { id: true, title: true },
                },
            },
        });
    }

    async disableReview(userId: string, noteId: string) {
        const review = await this.prisma.review.findUnique({
            where: { noteId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        await this.prisma.review.delete({
            where: { noteId },
        });

        return { message: 'Review disabled successfully' };
    }

    async getDueToday(userId: string) {
        const today = this.sm2.getDueToday();

        return this.prisma.review.findMany({
            where: {
                userId,
                nextReview: { lte: today },
            },
            include: {
                note: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        source: true,
                    },
                },
            },
            orderBy: { nextReview: 'asc' },
        });
    }

    async submitReview(userId: string, noteId: string, quality: number) {
        const review = await this.prisma.review.findUnique({
            where: { noteId },
        });

        if (!review) {
            throw new NotFoundException('Review not enabled for this note');
        }

        const result = this.sm2.calculate(
            quality,
            review.easiness,
            review.interval,
            review.repetitions,
        );

        return this.prisma.review.update({
            where: { noteId },
            data: {
                easiness: result.easiness,
                interval: result.interval,
                repetitions: result.repetitions,
                nextReview: result.nextReview,
                lastQuality: quality,
                lastReview: new Date(),
            },
            include: {
                note: {
                    select: { id: true, title: true },
                },
            },
        });
    }

    async getStats(userId: string) {
        const [total, dueToday, totalReviews] = await Promise.all([
            this.prisma.review.count({ where: { userId } }),
            this.prisma.review.count({
                where: {
                    userId,
                    nextReview: { lte: this.sm2.getDueToday() },
                },
            }),
            this.prisma.review.aggregate({
                where: { userId },
                _sum: { repetitions: true },
            }),
        ]);

        return {
            totalNotesInReview: total,
            dueToday,
            totalReviewsDone: totalReviews._sum.repetitions || 0,
        };
    }

    async getReviewStatus(userId: string, noteId: string) {
        return this.prisma.review.findUnique({
            where: { noteId },
        });
    }

    async getAllReviews(userId: string) {
        return this.prisma.review.findMany({
            where: { userId },
            include: {
                note: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        source: true,
                    },
                },
            },
            orderBy: { nextReview: 'asc' },
        });
    }
}

