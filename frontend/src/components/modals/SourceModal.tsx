// src/components/modals/SourceModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  onSave: (source: string) => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  isOpen,
  onClose,
  source,
  onSave,
}) => {
  const [localSource, setLocalSource] = useState(source);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalSource(source);
  }, [source]);

  // Debounce auto-save
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSource = e.target.value;
    setLocalSource(newSource);

    // Clear le timer précédent
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Nouvelle sauvegarde après 1 seconde
    saveTimerRef.current = setTimeout(() => {
      onSave(newSource);
    }, 1000);
  };

  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const footer = (
    <div className="flex gap-3 justify-end">
      <Button variant="secondary" size="small" onClick={onClose}>
        Fermer
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Source"
      footer={footer}
      width="md"
    >
      <div className="space-y-4">
        {/* Label */}
        <label className="block">
          <span className="text-13 font-medium text-neutral-300 mb-2 block">
            URL ou référence
          </span>
          <input
            type="text"
            value={localSource}
            onChange={handleChange}
            placeholder="https://... ou Livre: Titre, Auteur"
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-15 text-neutral-0 placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
            autoFocus
          />
        </label>

        {/* Info future pour multiples sources */}
        <p className="text-12 text-neutral-500 italic">
          💡 Bientôt : possibilité d'ajouter plusieurs sources
        </p>
      </div>
    </Modal>
  );
};