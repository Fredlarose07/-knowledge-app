// frontend/src/pages/ReviewsPage.tsx

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { reviewsApi } from '../lib/api';
import { ToastContext } from '../App';
import type { ReviewWithNote } from '../lib/types/review.types';

export default function ReviewsPage() {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const [reviews, setReviews] = useState<ReviewWithNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllReviews();
  }, []);

  const loadAllReviews = async () => {
    try {
      setLoading(true);
      // On récupère toutes les notes en révision (pas juste celles dues)
      const data = await reviewsApi.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Erreur chargement révisions:', error);
      toast?.error('Impossible de charger les révisions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays < 0) return `Il y a ${Math.abs(diffDays)}j`;
    return `Dans ${diffDays}j`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
        <Sidebar />
        <main className="ml-[240px]">
          <PageHeader breadcrumbItems={[{ label: 'Révisions' }]} />
          <div className="px-32 py-8">
            <p className="text-neutral-400">Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
        <Sidebar />
        <main className="ml-[240px]">
          <PageHeader breadcrumbItems={[{ label: 'Révisions' }]} />
          <div className="px-32 py-8">
            <p className="text-neutral-400">Aucune note en révision</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar />

      <main className="ml-[240px]">
        <PageHeader breadcrumbItems={[{ label: 'Révisions' }]} />

        <div className="px-32 py-8">
          <div className="grid gap-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                onClick={() => navigate(`/reviews/${review.noteId}`)}
                className="bg-[#18191A] border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-17 font-medium text-neutral-0 mb-1">
                      {review.note.title}
                    </h3>
                    <div className="flex items-center gap-4 text-13 text-neutral-500">
                      <span>Révisions: {review.repetitions}</span>
                      <span>•</span>
                      <span>Intervalle: {review.interval}j</span>
                      <span>•</span>
                      <span>Facilité: {review.easiness.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-13 text-neutral-400">
                      {formatDate(review.nextReview)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}