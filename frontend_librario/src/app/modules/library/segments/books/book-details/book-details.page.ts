import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BooksService } from '../../../modals/services/books.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { BookDetails } from '../../../modals/interfaces/books.interface';
import { FillBookPage } from '../fill-book/fill-book.page';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.page.html',
  styleUrls: ['./book-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsPage implements OnInit {
  private _modalController = inject(ModalController);
  private _destroyedRef = inject(DestroyRef);
  private _bookSvc = inject(BooksService);
  private _cdr = inject(ChangeDetectorRef);

  private toastrUtils = new ToastrUtils();

  public bookDetails: BookDetails | undefined;

  @Input() bookId: number = -1;

  constructor() {}

  ngOnInit() {
    this.getBookDetails();
  }

  public closeModal() {
    this._modalController.dismiss();
  }

  private getBookDetails(): void {
    if (this.bookId !== -1) {
      this._bookSvc
        .getBook(this.bookId.toString())
        .pipe(takeUntilDestroyed(this._destroyedRef))
        .subscribe({
          next: (data) => {
            this.bookDetails = data;
            this._cdr.detectChanges();
          },
          error: (err) => {
            this.toastrUtils.emitInfoToast(
              'Error',
              'Error al obtener los detalles del libro ' + err.error.message
            );
            this._cdr.detectChanges();
          },
        });
    }
  }

  public async openEditBook(): Promise<void> {
    const modal = await this._modalController.create({
      component: FillBookPage,
      componentProps: {
        isbn: this.bookDetails?.id,
        isEdition: true,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getBookDetails();
    });
  }
}
