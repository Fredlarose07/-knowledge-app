/**
 * App.tsx - Test NotesListView avec API réelle
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { NotesListView } from './components/views/NotesListView';
import { notesApi } from './lib/api';
import type { Note } from './lib/types';

function App() {
  const [activeSection, setActiveSection] = useState('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Charger les notes au montage
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
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      });
      
      // Recharger les notes
      await loadNotes();
      
      // Sélectionner la nouvelle note
      setSelectedNoteId(newNote.id);
      
      console.log('Note créée:', newNote);
    } catch (error) {
      console.error('Erreur création note:', error);
      alert('Impossible de créer la note');
    }
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    console.log('Note sélectionnée:', noteId);
    // TODO: Afficher l'éditeur de note
  };

  return (
    <div className="h-screen flex bg-gradient-to-b from-[#08090A] to-[#101011]">
      {/* Sidebar menu */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Contenu principal */}
      <main className="flex-1">
        {activeSection === 'notes' && !selectedNoteId && (
          <NotesListView
            notes={notes}
            loading={loading}
            onCreateNote={handleCreateNote}
            onSelectNote={handleSelectNote}
          />
        )}

        {activeSection === 'notes' && selectedNoteId && (
          <div className="h-full flex items-center justify-center text-neutral-500">
            <div className="text-center">
              <p className="text-15 mb-2">Éditeur de note</p>
              <p className="text-13 text-neutral-600">
                Note ID: {selectedNoteId}
              </p>
              <button
                onClick={() => setSelectedNoteId(null)}
                className="mt-4 px-4 py-2 bg-neutral-800 text-neutral-0 rounded-lg hover:bg-neutral-700"
              >
                ← Retour à la liste
              </button>
            </div>
          </div>
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

export default App;