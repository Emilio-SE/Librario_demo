export interface BooksetPreview {
  id: number;
  name: string;
  bookQuantity: number;
}

export interface BooksetDetails {
  id: number;
  name: string;
  books: BookInBookset[];
}

export interface BookInBookset {
  id: number;
  title: string;
  author: string;
  cover: string;
}

export interface CreateBookset {
  name: string;
  book: number[];
}

export interface UpdateBookset {
  name?: string;
  book?: number[];
}
