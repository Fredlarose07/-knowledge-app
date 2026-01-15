export interface MOC {
  id: string;
  title: string;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  noteCount: number;
}

export interface MOCNote {
  id: string;
  title: string;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MOCDetail {
  id: string;
  title: string;
  content: any; // JSON (format Tiptap)
  source: string | null;
  createdAt: string;
  updatedAt: string;
  notes: MOCNote[];
}

export interface CreateMOCDto {
  title: string;
  content?: any;
  source?: string;
}

export interface UpdateMOCDto {
  title?: string;
  content?: any;
  source?: string;
}