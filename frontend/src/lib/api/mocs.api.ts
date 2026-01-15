import { apiClient } from './client';
import type {
  MOC,
  MOCDetail,
  CreateMOCDto,
  UpdateMOCDto,
} from '../types/moc.types';

export const mocsApi = {
  // GET /mocs - Liste tous les MOCs
  async getAllMocs(): Promise<MOC[]> {
    const response = await apiClient.get('/mocs');
    return response.data;
  },

  // POST /mocs - Créer un nouveau MOC
  async createMoc(payload: CreateMOCDto): Promise<MOCDetail> {
    const response = await apiClient.post('/mocs', payload);
    return response.data;
  },

  // GET /mocs/:id - Récupérer un MOC avec ses notes
  async getMocById(id: string): Promise<MOCDetail> {
    const response = await apiClient.get(`/mocs/${id}`);
    return response.data;
  },

  // PUT /mocs/:id - Mettre à jour un MOC
  async updateMoc(id: string, payload: UpdateMOCDto): Promise<MOCDetail> {
    const response = await apiClient.put(`/mocs/${id}`, payload);
    return response.data;
  },

  // DELETE /mocs/:id - Supprimer un MOC
  async deleteMoc(id: string): Promise<void> {
    await apiClient.delete(`/mocs/${id}`);
  },

  // POST /mocs/:mocId/notes - Ajouter une note au MOC
  async addNoteToMoc(mocId: string, noteId: string): Promise<void> {
    await apiClient.post(`/mocs/${mocId}/notes`, { noteId });
  },

  // DELETE /mocs/:mocId/notes/:noteId - Retirer une note du MOC
  async removeNoteFromMoc(mocId: string, noteId: string): Promise<void> {
    await apiClient.delete(`/mocs/${mocId}/notes/${noteId}`);
  },
};