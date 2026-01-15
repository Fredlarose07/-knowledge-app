import type { MOC } from '../../lib/types';

interface MocCardProps {
  moc: MOC;
  onClick: () => void;
  onDelete: () => void;
}

export function MocCard({ moc, onClick, onDelete }: MocCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer group"
    >
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

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>📝</span>
          <span>
            {moc.noteCount.total} note{moc.noteCount.total > 1 ? 's' : ''}
          </span>
        </div>

        {moc.noteCount.total > 0 && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-500">
              {moc.noteCount.created} créée{moc.noteCount.created > 1 ? 's' : ''}
            </span>
            {moc.noteCount.pending > 0 && (
              <>
                <span className="text-neutral-700">•</span>
                <span className="text-neutral-500">
                  {moc.noteCount.pending} en attente
                </span>
              </>
            )}
          </div>
        )}

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