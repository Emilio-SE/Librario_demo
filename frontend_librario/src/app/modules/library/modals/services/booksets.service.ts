import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  BooksetDetails,
  BooksetPreview,
  CreateBookset,
  UpdateBookset,
} from '../interfaces/bookset.interface';

@Injectable()
export class BooksetsService {
  private _http = inject(HttpClient);

  constructor() {}

  public getBooksets(): Observable<BooksetPreview[]> {
    return this._http.get<BooksetPreview[]>(environment.bookset);
  }

  public getBookset(id: string): Observable<BooksetDetails> {
    return this._http.get<BooksetDetails>(`${environment.bookset}/${id}`);
  }

  public createBookset(bookset: CreateBookset): Observable<any> {
    return this._http.post<any>(environment.bookset, bookset);
  }

  public updateBookset(id: string, bookset: UpdateBookset): Observable<any> {
    return this._http.patch<any>(`${environment.bookset}/${id}`, bookset);
  }

  public deleteBookset(id: string): Observable<any> {
    return this._http.delete<any>(`${environment.bookset}/${id}`);
  }
}
