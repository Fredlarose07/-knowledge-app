// frontend/src/components/modals/DeleteConfirmModal.tsx

import React from 'react';
import { Button } from '../ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1A1D23] rounded-xl shadow-2xl max-w-md w-full border border-neutral-800">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-neutral-0">
                Supprimer cette note ?
              </h2>
            </div>
            <p className="text-15 text-neutral-400 leading-relaxed">
              Voulez-vous vraiment supprimer <span className="font-medium text-neutral-200">« {noteTitle} »</span> ? 
              Cette action est irréversible.
            </p>
          </div>

          <div className="px-6 pb-6 flex gap-3 justify-end">
            <Button 
              variant="secondary" 
              size="default"
              onClick={onClose}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium text-13 transition-colors disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};