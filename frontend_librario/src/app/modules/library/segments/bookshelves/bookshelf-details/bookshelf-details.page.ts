import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BookshelfService } from '../../../modals/services/bookshelf.service';
import { ShelfPreview } from '../../../modals/interfaces/bookshelf.interface';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { ManageShelfPage } from '../manage-shelf/manage-shelf.page';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShelfDetailsPage } from '../shelf-details/shelf-details.page';

@Component({
  selector: 'app-bookshelf-details',
  templateUrl: './bookshelf-details.page.html',
  styleUrls: ['./bookshelf-details.page.scss'],
})
export class BookshelfDetailsPage implements OnInit {
  private _modalController = inject(ModalController);
  private _bsSvc = inject(BookshelfService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  public isLoaded: boolean | undefined;
  public shelves: ShelfPreview[] = [];
  public isModalOpen: boolean = false;

  private _toastrUtil = new ToastrUtils();

  @Input() bookshelfId: number = -1;

  constructor() {}

  ngOnInit() {
    this.getShelves();
  }

  public async closeModal(data?: any) {
    await this._modalController.dismiss();
  }

  public getShelves(): void {
    this.isLoaded = undefined;
    this._bsSvc
      .getShelves(this.bookshelfId.toString())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (shelves) => {
          this.shelves = shelves;
          this.isLoaded = true;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al cargar los estantes ' + err.error.message
          );
          this.isLoaded = false;
          this._cdr.detectChanges();
        },
      });
  }

  public async openAddNewShelf() {
    const modal = await this._modalController.create({
      component: ManageShelfPage,
      componentProps: {
        bookshelfId: this.bookshelfId,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getShelves();
    });
  }

  public async openShelfDetails(shelfId: number) {
    const modal = await this._modalController.create({
      component: ShelfDetailsPage,
      componentProps: {
        bookshelfId: this.bookshelfId,
        shelfId: shelfId,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getShelves();
    });
  }

  public openEditBookshelf() {
    this._toastrUtil.addAlert(
      'Cambiar nombre',
      'Escribe el nuevo nombre del librero',
      (data) => {
        this.editBookshelf(data.bookshelfName);
      },
      undefined,
      {
        name: 'bookshelfName',
        placeholder: 'Nombre del librero',
      }
    );
  }

  private editBookshelf(name: string) {

    if (!name) {
      this._toastrUtil.emitInfoToast(
        'warning',
        'El nombre del librero no puede estar vacío'
      );
      return;
    }

    this._bsSvc
      .updateBookshelf(this.bookshelfId.toString(), { name })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: async () => {
          this._toastrUtil.emitInfoToast(
            'success',
            'Librero editado correctamente'
          );
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al editar el librero ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  public openDeleteBookshelf() {
    this._toastrUtil.deleteAlert(
      'Eliminar librero',
      '¿Estás seguro de que deseas eliminar este librero?',
      () => {
        this.deleteBookshelf();
      },
      undefined
    );
  }

  private deleteBookshelf() {
    this._bsSvc
      .deleteBookshelf(this.bookshelfId.toString())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: async () => {
          this._toastrUtil.emitInfoToast(
            'success',
            'Librero eliminado correctamente'
          );
          await this.closeModal();
          await this.closeModal();
        },
        error: (err) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al eliminar el librero ' + err.error.message
          );
        },
      });
  }
}
