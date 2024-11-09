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
  genres: ItemDetails[];
  tags: ItemDetails[];
  booksets: ItemDetails[];
  bookshelfShelves: Shelves[];
}

export interface Shelves {
  bookshelf: ItemDetails;
  shelves: ItemDetails[];
}

export interface ItemDetails {
  id: number;
  name: string;
}