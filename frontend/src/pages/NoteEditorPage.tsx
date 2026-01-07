import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { NoteEditor } from '../components/editor/NoteEditor';
import { notesApi } from '../lib/api';
import type { NoteDetailResponse } from '../lib/types';

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<NoteDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [source, setSource] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');

  // Timers pour le debounce
  const saveTimerRef = useRef<number | null>(null);
  const titleSaveTimerRef = useRef<number | null>(null);
  const sourceSaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/notes');
      return;
    }
    loadNote(id);
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
      alert('Impossible de charger la note');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour sauvegarder
  const saveNote = async (noteId: string, updates: { title?: string; content?: any; source?: string }) => {
    try {
      setSaveStatus('saving');
      await notesApi.updateNote(noteId, updates);
      setSaveStatus('saved');

      // Repasser à 'idle' après 2 secondes
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus('idle');
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Gérer les changements de titre avec debounce
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
    }, 1000);
  }, [id]);

  // Gérer les changements de contenu avec debounce
  const handleContentChange = useCallback((newContent: any) => {
    setContent(newContent);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      if (id) {
        saveNote(id, { content: newContent });
      }
    }, 1000);
  }, [id]);

  // Gérer les changements de source avec debounce
  const handleSourceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSource = e.target.value;
    setSource(newSource);

    if (sourceSaveTimerRef.current) {
      clearTimeout(sourceSaveTimerRef.current);
    }

    sourceSaveTimerRef.current = setTimeout(() => {
      if (id) {
        saveNote(id, { source: newSource });
      }
    }, 1000);
  }, [id]);

  // Nettoyer les timers au démontage
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (titleSaveTimerRef.current) {
        clearTimeout(titleSaveTimerRef.current);
      }
      if (sourceSaveTimerRef.current) {
        clearTimeout(sourceSaveTimerRef.current);
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

  // Gérer les clics sur les [[liens]]
  const handleMentionClick = useCallback(async (noteName: string) => {
    try {
      // Chercher la note par son titre
      const notes = await notesApi.getAllNotes();
      const targetNote = notes.find(
        n => n.title.toLowerCase() === noteName.toLowerCase()
      );

      if (targetNote) {
        // Naviguer sans recharger
        navigate(`/notes/${targetNote.id}`, { replace: false });
      } else {
        alert(`Note "${noteName}" introuvable`);
      }
    } catch (error) {
      console.error('Erreur recherche note:', error);
    }
  }, [navigate]);


  if (loading) {
    return (
      <div className="h-screen flex bg-gradient-to-b from-[#08090A] to-[#101011]">
        <Sidebar />
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
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          breadcrumbItems={[
            { label: 'Notes', onClick: () => navigate('/notes') },
            { label: title || 'Sans titre' }
          ]}
        />

        <div className="flex-1 overflow-y-auto px-32">
          {/* Titre éditable + indicateur de sauvegarde */}
          <div className="flex items-center gap-4 mb-2">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Sans titre"
              className="flex-1 text-24 font-semibold text-neutral-0 bg-transparent border-none outline-none focus:outline-none"
            />

            {/* Indicateur de sauvegarde */}
            {saveStatus === 'saving' && (
              <span className="text-13 text-neutral-500">Enregistrement...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-13 text-green-500">✓ Enregistré</span>
            )}
          </div>

          {/* Date de création */}
          <p className="text-13 text-neutral-500 mb-6">
            Créé le {formatDate(note.createdAt)}
          </p>

          {/* Éditeur Novel */}
          <div className="mb-16">
            <NoteEditor
              content={content}
              onChange={handleContentChange}
              onMentionClick={handleMentionClick}
            />
          </div>
        </div>

        {/* Footer sticky avec Source éditable */}
        <div className="px-32 py-6">
          {/* Button Source */}
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

          {/* Stroke + input source éditable */}
          <div className="border-t border-neutral-800 pt-6">
            <input
              type="text"
              value={source}
              onChange={handleSourceChange}
              placeholder="Ajouter une source (URL, livre, article...)"
              className="w-full text-15 text-neutral-300 bg-transparent border-none outline-none focus:outline-none placeholder:text-neutral-600"
            />
          </div>
        </div>
      </main>
    </div>
  );
}