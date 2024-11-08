import { BookPreview } from './books.interface';

export interface BookshelfPreview {
  id: number;
  name: string;
  shelfQuantity: number;
}

export interface BookshelfDetails {
  id: number;
  name: string;
  shelves: BookshelfPreview[];
}

export interface CreateBookshelf {
  name: string;
}

export interface UpdateBookshelf {
  name: string;
}

export interface ShelfPreview {
  id: number;
  name: string;
  bookQuantity: number;
}

export interface ShelfDetails {
  id: number;
  name: string;
  books: BookInShelf[];
}

export interface BookInShelf {
  id: number;
  title: string;
  author: string;
  cover: string;
}

export interface CreateShelf {
  name: string;
  book: number[];
}

export interface UpdateShelf {
  name?: string;
  book?: number[];
}
