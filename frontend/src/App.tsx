import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NotesListPage from './pages/NotesListPage';
import NoteEditorPage from './pages/NoteEditorPage';
import MocsPage from './pages/MocsPage';
import SchemasPage from './pages/SchemasPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route path="/notes" element={<NotesListPage />} />
        <Route path="/notes/:id" element={<NoteEditorPage />} />
        <Route path="/mocs" element={<MocsPage />} />
        <Route path="/schemas" element={<SchemasPage />} />
        <Route path="*" element={<Navigate to="/notes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;