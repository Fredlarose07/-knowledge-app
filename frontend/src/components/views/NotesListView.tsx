import React from 'react';
import type { Note } from '../../lib/types';

interface NotesListViewProps {
  notes: Note[];
  onSelectNote: (noteId: string) => void;
  loading?: boolean;
}

export const NotesListView: React.FC<NotesListViewProps> = ({
  notes,
  onSelectNote,
  loading = false,
}) => {
  return (
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
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-neutral-850 transition-colors"
            >
              <h3 className="text-15 font-semibold text-neutral-0">
                {note.title || 'Sans titre'}
              </h3>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};