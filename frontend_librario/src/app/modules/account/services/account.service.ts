import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AccountService {
  private _http = inject(HttpClient);

  constructor() {}

  public deleteAccount(password: string): Observable<any> {
    return this._http.delete(environment.delete_account, {
      body: { password },
    });
  }

  public getProfile(): Observable<any> {
    return this._http.get(environment.account);
  }
}
