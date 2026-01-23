// frontend/src/lib/api/reviews.api.ts

import { apiClient } from './client';
import type { Review, ReviewWithNote, ReviewStats } from '../types/review.types';

export const reviewsApi = {
  async enableReview(noteId: string): Promise<Review> {
    const response = await apiClient.post(`/reviews/${noteId}/enable`);
    return response.data;
  },

  async disableReview(noteId: string): Promise<void> {
    await apiClient.delete(`/reviews/${noteId}/disable`);
  },

  async getDueToday(): Promise<ReviewWithNote[]> {
    const response = await apiClient.get('/reviews/due');
    return response.data;
  },

  async submitReview(noteId: string, quality: number): Promise<Review> {
    const response = await apiClient.post(`/reviews/${noteId}/submit`, { quality });
    return response.data;
  },

  async getStats(): Promise<ReviewStats> {
    const response = await apiClient.get('/reviews/stats');
    return response.data;
  },

  async getReviewStatus(noteId: string): Promise<Review | null> {
    const response = await apiClient.get(`/reviews/${noteId}/status`);
    return response.data;
  },

  async getAllReviews(): Promise<ReviewWithNote[]> {
  const response = await apiClient.get('/reviews/all');
  return response.data;
},
};