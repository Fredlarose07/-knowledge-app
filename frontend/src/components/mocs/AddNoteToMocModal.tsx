import { useState, useEffect } from 'react';
import { notesApi } from '../../lib/api/notes.api';
import { mocsApi } from '../../lib/api/mocs.api';
import type { Note } from '../../lib/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface AddNoteToMocModalProps {
  mocId: string;
  existingNoteIds: string[]; // IDs des notes déjà dans le MOC
  onClose: () => void;
  onNoteAdded: () => void;
}

export function AddNoteToMocModal({
  mocId,
  existingNoteIds,
  onClose,
  onNoteAdded,
}: AddNoteToMocModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const allNotes = await notesApi.getAllNotes();
      // Filtrer les notes déjà dans le MOC et les MOCs eux-mêmes
      const availableNotes = allNotes.filter(
        (note) => !existingNoteIds.includes(note.id)
      );
      setNotes(availableNotes);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Impossible de charger les notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedNoteId) return;

    try {
      setIsAdding(true);
      setError(null);
      await mocsApi.addNoteToMoc(mocId, selectedNoteId);
      onNoteAdded();
    } catch (err) {
      console.error('Error adding note to MOC:', err);
      setError('Impossible d\'ajouter la note');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Ajouter une note au MOC">
      <div className="space-y-4">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <p className="text-neutral-400 text-center py-4">Chargement...</p>
        ) : (
          <>
            {/* Liste des notes */}
            {notes.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">
                Aucune note disponible
              </p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedNoteId === note.id
                        ? 'bg-primary-600 border-primary-500'
                        : 'bg-neutral-900 border-neutral-800 hover:border-primary-500'
                    }`}
                  >
                    <h3 className="text-neutral-100 font-medium">
                      {note.title}
                    </h3>
                    {note.source && (
                      <p className="text-sm text-neutral-400 mt-1">
                        {note.source}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                variant="secondary"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={!selectedNoteId || isAdding}
                className="flex-1"
              >
                {isAdding ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}