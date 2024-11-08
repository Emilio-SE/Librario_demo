import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookSummary, CreateReading, ReadingDetails, ReadingPreview, UpdateReading } from '../interfaces/readings.interface';

@Injectable()
export class ReadingsService {
  private _http = inject(HttpClient);

  constructor() {}

  public getReadings(): Observable<ReadingPreview[]> {
    return this._http.get<ReadingPreview[]>(environment.reading);
  }

  public getReading(id: string): Observable<ReadingDetails> {
    return this._http.get<ReadingDetails>(`${environment.reading}/${id}`);
  }

  public getBooksReading(id: string): Observable<BookSummary> {
    return this._http.get<BookSummary>(`${environment.reading}/book/${id}`);
  }

  public createReading(reading: CreateReading): Observable<any> {
    return this._http.post(environment.reading, reading);
  }

  public updateReading(readingId: string, reading: UpdateReading): Observable<any> {
    return this._http.patch(`${environment.reading}/${readingId}`, reading);
  }

  public deleteReading(id: string): Observable<any> {
    return this._http.delete(`${environment.reading}/${id}`);
  }

}
