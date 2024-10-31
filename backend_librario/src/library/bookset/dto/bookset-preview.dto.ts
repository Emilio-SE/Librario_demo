export class BooksetPreviewDto {
  id: number;
  name: string;
  books: {
    id: number;
    title: string;
    author: string;
  }[];
}
