import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BookshelfService } from '../../modals/services/bookshelf.service';
import { BookshelfPreview } from '../../modals/interfaces/bookshelf.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { LibrarySubmenuCommunicationService } from '../../modals/services/library-submenu-communication.service';
import { BookshelfDetailsPage } from './bookshelf-details/bookshelf-details.page';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookshelfComponent implements OnInit {
  private _modalController = inject(ModalController);
  private _submenuCommSvc = inject(LibrarySubmenuCommunicationService);
  private _bsSvc = inject(BookshelfService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  public isLoaded: boolean | undefined;
  public bookshelves: BookshelfPreview[] = [];
  public isModalOpen: boolean = false;

  private _toastrUtil = new ToastrUtils();

  constructor() {}

  ngOnInit() {
    this.getBookshelves(null);
    this.openSubmenu();
  }

  public async closeModal() {
    await this._modalController.dismiss();
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

  public getBookshelves(event?: any): void {
    this.isLoaded = undefined;
    this._bsSvc
      .getBookshelves()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (bookshelves) => {
          console.log(bookshelves);
          this.bookshelves = bookshelves;
          if (event) event.target.complete();
          this.isLoaded = true;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al obtener los datos ' + err.error.message
          );
          this.isLoaded = false;
          if (event) event.target.complete();
          this._cdr.detectChanges();
        },
      });
  }

  public onModalDismiss(): void {
    this.isModalOpen = false;
    this._cdr.detectChanges();
  }

  public openAddNewBookshelf(): void {
    this._toastrUtil.addAlert(
      'Librero',
      'Escribe el nombre del librero',
      (data) => {
        this.createBookshelf(data.bookshelfName);
      },
      undefined,
      {
        name: 'bookshelfName',
        placeholder: 'Nombre del librero',
      }
    );
  }

  private createBookshelf(name: string): void {
    this._bsSvc
      .createBookshelf({ name })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.getBookshelves(null);
        },
        error: (err) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al crear el librero ' + err.error.message
          );
        },
      });
  }

  public async openBookshelfDetails(bookshelfId: number): Promise<void> {
    const modal = await this._modalController.create({
      component: BookshelfDetailsPage,
      componentProps: {
        bookshelfId: bookshelfId,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(async (data) => {
      if (data.data?.data) {
        await this.closeModal();
        await this.closeModal();
        return;
      } else {
        this.getBookshelves(null);
      }
    });
  }
}
