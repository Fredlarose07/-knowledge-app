// frontend/src/lib/types/review.types.ts

export interface Review {
  id: string;
  noteId: string;
  userId: string;
  easiness: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastQuality: number | null;
  lastReview: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewWithNote extends Review {
  note: {
    id: string;
    title: string;
    content?: any;
    source?: string | null;
  };
}

export interface ReviewStats {
  totalNotesInReview: number;
  dueToday: number;
  totalReviewsDone: number;
}