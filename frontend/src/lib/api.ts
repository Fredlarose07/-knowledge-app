// frontend/src/lib/api.ts
import { apiClient } from './api-client';
import type { 
  Note, 
  NoteDetailResponse, 
  CreateNoteDto, 
  UpdateNoteDto 
} from './types';

export const notesApi = {
  // GET /notes - Liste toutes les notes
  async getAllNotes(): Promise<Note[]> {
    const response = await apiClient.get('/notes');
    return response.data;
  },

  // GET /notes/:id - Détail d'une note
  async getNoteById(id: string): Promise<NoteDetailResponse> {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },

  // POST /notes - Créer une note
  async createNote(data: CreateNoteDto): Promise<Note> {
    const response = await apiClient.post('/notes', data);
    return response.data;
  },

  // PATCH /notes/:id - Mettre à jour une note
  async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
    const response = await apiClient.patch(`/notes/${id}`, data);
    return response.data;
  },

  // DELETE /notes/:id - Supprimer une note
  async deleteNote(id: string): Promise<void> {
    await apiClient.delete(`/notes/${id}`);
  },

  // GET /notes/exists?title=XXX - Vérifier si une note existe
  async checkNoteExists(title: string): Promise<{ exists: boolean; noteId?: string }> {
    const response = await apiClient.get('/notes/exists', {
      params: { title },
    });
    return response.data;
  },

  // GET /notes/:id/backlinks - Notes qui mentionnent cette note
  async getBacklinks(id: string): Promise<Note[]> {
    const response = await apiClient.get(`/notes/${id}/backlinks`);
    return response.data;
  },
};

// API Auth (hardcodé pour MVP)
export const authApi = {
  async getCurrentUser() {
    return {
      id: 'user-demo',
      email: 'demo@knowledge.app',
      name: 'Demo User',
    };
  },
};