import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ReadingsSubmenuCommunicationService {
  private _openSubmenu: Subject<void> = new Subject<void>();

  constructor() {}

  public openSubmenu() {
    this._openSubmenu.next();
  }

  public get openSubmenu$() {
    return this._openSubmenu.asObservable();
  }
}
