import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, Login, Register } from '../interfaces/auth.interface';

@Injectable()
export class LoginService {
  private _httpSvc = inject(HttpClient);

  constructor() {}

  public login(credentials: Login): Observable<AuthResponse> {
    return this._httpSvc.post<AuthResponse>(environment.auth, credentials);
  }

  public register(data: Register): Observable<any> {
    return this._httpSvc.post(environment.register, data);
  }
}
