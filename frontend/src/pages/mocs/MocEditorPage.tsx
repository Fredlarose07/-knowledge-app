import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { NoteEditor } from '../../components/editor/NoteEditor';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { clearNoteCache } from '../../components/editor/NoteMentionExtension';
import { mocsApi } from '../../lib/api/mocs.api';
import { notesApi } from '../../lib/api/notes.api';
import { ToastContext } from '../../App';
import type { MOCDetail } from '../../lib/types';

export default function MocEditorPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useContext(ToastContext);

    const [moc, setMoc] = useState<MOCDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<any>(null);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const saveTimerRef = useRef<number | null>(null);
    const titleSaveTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!id) {
            navigate('/mocs');
            return;
        }
        loadMoc(id);
    }, [id, navigate]);

    const loadMoc = async (mocId: string) => {
        try {
            setLoading(true);
            const data = await mocsApi.getMocById(mocId);
            setMoc(data);
            setTitle(data.title);
            setContent(data.content);
        } catch (error) {
            console.error('Erreur chargement MOC:', error);
            toast?.error('Impossible de charger le MOC');
            navigate('/mocs');
        } finally {
            setLoading(false);
        }
    };

    const saveMoc = async (mocId: string, updates: { title?: string; content?: any }) => {
        try {
            setSaveStatus('saving');
            await mocsApi.updateMoc(mocId, updates);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            setSaveStatus('idle');
            toast?.error('Erreur lors de la sauvegarde');
        }
    };

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        if (titleSaveTimerRef.current) {
            clearTimeout(titleSaveTimerRef.current);
        }

        titleSaveTimerRef.current = setTimeout(() => {
            if (id) {
                saveMoc(id, { title: newTitle });
            }
        }, 1000) as unknown as number;
    }, [id]);

    const handleContentChange = useCallback((newContent: any) => {
        setContent(newContent);

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(() => {
            if (id) {
                saveMoc(id, { content: newContent });
            }
        }, 1000) as unknown as number;
    }, [id]);

    const checkNoteExists = useCallback(async (noteName: string): Promise<boolean> => {
        try {
            const result = await notesApi.checkNoteExists(noteName);
            return result.exists;
        } catch (error) {
            console.error('Erreur vérification note:', error);
            return false;
        }
    }, []);

    const handleMentionClick = useCallback(async (noteName: string) => {
        try {
            const result = await notesApi.checkNoteExists(noteName);

            if (result.exists && result.noteId) {
                navigate(`/notes/${result.noteId}`);
            } else {
                const newNote = await notesApi.createNote({
                    title: noteName,
                    content: {
                        type: 'doc',
                        content: [{ type: 'paragraph', content: [] }],
                    },
                });

                // Clear le cache pour cette note
                clearNoteCache(noteName);  // ← AJOUTE CETTE LIGNE

                navigate(`/notes/${newNote.id}`);
            }
        } catch (error) {
            console.error('Erreur lors du clic sur mention:', error);
            toast?.error('Erreur lors de la navigation');
        }
    }, [navigate, toast]);

    const handleDeleteMoc = async () => {
        if (!id) return;

        try {
            setIsDeleting(true);
            await mocsApi.deleteMoc(id);
            navigate('/mocs');
        } catch (error) {
            console.error('Erreur suppression MOC:', error);
            toast?.error('Impossible de supprimer le MOC');
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            if (titleSaveTimerRef.current) {
                clearTimeout(titleSaveTimerRef.current);
            }
        };
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short',
        }).format(date);
    };

    if (loading) {
        return <LoadingSkeleton variant="note-editor" />;
    }

    if (!moc) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <Sidebar />

            <main className="ml-[240px]">
                <PageHeader
                    breadcrumbItems={[
                        { label: "Moc's", onClick: () => navigate('/mocs') },
                        { label: title || 'Sans titre' }
                    ]}
                >
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="small"
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                            }
                            iconPosition="left"
                            onClick={() => navigate('/mocs')}
                        >
                            Retour
                        </Button>

                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-1.5 rounded-lg bg-[#1E2025] hover:bg-neutral-750 border border-[#2A2D33] text-neutral-400 hover:text-red-500 transition-colors"
                            title="Supprimer le MOC"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </PageHeader>

                <div className="px-32 py-8">
                    <div className="flex items-center gap-4 mb-2">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Sans titre"
                            className="flex-1 text-24 font-semibold text-neutral-0 bg-transparent border-none outline-none focus:outline-none placeholder:text-[#565A64]"
                        />

                        {saveStatus === 'saving' && (
                            <span className="text-13 text-neutral-500">Enregistrement...</span>
                        )}
                        {saveStatus === 'saved' && (
                            <span className="text-13 text-green-500">✓ Enregistré</span>
                        )}
                    </div>

                    <p className="text-13 font-medium text-[#565A64] mb-6">
                        Créé le {formatDate(moc.createdAt)}
                    </p>

                    <div className="mb-16">
                        <NoteEditor
                            content={content}
                            onChange={handleContentChange}
                            onMentionClick={handleMentionClick}
                            checkNoteExists={checkNoteExists}
                            placeholder="Décrivez ce MOC, créez votre roadmap avec des liens [[note]]..."
                        />
                    </div>
                </div>
            </main>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteMoc}
                noteTitle={title || 'Sans titre'}
                isDeleting={isDeleting}
            />
        </div>
    );
}