import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { PageHeader } from '../../components/layout/PageHeader';
import { mocsApi } from '../../lib/api/mocs.api';
import { ToastContext } from '../../App';
import type { MOC } from '../../lib/types';

export default function MocsListPage() {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const [mocs, setMocs] = useState<MOC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMocs();
  }, []);

  const loadMocs = async () => {
    try {
      setLoading(true);
      const data = await mocsApi.getAllMocs();
      setMocs(data);
    } catch (error) {
      console.error('Erreur chargement MOCs:', error);
      toast?.error('Impossible de charger les MOCs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMoc = async () => {
    try {
      const newMoc = await mocsApi.createMoc({
        title: 'Nouveau MOC',
        content: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [] }],
        },
      });

      await loadMocs();
      navigate(`/mocs/${newMoc.id}`);
    } catch (error) {
      console.error('Erreur création MOC:', error);
      toast?.error('Impossible de créer le MOC');
    }
  };

  const handleSelectMoc = (mocId: string) => {
    navigate(`/mocs/${mocId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar />

      <main className="ml-[240px]">
        <PageHeader
          breadcrumbItems={[{ label: "Moc's" }]}
          action={{
            label: 'Créer un MOC',
            onClick: handleCreateMoc
          }}
        />
        
        <div className="px-32 py-8">
          {loading ? (
            <div className="text-center text-neutral-500 py-8">
              Chargement des MOCs...
            </div>
          ) : mocs.length === 0 ? (
            <div className="text-center text-neutral-500 py-8">
              <p className="text-15 mb-2">Aucun MOC pour l'instant</p>
              <p className="text-13 text-neutral-600">
                Créez votre premier MOC pour organiser vos notes
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {mocs.map((moc) => (
                <button
                  key={moc.id}
                  onClick={() => handleSelectMoc(moc.id)}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-neutral-850 transition-colors"
                >
                  <h3 className="text-15 font-medium text-neutral-0">
                    {moc.title || 'Sans titre'}
                  </h3>
                  <div className="flex items-center gap-3 text-13 text-neutral-600 mt-1">
                    <span>
                      {moc.noteCount.total} note{moc.noteCount.total > 1 ? 's' : ''}
                    </span>
                    {moc.noteCount.total > 0 && (
                      <>
                        <span className="text-neutral-700">•</span>
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
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}