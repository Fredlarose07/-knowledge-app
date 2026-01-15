import type { MOC } from '../../lib/types';

interface MocCardProps {
  moc: MOC;
  onClick: () => void;
  onDelete: () => void;
}

export function MocCard({ moc, onClick, onDelete }: MocCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le clic sur la carte
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer group"
    >
      {/* Header avec titre et bouton delete */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-neutral-100 group-hover:text-primary-500 transition-colors">
          {moc.title}
        </h3>
        <button
          onClick={handleDelete}
          className="text-neutral-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>

      {/* Metadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>📝</span>
          <span>
            {moc.noteCount} note{moc.noteCount > 1 ? 's' : ''}
          </span>
        </div>

        {moc.source && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>🔗</span>
            <span className="truncate">{moc.source}</span>
          </div>
        )}

        <div className="text-xs text-neutral-600 mt-4">
          Modifié le {new Date(moc.updatedAt).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </div>
  );
}