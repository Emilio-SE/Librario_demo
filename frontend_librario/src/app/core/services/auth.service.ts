import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';

@Injectable()

export class AuthService {

  private tokenExpirationTimer: any;
  private tokenExpirationDate: Date | undefined;

  constructor(private router: Router)
  {
    this.checkTokenExpirationDate();
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.startTokenExpirationTimer();
  }

  public getId(): string | null {
    return this.decodeToken('id');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.stopTokenExpirationTimer();
    this.router.navigate(['/login']);
  }

  public isTokenExpired(): boolean {
    
    if(!this.tokenExpirationDate) return true;

    const currentTime = new Date().getTime();
    return this.tokenExpirationDate.getTime() <= currentTime;
  }

  private checkTokenExpirationDate(): void {
    const tokenExpiration = this.getTokenExpirationDate();
    this.tokenExpirationDate = tokenExpiration;
  }

  private startTokenExpirationTimer(): void {

    const token = this.getToken();

    if (token) {
      const expirationDate = this.getTokenExpirationDate();
      const currentTime = new Date().getTime();
      const timeToExpiration = expirationDate.getTime() - currentTime;
      
      this.checkTokenExpirationDate();
      
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, timeToExpiration);
    }

  }

  private getTokenExpirationDate(): Date {
    const token = this.getToken();
    if (!token) new Date(0);

    const dateNumber = parseInt(this.decodeToken('exp') || '0', 10);
    return new Date(dateNumber * 1000);
  }

  private stopTokenExpirationTimer(): void {
    this.tokenExpirationDate = undefined;
    clearTimeout(this.tokenExpirationTimer);
  }

  private decodeToken(property: string): string | null {
    const token = this.getToken();

    if(token){
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
      
      return decodedData[property] || null;
    }

    return null;
  }

}