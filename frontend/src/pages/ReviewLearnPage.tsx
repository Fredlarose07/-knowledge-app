// frontend/src/pages/ReviewLearnPage.tsx

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { NoteEditor } from '../components/editor/NoteEditor';
import { reviewsApi, notesApi } from '../lib/api';
import { ToastContext } from '../App';
import type { Note } from '../lib/types';

export default function ReviewLearnPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  
  const [note, setNote] = useState<Note | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (noteId) {
      loadNote(noteId);
    }
  }, [noteId]);

  const loadNote = async (id: string) => {
    try {
      setLoading(true);
      const data = await notesApi.getNoteById(id);
      setNote(data);
    } catch (error) {
      console.error('Erreur chargement note:', error);
      toast?.error('Impossible de charger la note');
      navigate('/reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleQuality = async (quality: number) => {
    if (!noteId) return;

    try {
      await reviewsApi.submitReview(noteId, quality);
      toast?.success('Révision enregistrée');
      navigate('/reviews');
    } catch (error) {
      console.error('Erreur soumission révision:', error);
      toast?.error('Impossible d\'enregistrer la révision');
    }
  };

  if (loading || !note) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
        <Sidebar />
        <main className="ml-[240px]">
          <div className="px-32 py-8">
            <p className="text-neutral-400">Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar />

      <main className="ml-[240px]">
        <PageHeader breadcrumbItems={[
          { label: 'Révisions', onClick: () => navigate('/reviews') },
          { label: note.title }
        ]} />

        <div className="px-32 py-12 max-w-4xl mx-auto">
          <div className="bg-[#18191A] border border-neutral-800 rounded-lg p-8 mb-6">
            <h1 className="text-28 font-semibold text-neutral-0 mb-6">
              {note.title}
            </h1>

            {!showAnswer ? (
              <div className="flex flex-col items-center gap-6 py-12">
                <p className="text-17 text-neutral-400">Essayez de vous rappeler le contenu...</p>
                <Button onClick={() => setShowAnswer(true)}>Afficher la réponse</Button>
              </div>
            ) : (
              <div className="mb-6">
                <NoteEditor
                  content={note.content}
                  onChange={() => {}}
                  editable={false}
                />
              </div>
            )}
          </div>

          {showAnswer && (
            <div className="bg-[#18191A] border border-neutral-800 rounded-lg p-6">
              <p className="text-15 text-neutral-400 mb-4 text-center">
                À quel point avez-vous retenu cette note ?
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleQuality(0)} className="p-4 bg-red-900/20 hover:bg-red-900/30 border border-red-500/50 rounded-lg transition-colors">
                  <div className="text-17 font-semibold text-red-400">0 - Blackout</div>
                  <div className="text-13 text-neutral-500 mt-1">Aucun souvenir</div>
                </button>

                <button onClick={() => handleQuality(1)} className="p-4 bg-orange-900/20 hover:bg-orange-900/30 border border-orange-500/50 rounded-lg transition-colors">
                  <div className="text-17 font-semibold text-orange-400">1 - Faux</div>
                  <div className="text-13 text-neutral-500 mt-1">Reconnu après</div>
                </button>

                <button onClick={() => handleQuality(2)} className="p-4 bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-500/50 rounded-lg transition-colors">
                  <div className="text-17 font-semibold text-yellow-400">2 - Difficile</div>
                  <div className="text-13 text-neutral-500 mt-1">Rappel laborieux</div>
                </button>

                <button onClick={() => handleQuality(3)} className="p-4 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-500/50 rounded-lg transition-colors">
                  <div className="text-17 font-semibold text-blue-400">3 - Correct</div>
                  <div className="text-13 text-neutral-500 mt-1">Avec effort</div>
                </button>

                <button onClick={() => handleQuality(4)} className="p-4 bg-green-900/20 hover:bg-green-900/30 border border-green-500/50 rounded-lg transition-colors">
                  <div className="text-17 font-semibold text-green-400">4 - Facile</div>
                  <div className="text-13 text-neutral-500 mt-1">Légère hésitation</div>
                </button>

                <button onClick={() => handleQuality(5)} className="p-4 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/50 rounded-lg transition-colors">
                  <div className="text-17 font-semibold text-emerald-400">5 - Parfait</div>
                  <div className="text-13 text-neutral-500 mt-1">Immédiat</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}