// frontend/src/lib/api.ts

import axios from 'axios';
import type {
  Note,
  NoteDetailResponse,
  CreateNoteDto,
  UpdateNoteDto,
  BacklinksResponse,
  User,
} from './types';

// Configuration Axios
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Methods
export const notesApi = {
  // GET /notes - Liste toutes les notes
  getAllNotes: async (): Promise<Note[]> => {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  // GET /notes/:id - Détail d'une note avec liens
  getNoteById: async (id: string): Promise<NoteDetailResponse> => {
    const response = await api.get<NoteDetailResponse>(`/notes/${id}`);
    return response.data;
  },

  // POST /notes - Créer une note
  createNote: async (data: CreateNoteDto): Promise<Note> => {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  // PATCH /notes/:id - Modifier une note
  updateNote: async (id: string, data: UpdateNoteDto): Promise<Note> => {
    const response = await api.patch<Note>(`/notes/${id}`, data);
    return response.data;
  },

  // DELETE /notes/:id - Supprimer une note
  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  // GET /notes/:id/backlinks - Notes qui mentionnent cette note
  getBacklinks: async (id: string): Promise<BacklinksResponse> => {
    const response = await api.get<BacklinksResponse>(`/notes/${id}/backlinks`);
    return response.data;
  },

  // GET /notes/exists?title=Budget - Vérifie si une note existe
  checkNoteExists: async (title: string): Promise<{ exists: boolean; noteId?: string }> => {
    const response = await api.get<{ exists: boolean; noteId?: string }>(
      '/notes/exists',
      {
        params: { title },
      }
    );
    return response.data;
  },
};

// User API
export const authApi = {
  // GET /me - User actuel
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/me');
    return response.data;
  },
};

export default api;