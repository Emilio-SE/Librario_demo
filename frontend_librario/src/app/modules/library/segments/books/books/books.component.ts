import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { BooksService } from '../../../modals/services/books.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookPreview } from '../../../modals/interfaces/books.interface';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { LibrarySubmenuCommunicationService } from '../../../modals/services/library-submenu-communication.service';
import { ModalController } from '@ionic/angular';
import { FillBookPage } from '../fill-book/fill-book.page';
import { BookDetailsPage } from '../book-details/book-details.page';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _bookSvc = inject(BooksService);
  private _submenuCommSvc = inject(LibrarySubmenuCommunicationService);
  private _modalController = inject(ModalController);

  public bookList: BookPreview[] = [];

  private toastrUtils = new ToastrUtils();
  public isModalOpen = false;

  public isLoaded: boolean | undefined;

  public searchTerm = '';

  constructor() {}

  ngOnInit() {
    this.getBooks();
    this.openSubmenu();
  }

  private openSubmenu(): void {
    this._submenuCommSvc.signalOpenBookSubmenu
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this.isModalOpen = true;
          this._cdr.detectChanges();
        },
      });
  }

  private getBooks(): void {
    this.isLoaded = undefined;
    this._bookSvc
      .getBooks()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this.bookList = data;
          this.isLoaded = true;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this.toastrUtils.emitInfoToast('danger', error.error.message);
          this.isLoaded = false;
          this._cdr.detectChanges();
        },
      });
  }

  public onModalDismiss(): void {
    this.isModalOpen = false;
    this._cdr.detectChanges();
  }

  public async openBookDetails(bookId: number): Promise<void> {
    console.log(bookId);
    const modal = await this._modalController.create({
      component: BookDetailsPage,
      componentProps: {
        bookId: bookId,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getBooks();
    });
  }

  public searchBooks(): void {
    console.log(this.searchTerm);
    this.isModalOpen = false;
    this._cdr.detectChanges();
  }

  public async openAddManualBook(): Promise<void> {
    const modal = await this._modalController.create({
      component: FillBookPage,
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getBooks();
    });
  }

  public async openRequestISBN(): Promise<void> {
    this.toastrUtils.addAlert(
      'ISBN',
      'Ingrese el ISBN del libro que desea agregar',
      (data) => {
       this.openAddBookByISBN(data.isbn);
      },
      undefined,
      {
        name: 'isbn',
        placeholder: 'ISBN',
      }
    );
  }

  public async openAddBookByISBN(isbn: string): Promise<void> {
    if (isbn.length < 10 || isbn.length > 13) {
      await this.toastrUtils.emitInfoToast(
        'danger',
        'El ISBN debe tener entre 10 y 13 caracteres'
      );
      return;
    }

    const modal = await this._modalController.create({
      component: FillBookPage,
      componentProps: {
        isbn: isbn,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getBooks();
    });
  }
}