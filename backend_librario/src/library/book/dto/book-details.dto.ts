export class BookDetailsDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  publisher?: string;
  edition?: string;
  language?: string;
  pages?: number;
  publicationDate?: Date;
  acquisitionDate?: Date;
  formatId?: number;
  price?: number;
  asExpense?: boolean;
  coverUrl?: string;
  genres: number[];
  tags: number[];
  booksets: number[];
  bookshelfShelves: Shelves[];
}

export interface Shelves {
  bookshelfId: number;
  shelves: number[];
}