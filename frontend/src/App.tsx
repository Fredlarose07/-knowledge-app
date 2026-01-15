// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NotesListPage from './pages/NotesListPage';
import NoteEditorPage from './pages/NoteEditorPage';
import MocsListPage from './pages/mocs/MocsListPage';
import MocEditorPage from './pages/mocs/MocEditorPage';
import SchemasPage from './pages/SchemasPage';
import { ToastContainer } from './components/ui/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useToast } from './hooks/useToast';
import { createContext } from 'react';

// Context pour partager les toasts dans toute l'app
export const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

function App() {
  const toast = useToast();

  return (
    <ErrorBoundary>
      <ToastContext.Provider value={toast}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="/notes" element={<NotesListPage />} />
            <Route path="/notes/:id" element={<NoteEditorPage />} />
            <Route path="/mocs" element={<MocsListPage />} />
            <Route path="/mocs/:id" element={<MocEditorPage />} />
            <Route path="/schemas" element={<SchemasPage />} />
            <Route path="*" element={<Navigate to="/notes" replace />} />
          </Routes>
        </BrowserRouter>

        {/* Toast Container - affiche les notifications */}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </ToastContext.Provider>
    </ErrorBoundary>
  );
}

export default App;