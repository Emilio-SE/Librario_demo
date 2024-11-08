import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookshelfDetails, BookshelfPreview, CreateBookshelf, CreateShelf, ShelfDetails, UpdateBookshelf, UpdateShelf } from '../interfaces/bookshelf.interface';

@Injectable({
  providedIn: 'root',
})
export class BookshelfService {

  private _http: HttpClient = inject(HttpClient);

  constructor() {}

  public getBookshelves(): Observable<BookshelfPreview[]> {
    return this._http.get<BookshelfPreview[]>(environment.bookshelf);
  }

  public getBookshelf(id: string): Observable<BookshelfDetails> {
    return this._http.get<BookshelfDetails>(`${environment.bookshelf}/${id}`);
  }

  public createBookshelf(data: CreateBookshelf): Observable<any> {
    return this._http.post(environment.bookshelf, data);
  }

  public updateBookshelf(id: string, data: UpdateBookshelf): Observable<any> {
    return this._http.patch(`${environment.bookshelf}/${id}`, data);
  }

  public deleteBookshelf(id: string): Observable<any> {
    return this._http.delete(`${environment.bookshelf}/${id}`);
  }

  public getShelves(bookshelfId: string): Observable<any> {
    const url = environment.shelf.replace(':bookshelf_id', bookshelfId);
    return this._http.get(url);
  }

  public getShelfDetails(bookshelfId: string, shelfId: string): Observable<ShelfDetails> {
    const url = environment.shelf.replace(':bookshelf_id', bookshelfId) + `/${shelfId}`;
    return this._http.get<ShelfDetails>(url);
  }

  public createShelf(bookshelfId: string, data: CreateShelf): Observable<any> {
    const url = environment.shelf.replace(':bookshelf_id', bookshelfId);
    return this._http.post(url, data);
  }

  public updateShelf(bookshelfId: string, shelfId: string, data: UpdateShelf): Observable<any> {
    const url = environment.shelf.replace(':bookshelf_id', bookshelfId) + `/${shelfId}`;
    return this._http.patch(url, data);
  }

  public deleteShelf(bookshelfId: string, shelfId: string): Observable<any> {
    const url = environment.shelf.replace(':bookshelf_id', bookshelfId) + `/${shelfId}`;
    return this._http.delete(url);
  }

}
