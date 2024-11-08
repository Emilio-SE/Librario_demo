export interface ReadingPreview {
  id: number;
  title: string;
  author: string;
  cover: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
}

export interface ReadingDetails {
  id: number;
  title: string;
  author: string;
  cover: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  rate: string | null;
  review: string;
  startReadingDate: string | null;
  endReadingDate: string | null;
}

export interface UpdateReading {
  rate?: string;
  review?: string;
  currentPage?: number;
  startReadingDate?: string;
  endReadingDate?: string;
}

export interface CreateReading {
  book: string;
  currentPage: number;
  startReadingDate?: string;
}

export interface BookSummary {
  id: number;
  title: string;
  author: string;
  totalPages: number;
  cover: string;
}
