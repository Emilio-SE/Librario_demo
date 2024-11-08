import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { BookPreview } from 'src/app/modules/library/modals/interfaces/books.interface';
import { BooksService } from 'src/app/modules/library/modals/services/books.service';
import { FillReadingPage } from '../fill-reading/fill-reading.page';

@Component({
  selector: 'app-book-selection',
  templateUrl: './book-selection.page.html',
  styleUrls: ['./book-selection.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookSelectionPage implements OnInit {
  private _modalController = inject(ModalController);
  private _bookSvc = inject(BooksService);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _fb = inject(FormBuilder);

  public bookList: BookPreview[] = [];
  public isBookListLoaded: boolean | undefined;
  public searchTerm: string = '';

  private _taostUtil = new ToastrUtils();

  public form: FormGroup;

  constructor() {
    this.form = this._fb.group({
      searchTerm: [''],
    });
  }

  ngOnInit() {
    this.getBookList();
    this.updateSearchTerm();
  }

  private updateSearchTerm(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this.searchTerm = data.searchTerm;
        },
      });
  }

  public closeModal(): void {
    this._modalController.dismiss();
  }

  public getBookList(): void {
    this.isBookListLoaded = undefined;
    this._bookSvc
      .getBooks()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this.bookList = data;
          this.isBookListLoaded = true;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al obtener la lista de libros ' +
              err.error.message
          );
          this.isBookListLoaded = false;
          this._cdr.detectChanges();
        },
      });
  }

  public async onBookSelect(book: BookPreview): Promise<void> {
    const modal = await this._modalController.create({
      component: FillReadingPage,
      componentProps: { bookId: book.id },
    });

    await modal.present();

    modal.onDidDismiss().then((data) => {
      if (data.data.data) {
        this.closeModal();
      }
    });
  }
}
