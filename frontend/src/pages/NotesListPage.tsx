import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { NotesListView } from '../components/views/NotesListView';
import { notesApi } from '../lib/api';
import type { Note } from '../lib/types';

export default function NotesListPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('notes');
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
      alert('Impossible de charger les notes. Le backend tourne-t-il ?');
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
      
      console.log('Note créée:', newNote);
    } catch (error) {
      console.error('Erreur création note:', error);
      alert('Impossible de créer la note');
    }
  };

  const handleSelectNote = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <div className="h-screen flex bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 flex flex-col">
        {activeSection === 'notes' && (
          <>
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
          </>
        )}

        {activeSection === 'mocs' && (
          <div className="h-full flex items-center justify-center text-neutral-500">
            <p className="text-15">Section Mocs (à venir)</p>
          </div>
        )}

        {activeSection === 'schemas' && (
          <div className="h-full flex items-center justify-center text-neutral-500">
            <p className="text-15">Section Schemas (à venir)</p>
          </div>
        )}
      </main>
    </div>
  );
}