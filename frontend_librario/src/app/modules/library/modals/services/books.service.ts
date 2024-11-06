import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  BookDetails,
  BookDetailsOL,
  BookPreview,
  CreateBook,
  Format,
  Shelves,
  UpdateBook,
} from '../interfaces/books.interface';

@Injectable()
export class BooksService {
  private _http = inject(HttpClient);

  constructor() {}

  getBookDetailsByISBN(isbn: string): Observable<CreateBook> {
    return this._http.get<BookDetailsOL>(`${environment.isbn}/${isbn}`).pipe(
      map((data) => {
        return {
          title: data.title,
          author: '',
          isbn: isbn,
          description: undefined,
          publisher: '',
          edition: undefined,
          language: undefined,
          pages: data.number_of_pages,
          publicationDate: new Date(data.publish_date)
            .toISOString()
            .split('T')[0],
          acquisitionDate: undefined,
          formatId: undefined,
          price: undefined,
          asExpense: false,
          coverUrl: `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`,
          genres: [],
          tags: [],
          booksets: [],
          bookshelfShelves: [],
        } as CreateBook;
      })
    );
  }

  getBooks(): Observable<BookPreview[]> {
    return this._http.get<BookPreview[]>(environment.book);
  }

  getBook(id: string): Observable<BookDetails> {
    return this._http.get<any>(`${environment.book}/${id}`).pipe(
      map((data) => {
        return {
          id: data.id,
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          description: data.description,
          publisher: data.publisher,
          edition: data.edition,
          booksets: data.booksets,
          bookshelfShelves: data.bookshelfShelves,
          publicationDate: data.publicationDate
            ? new Date(data.publicationDate).toISOString().split('T')[0]
            : '',
          acquisitionDate: data.acquisitionDate
            ? new Date(data.acquisitionDate).toISOString().split('T')[0]
            : '',
          coverUrl: data.coverUrl,
          format: data.formatId,
          genre: data.genres,
          tag: data.tags,
          asExpense: data.asExpense,
          language: data.language,
          pages: data.pages,
          price: data.price,
        } as BookDetails;
      })
    );
  }

  createBook(data: CreateBook): Observable<any> {
    return this._http.post(environment.book, data);
  }

  updateBook(id: string, data: UpdateBook): Observable<any> {
    return this._http.patch(`${environment.book}/${id}`, data);
  }

  deleteBook(id: string): Observable<any> {
    return this._http.delete(`${environment.book}/${id}`);
  }

  getFormats(): Observable<Format[]> {
    return this._http.get<Format[]>(environment.format);
  }
}
