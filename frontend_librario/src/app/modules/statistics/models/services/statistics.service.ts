import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ExpensesPerMonth,
  ReadsPerMonth,
} from '../interfaces/statistics.interface';
import { Observable } from 'rxjs';

@Injectable()
export class StatisticsService {
  private _http = inject(HttpClient);

  constructor() {}

  public getBooksStatistics(): Observable<ReadsPerMonth[]> {
    return this._http.get<ReadsPerMonth[]>(
      `${environment.booksStatistics}/read`
    );
  }

  public getFinanceStatistics(): Observable<ExpensesPerMonth[]> {
    return this._http.get<ExpensesPerMonth[]>(
      `${environment.moneyStatistics}/expenses`
    );
  }
}
