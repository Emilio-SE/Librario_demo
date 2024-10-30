export interface ShelfSummaryDto {
  id: string;
  name: string;
  booksQuantity: string;
}

export interface BookshelfDetailsDto {
  id: string;
  name: string;
  shelves: ShelfSummaryDto[];
}
