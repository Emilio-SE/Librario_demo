import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BookshelfService } from '../../../modals/services/bookshelf.service';
import { BookPreview } from '../../../modals/interfaces/books.interface';
import { BookshelfDetails, ShelfDetails } from '../../../modals/interfaces/bookshelf.interface';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ManageShelfPage } from '../manage-shelf/manage-shelf.page';

@Component({
  selector: 'app-shelf-details',
  templateUrl: './shelf-details.page.html',
  styleUrls: ['./shelf-details.page.scss'],
})
export class ShelfDetailsPage implements OnInit {

  private _modalController = inject(ModalController);
  private _bookshelfSvc = inject(BookshelfService);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  public bookList: BookPreview[] = [];
  public isShelfLoaded: boolean | undefined;
  public shelfDetails: ShelfDetails | undefined;

  private _taostUtil = new ToastrUtils();

  @Input() bookshelfId: number = -1;
  @Input() shelfId: number = -1;

  constructor() {}

  ngOnInit() {
    this.getShelfDetails();
  }

  public closeModal(data?: any): void {
    this._modalController.dismiss({
      dismissed: true,
      data,
    });
  }

  public getShelfDetails(): void {
    this.isShelfLoaded = undefined;
    this._bookshelfSvc
      .getShelfDetails(this.bookshelfId.toString(), this.shelfId.toString())
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.shelfDetails = data;
          this.isShelfLoaded = true;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error los detalles del bookset ' + err.error.message
          );
          this.isShelfLoaded = false;
          this._cdr.detectChanges();
        },
      });
  }

  public async openEditShelf(): Promise<void> {
    this._cdr.detectChanges();
    const modal = await this._modalController.create({
      component: ManageShelfPage,
      componentProps: {
        bookshelfId: this.bookshelfId,
        shelfId: this.shelfId,
        isEdition: true,
      },
    });

    await modal.present();


    modal.onDidDismiss().then(async (data) => {
      if(data.data?.data){
        await this._modalController.dismiss()
        this.closeModal();
      }else{
        this.getShelfDetails();
      }
    });
  }
}
