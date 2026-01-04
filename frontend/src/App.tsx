import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NotesListPage from './pages/NotesListPage';
import NoteEditorPage from './pages/NoteEditorPage'; // ← Nouveau import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route path="/notes" element={<NotesListPage />} />
        <Route path="/notes/:id" element={<NoteEditorPage />} /> {/* ← Nouvelle route */}
        <Route path="*" element={<Navigate to="/notes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;