export interface BookDetails {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  publisher?: string;
  edition?: string;
  language?: string;
  pages?: number;
  publicationDate?: string;
  acquisitionDate?: string;
  format?: ItemDetails;
  price?: number;
  asExpense?: boolean;
  coverUrl?: string;
  genre: ItemDetails[];
  tag: ItemDetails[];
  booksets: ItemDetails[];
  bookshelfShelves: Shelves[];
}

export interface Shelves {
  bookshelfId: ItemDetails;
  shelves: ItemDetails[];
}

export interface BookPreview {
  id: number;
  title: string;
  author: string;
  coverUrl?: string;
}

export interface CreateBook {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  publisher?: string;
  edition?: string;
  language?: string;
  pages?: number;
  publicationDate?: string;
  acquisitionDate?: string;
  format?: number;
  price?: number;
  asExpense?: boolean;
  coverUrl?: string;
  genre?: number[];
  tag?: number[];
  bookset?: number[];
}

export interface UpdateBook {
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  edition?: string;
  language?: string;
  pages?: number;
  publicationDate?: string;
  acquisitionDate?: string;
  format?: number;
  price?: number;
  asExpense?: boolean;
  coverUrl?: string;
  genre?: number[];
  tag?: number[];
  bookset?: number[];
}

export interface Format {
  id: number;
  name: string;
}

export interface ItemDetails {
  id: number;
  name: string;
}

export interface BookDetailsOL{
  title: string;
  authors: AuthorOL[];
  publish_date: string;
  type: TypeOL;
  source_records: string[];
  publishers: string[];
  physical_format: string;
  covers: number[];
  local_id: string[];
  isbn_10: string[];
  isbn_13: string[];
  ocaid: string;
  key: string;
  number_of_pages: number;
  works: WorkOL[];
  latest_revision: number;
  revision: number;
  created: CreatedOL;
  last_modified: LastModifiedOL;
}

interface AuthorOL {
  key: string;
}

interface TypeOL {
  key: string;
}

interface WorkOL {
  key: string;
}

interface CreatedOL {
  type: string;
  value: string;
}

interface LastModifiedOL {
  type: string;
  value: string;
}