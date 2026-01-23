// frontend/src/pages/NoteEditorPage.tsx

import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { NoteEditor } from '../components/editor/NoteEditor';
import { SourceModal } from '../components/modals/SourceModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { clearNoteCache } from '../components/editor/NoteMentionExtension';
import { notesApi, reviewsApi } from '../lib/api';
import { ToastContext } from '../App';
import type { NoteDetailResponse } from '../lib/types';

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  const [note, setNote] = useState<NoteDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [source, setSource] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewEnabled, setReviewEnabled] = useState(false);

  const saveTimerRef = useRef<number | null>(null);
  const titleSaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/notes');
      return;
    }
    loadNote(id);
    loadReviewStatus(id);
  }, [id, navigate]);

  const loadNote = async (noteId: string) => {
    try {
      setLoading(true);
      const data = await notesApi.getNoteById(noteId);
      setNote(data);
      setTitle(data.title);
      setContent(data.content);
      setSource(data.source || '');
    } catch (error) {
      console.error('Erreur chargement note:', error);
      toast?.error('Impossible de charger la note');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const loadReviewStatus = async (noteId: string) => {
    try {
      const status = await reviewsApi.getReviewStatus(noteId);
      setReviewEnabled(!!status);
    } catch (error) {
      console.error('Erreur chargement review:', error);
    }
  };

  const handleToggleReview = async () => {
    if (!id) return;
    
    try {
      if (reviewEnabled) {
        await reviewsApi.disableReview(id);
        setReviewEnabled(false);
        toast?.success('Révision désactivée');
      } else {
        await reviewsApi.enableReview(id);
        setReviewEnabled(true);
        toast?.success('Révision activée');
      }
    } catch (error) {
      console.error('Erreur toggle review:', error);
      toast?.error('Erreur lors de la modification');
    }
  };

  const saveNote = async (noteId: string, updates: { title?: string; content?: any; source?: string }) => {
    try {
      setSaveStatus('saving');
      await notesApi.updateNote(noteId, updates);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus('idle');
      toast?.error('Erreur lors de la sauvegarde');
    }
  };

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (titleSaveTimerRef.current) {
      clearTimeout(titleSaveTimerRef.current);
    }

    titleSaveTimerRef.current = setTimeout(() => {
      if (id) {
        saveNote(id, { title: newTitle });
      }
    }, 1000) as unknown as number;
  }, [id]);

  const handleContentChange = useCallback((newContent: any) => {
    setContent(newContent);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      if (id) {
        saveNote(id, { content: newContent });
      }
    }, 1000) as unknown as number;
  }, [id]);

  const handleSourceSave = (newSource: string) => {
    setSource(newSource);
    if (id) {
      saveNote(id, { source: newSource });
    }
  };

  const handleDeleteNote = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await notesApi.deleteNote(id);
      clearNoteCache(title);
      navigate('/notes');
    } catch (error) {
      console.error('Erreur suppression note:', error);
      toast?.error('Impossible de supprimer la note');
      setIsDeleting(false);
    }
  };

  const checkNoteExists = useCallback(async (noteName: string): Promise<boolean> => {
    try {
      const result = await notesApi.checkNoteExists(noteName);
      return result.exists;
    } catch (error) {
      console.error('Erreur vérification note:', error);
      return false;
    }
  }, []);

  const handleMentionClick = useCallback(async (noteName: string) => {
    try {
      const result = await notesApi.checkNoteExists(noteName);

      if (result.exists && result.noteId) {
        navigate(`/notes/${result.noteId}`, { replace: false });
      } else {
        console.log(`Création automatique de la note "${noteName}"`);
        
        const newNote = await notesApi.createNote({
          title: noteName,
          content: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [] }],
          },
        });

        clearNoteCache(noteName);
        navigate(`/notes/${newNote.id}`, { replace: false });
      }
    } catch (error) {
      console.error('Erreur lors du clic sur mention:', error);
      toast?.error('Erreur lors de la navigation');
    }
  }, [navigate, toast]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (titleSaveTimerRef.current) {
        clearTimeout(titleSaveTimerRef.current);
      }
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  if (loading) {
    return <LoadingSkeleton variant="note-editor" />;
  }

  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="ml-[240px]">
        <PageHeader 
          breadcrumbItems={[]}
          action={{
            label: source ? 'Source' : 'Ajouter une source',
            onClick: () => setIsSourceModalOpen(true),
            variant: 'secondary',
            size: 'small'
          }}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="small"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              }
              iconPosition="left"
              onClick={() => navigate('/notes')}
            >
              Retour
            </Button>

            <Button
              variant="secondary"
              size="small"
              onClick={handleToggleReview}
            >
              {reviewEnabled ? '✓ Révision activée' : 'Activer révision'}
            </Button>
            
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 rounded-lg bg-[#1E2025] hover:bg-neutral-750 border border-[#2A2D33] text-neutral-400 hover:text-red-500 transition-colors"
              title="Supprimer la note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </PageHeader>

        <div className="px-32 py-8">
          <div className="flex items-center gap-4 mb-2">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Sans titre"
              className="flex-1 text-24 font-semibold text-neutral-0 bg-transparent border-none outline-none focus:outline-none placeholder:text-[#565A64]"
            />

            {saveStatus === 'saving' && (
              <span className="text-13 text-neutral-500">Enregistrement...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-13 text-green-500">✓ Enregistré</span>
            )}
          </div>

          <p className="text-13 font-medium text-[#565A64] mb-6">
            Créé le {formatDate(note.createdAt)}
          </p>

          <div className="mb-16">
            <NoteEditor
              content={content}
              onChange={handleContentChange}
              onMentionClick={handleMentionClick}
              checkNoteExists={checkNoteExists}
              placeholder="Expliquez le concept avec vos mots..."
            />
          </div>
        </div>
      </main>

      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        source={source}
        onSave={handleSourceSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteNote}
        noteTitle={title || 'Sans titre'}
        isDeleting={isDeleting}
      />
    </div>
  );
}