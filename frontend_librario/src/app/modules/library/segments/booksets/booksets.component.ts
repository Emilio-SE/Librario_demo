import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalController } from '@ionic/angular';

import { ManageBooksetsPage } from './manage-booksets/manage-booksets.page';
import { BooksetDetailsPage } from './bookset-details/bookset-details.page';

import { LibrarySubmenuCommunicationService } from '../../modals/services/library-submenu-communication.service';
import { BooksetsService } from '../../modals/services/booksets.service';

import { BooksetPreview } from '../../modals/interfaces/bookset.interface';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

@Component({
  selector: 'app-booksets',
  templateUrl: './booksets.component.html',
  styleUrls: ['./booksets.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksetsComponent implements OnInit {
  private _submenuCommSvc = inject(LibrarySubmenuCommunicationService);
  private _modalController = inject(ModalController);
  private _booksetSvc = inject(BooksetsService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  public booksetPreview: BooksetPreview[] = [];
  public isLoaded: boolean | undefined;
  public isModalOpen: boolean = false;

  private _toastUtil = new ToastrUtils();

  constructor() {}

  ngOnInit() {
    this.getBooksets(null);
    this.openSubmenu();
  }

  private openSubmenu(): void {
    this._submenuCommSvc.signalOpenBookSubmenu
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.isModalOpen = true;
          this._cdr.detectChanges();
        },
      });
  }

  public onModalDismiss(): void {
    this.isModalOpen = false;
    this._cdr.detectChanges();
  }

  public getBooksets(event: any): void {
    this.isLoaded = undefined;
    this._booksetSvc
      .getBooksets()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          this.booksetPreview = data;
          this.isLoaded = true;
          if (event) event.target.complete();
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._toastUtil.emitInfoToast('danger', 'Error al obtener los datos');
          this.isLoaded = false;
          if (event) event.target.complete();
          this._cdr.detectChanges();
        },
      });
  }

  public async openBooksetDetails(booksetId: number): Promise<void> {
    const modal = await this._modalController.create({
      component: BooksetDetailsPage,
      componentProps: {
        booksetId: booksetId,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getBooksets(null);
    });
  }

  public async openAddNewBookset(): Promise<void> {
    const modal = await this._modalController.create({
      component: ManageBooksetsPage,
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getBooksets(null);
    });
  }
}
