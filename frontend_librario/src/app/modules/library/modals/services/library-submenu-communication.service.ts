import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LibrarySubmenuCommunicationService {

  private _openBookSubmenu = new Subject<void>();
  private _openBooksetSubmenu = new Subject<void>();
  private _openBookshelfSubmenu = new Subject<void>();

  constructor() {}

  public openBookSubmenu(value: void) {
    this._openBookSubmenu.next(value);
  }

  public get signalOpenBookSubmenu() {
    return this._openBookSubmenu.asObservable();
  }

  public openBooksetSubmenu(value: void) {
    this._openBooksetSubmenu.next(value);
  }

  public get signalOpenBooksetSubmenu() {
    return this._openBooksetSubmenu.asObservable();
  }

  public openBookshelfSubmenu(value: void) {
    this._openBookshelfSubmenu.next(value);
  }

  public get signalOpenBookshelfSubmenu() {
    return this._openBookshelfSubmenu.asObservable();
  }

}
