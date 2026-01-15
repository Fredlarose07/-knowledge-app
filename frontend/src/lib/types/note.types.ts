
// User (simplifié pour le MVP avec user unique)
export interface User {
  id: string;
  email: string;
  name: string | null;
}

// Note principale
export interface Note {
  id: string;
  title: string;
  content: any; // JSON (format Novel/Tiptap)
  source: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  linksTo?: NoteLink[];
  linkedFrom?: NoteLink[];
}

// Lien bidirectionnel entre notes
export interface NoteLink {
  id: string;
  sourceId: string;
  targetId: string;
  createdAt: string;
  // Relations populées
  source?: Note;
  target?: Note;
}

// DTOs pour les requêtes API
export interface CreateNoteDto {
  title: string;
  content: any;
  source?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: any;
  source?: string;
}

// Réponses API
export interface NoteDetailResponse extends Note {
  linksTo: NoteLink[];
  linkedFrom: NoteLink[];
}

export interface BacklinksResponse {
  note: Note;
  backlinks: Note[];
}