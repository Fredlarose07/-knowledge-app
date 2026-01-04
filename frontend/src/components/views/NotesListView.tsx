import React from 'react';
import { Button } from '../ui/Button';
import type { Note } from '../../lib/types';

interface NotesListViewProps {
  notes: Note[];
  onCreateNote: () => void;
  onSelectNote: (noteId: string) => void;
  loading?: boolean;
}

export const NotesListView: React.FC<NotesListViewProps> = ({
  notes,
  onCreateNote,
  onSelectNote,
  loading = false,
}) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#08090A] to-[#101011]">
      {/* Header avec breadcrumb + bouton */}
      <header className="px-32 py-6 mt-8 flex items-center justify-between"
        style={{ borderColor: 'rgba(44, 47, 52, 0.4)' }}>
        <div className="flex items-center gap-2 text-neutral-300">
        </div>

        <Button onClick={onCreateNote}>
          Créer une note
        </Button>
      </header>

      {/* Liste des notes */}
      <div className="flex-1 overflow-y-auto px-32">
        {loading ? (
          <div className="text-center text-neutral-500 py-8">
            Chargement des notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-neutral-500 py-8">
            <p className="text-15 mb-2">Aucune note pour l'instant</p>
            <p className="text-13 text-neutral-600">
              Créez votre première note pour commencer
            </p>
          </div>
        ) : (
          <div className="">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className="w-full text-left px-4 py-2 rounded-lg  hover:bg-neutral-850 transition-colors"
            
              >
                <h3 className="text-15 font-semibold text-neutral-0 ">
                  {note.title || 'Sans titre'}
                </h3>

              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};