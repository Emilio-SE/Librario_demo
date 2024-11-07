import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { BooksetsService } from '../../../modals/services/booksets.service';
import { BooksService } from '../../../modals/services/books.service';
import { BookPreview } from '../../../modals/interfaces/books.interface';
import {
  BooksetDetails,
  CreateBookset,
  UpdateBookset,
} from '../../../modals/interfaces/bookset.interface';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

@Component({
  selector: 'app-manage-booksets',
  templateUrl: './manage-booksets.page.html',
  styleUrls: ['./manage-booksets.page.scss'],
})
export class ManageBooksetsPage implements OnInit {
  private _modalController = inject(ModalController);
  private _bookSvc = inject(BooksService);
  private _booksetSvc = inject(BooksetsService);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _fb = inject(FormBuilder);

  public bookList: BookPreview[] = [];
  public booksetDetails: BooksetDetails | undefined;
  public isBooksetLoaded: boolean | undefined;
  public isBookListLoaded: boolean | undefined;
  public searchTerm: string = '';

  private _taostUtil = new ToastrUtils();
  public form: FormGroup;

  @Input() booksetId: number = -1;
  @Input() isEdition: boolean = false;

  constructor() {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      books: [[], []],
      searchTerm: [''],
    });
  }

  ngOnInit() {
    this.getBooksetDetails();
    this.getBookList();
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe((value) => {
        if (value.searchTerm !== this.searchTerm) {
          this.searchTerm = value.searchTerm;
        }
      });
  }

  public getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  public closeModal() {
    this._modalController.dismiss();
  }

  public getBooksetDetails(): void {
    if (!this.isEdition) {
      this.isBooksetLoaded = true;
      return;
    }

    this.isBooksetLoaded = undefined;
    this._booksetSvc
      .getBookset(this.booksetId.toString())
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this.form.patchValue({
            name: data.name,
          });
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

  public getBookList(): void {
    this.isBookListLoaded = undefined;
    this._bookSvc
      .getBooks()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this.bookList = data;
          this.addBooksToForm();
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

  private addBooksToForm(): void {
    this.bookList.forEach((book, index) => {
      this.form.addControl(`book-${book.id}`, this._fb.control(false));
    });

    if (this.isEdition) {
      this.booksetDetails?.books.forEach((book) => {
        this.form.get(`book-${book.id}`)?.setValue(true);
      });
    }
  }

  public save(): void {
    if (this.isEdition) {
      this.editBookset();
    } else {
      this.createBookset();
    }
  }

  private editBookset(): void {
    const bookset = this.formatForm() as UpdateBookset;

    this._booksetSvc
      .updateBookset(this.booksetId.toString(), bookset)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this._taostUtil.emitInfoToast(
            'success',
            'Bookset actualizado correctamente'
          );
          this._modalController.dismiss();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al actualizar el bookset ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  private createBookset(): void {
    const bookset = this.formatForm() as CreateBookset;

    this._booksetSvc
      .createBookset(bookset)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this._taostUtil.emitInfoToast(
            'success',
            'Bookset creado correctamente'
          );
          this._modalController.dismiss();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al crear el bookset ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  private formatForm(): CreateBookset | UpdateBookset {
    const books = this.bookList.filter(
      (book) => this.form.get(`book-${book.id}`)?.value
    );
    const ids = books.map((book) => book.id);

    return {
      name: this.form.get('name')?.value,
      book: ids,
    };
  }

  public confirmDeleteBookset(): void {
    this._taostUtil.deleteAlert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este bookset?',
      () => {
        this.deleteBookset();
      },
      undefined
    );
  }

  private deleteBookset(): void {
    this._booksetSvc
      .deleteBookset(this.booksetId.toString())
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this._taostUtil.emitInfoToast(
            'success',
            'Bookset eliminado correctamente'
          );
          this._modalController.dismiss();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al eliminar el bookset ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }
}
