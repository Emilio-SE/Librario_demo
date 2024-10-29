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
  formatId?: number;
  price?: number;
  asExpense?: boolean;
  genres: number[];
  tags: number[];
  shelves: number[];
  booksets: number[];
}
