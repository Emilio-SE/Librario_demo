import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ManageBooksetsPage } from '../manage-booksets/manage-booksets.page';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

import { BooksetsService } from '../../../modals/services/booksets.service';

import { BookPreview } from '../../../modals/interfaces/books.interface';
import { BooksetDetails } from '../../../modals/interfaces/bookset.interface';

@Component({
  selector: 'app-bookset-details',
  templateUrl: './bookset-details.page.html',
  styleUrls: ['./bookset-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksetDetailsPage implements OnInit {
  private _modalController = inject(ModalController);
  private _booksetSvc = inject(BooksetsService);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  public bookList: BookPreview[] = [];
  public isBooksetLoaded: boolean | undefined;
  public booksetDetails: BooksetDetails | undefined;

  private _taostUtil = new ToastrUtils();

  @Input() booksetId: number = -1;

  constructor() {}

  ngOnInit() {
    this.getBooksetDetails();
  }

  public closeModal(data?: any): void {
    this._modalController.dismiss({
      dismissed: true,
      data,
    });
  }

  public getBooksetDetails(): void {
    this.isBooksetLoaded = undefined;
    this._booksetSvc
      .getBookset(this.booksetId.toString())
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this.booksetDetails = data;
          this.isBooksetLoaded = true;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error los detalles del bookset ' + err.error.message
          );
          this.isBooksetLoaded = false;
          this._cdr.detectChanges();
        },
      });
  }

  public async openEditBookset(): Promise<void> {
    this._cdr.detectChanges();
    const modal = await this._modalController.create({
      component: ManageBooksetsPage,
      componentProps: {
        booksetId: this.booksetId,
        isEdition: true,
      },
    });

    await modal.present();


    modal.onDidDismiss().then(async (data) => {
      if(data.data?.data){
        await this._modalController.dismiss()
        this.closeModal();
      }else{
        this.getBooksetDetails();
      }
    });
  }
}
