// frontend/src/pages/NotesListPage.tsx

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { NotesListView } from '../components/views/NotesListView';
import { notesApi } from '../lib/api';
import { ToastContext } from '../App';
import type { Note } from '../lib/types';

export default function NotesListPage() {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Erreur chargement notes:', error);
      toast?.error('Impossible de charger les notes. Le backend tourne-t-il ?');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await notesApi.createNote({
        title: 'Nouvelle note',
        content: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [] }],
        },
      });
      
      await loadNotes();
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error('Erreur création note:', error);
      toast?.error('Impossible de créer la note');
    }
  };

  const handleSelectNote = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar />
      
      <main className="ml-[240px]">
        <PageHeader
          breadcrumbItems={[{ label: 'Notes' }]}
          action={{
            label: 'Créer une note',
            onClick: handleCreateNote
          }}
        />
        <NotesListView
          notes={notes}
          loading={loading}
          onSelectNote={handleSelectNote}
        />
      </main>
    </div>
  );
}