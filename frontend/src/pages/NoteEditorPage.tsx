import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { notesApi } from '../lib/api';
import type { NoteDetailResponse } from '../lib/types';

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeSection] = useState('notes');
  const [note, setNote] = useState<NoteDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/notes');
      return;
    }
    loadNote(id);
  }, [id]);

  const loadNote = async (noteId: string) => {
    try {
      setLoading(true);
      const data = await notesApi.getNoteById(noteId);
      setNote(data);
    } catch (error) {
      console.error('Erreur chargement note:', error);
      alert('Impossible de charger la note');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="h-screen flex bg-gradient-to-b from-[#08090A] to-[#101011]">
        <Sidebar activeSection={activeSection} onSectionChange={() => { }} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500">Chargement...</p>
        </main>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar activeSection={activeSection} onSectionChange={() => { }} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec breadcrumb */}
        <PageHeader
          breadcrumbItems={[
            { label: 'Notes', onClick: () => navigate('/notes') },
            { label: note.title }
          ]}
        />

        {/* Zone scrollable */}
        <div className="flex-1 overflow-y-auto px-32">
          {/* Titre - 24px */}
          <h1 className="text-24 font-semibold text-neutral-0 mb-2">
            {note.title}
          </h1>

          {/* Date de création - 13px */}
          <p className="text-13 text-neutral-500 mb-12">
            Créé le {formatDate(note.createdAt)}
          </p>

          {/* Contenu - Temporaire avant Novel */}
          <div className="text-neutral-200 text-16 leading-relaxed mb-16">
            <p className="mb-4 text-neutral-400">
              📝 Zone d'édition (Novel à venir)
            </p>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
              <pre className="text-13 text-neutral-400 overflow-auto">
                {JSON.stringify(note.content, null, 2)}
              </pre>
            </div>
          </div>

          {/* Backlinks (si présents) */}
          {note.linkedFrom && note.linkedFrom.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-800">
              <p className="text-13 font-medium text-neutral-400 mb-4">
                Mentionné dans {note.linkedFrom.length} note(s)
              </p>
              <div className="space-y-2">
                {note.linkedFrom.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => navigate(`/notes/${link.sourceId}`)}
                    className="block text-15 text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    → {link.source?.title || 'Note sans titre'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer sticky en bas */}
        <div className="px-32 py-6">
          {/* Button Source avec icon */}
          <Button
            variant="secondary"
            size="small"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            }
            iconPosition="left"
            className="mb-4"
          >
            Source
          </Button>

          {/* Stroke + contenu source */}
          <div className="border-t border-neutral-800 pt-6">
            {note.source && (
              <p className="text-15 text-neutral-300">{note.source}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}