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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateBook,
  Format,
  UpdateBook,
} from '../../../modals/interfaces/books.interface';
import { OtherService } from '../../../modals/services/other.service';
import { Category, Tag } from '../../../modals/interfaces/other.interface';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

@Component({
  selector: 'app-fill-book',
  templateUrl: './fill-book.page.html',
  styleUrls: ['./fill-book.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FillBookPage implements OnInit {
  private _destroyedRef = inject(DestroyRef);
  private _modalController = inject(ModalController);
  private _fb = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);

  private _bookSvc = inject(BooksService);
  private _otherSvc = inject(OtherService);

  @Input() public isbn: string = '';
  @Input() public isEdition: boolean = false;

  public bookId: number = -1;
  private _toastrUtil = new ToastrUtils();
  public formats: Format[] = [];
  public categories: Category[] = [];
  public tags: Tag[] = [];

  public form: FormGroup;

  constructor() {
    //FIX: REACTIVE FORMS WITH SELECT OPTIONS
    this.form = this._fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      description: [''],
      publisher: [''],
      edition: [''],
      language: [''],
      pages: [0],
      publicationDate: [''],
      acquisitionDate: [''],
      format: [undefined],
      price: [0],
      asExpense: [false],
      coverUrl: [''],
      genre: [[]],
      tag: [[]],
      booksets: [[]],
    });
  }

  ngOnInit() {
    this.getFormats();
    this.getCategories();
    this.getTags();
    this.getBookDetails();
  }

  private getBookDetails(): void {
    if (this.isEdition && this.isbn) {
      this.getBookDetailsInDatabase();
    } else if (!this.isEdition && this.isbn) {
      this.getBookDetailsByOpenLibrary();
    }
  }

  private getBookDetailsByOpenLibrary(): void {
    this._bookSvc
      .getBookDetailsByISBN(this.isbn)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (book) => {
          this.form.patchValue(book);
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener los detalles del libro, es posible que no exista en la base de datos'
          );
          this._cdr.detectChanges();
        },
      });
  }

  private getBookDetailsInDatabase(): void {
    this._bookSvc
      .getBook(this.isbn)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (book) => {
          this.form.patchValue(book);
          this.bookId = book.id;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener los detalles del libro: ' + error.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  private getFormats(): void {
    this._bookSvc
      .getFormats()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (formats) => {
          this.formats = formats;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener los formatos'
          );
          this._cdr.detectChanges();
        },
      });
  }

  private getCategories(): void {
    this._otherSvc
      .getCategories()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener las categorías'
          );
          this._cdr.detectChanges();
        },
      });
  }

  private getTags(): void {
    this._otherSvc
      .getTags()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (tags) => {
          this.tags = tags;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener las etiquetas'
          );
          this._cdr.detectChanges();
        },
      });
  }

  public closeModal() {
    this._modalController.dismiss();
  }

  public saveBook(): void {
    if (this.isEdition) {
      this.updateBook();
    } else {
      this.createBook();
    }
  }

  public createBook(): void {
    const values: CreateBook = this.form.getRawValue();
    values.format = values.format ? Number(values.format) : undefined;
    values.tag?.map((tag) => Number(tag));
    values.genre = values.genre?.map((genre) => Number(genre));

    this._bookSvc
      .createBook(values)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._toastrUtil.emitInfoToast('success', 'Libro creado con éxito');
          this._cdr.detectChanges();
          this.closeModal();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al crear el libro: ' + error.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  public updateBook(): void {
    const values: UpdateBook = this.form.getRawValue();
    values.format = values.format ? Number(values.format) : undefined;
    values.tag = values.tag?.map((tag) => Number(tag));
    values.genre = values.genre?.map((genre) => Number(genre));
    console.log(values);

    this._bookSvc
      .updateBook(this.bookId.toString(), values)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._toastrUtil.emitInfoToast(
            'success',
            'Libro actualizado con éxito'
          );
          this._cdr.detectChanges();
          this.closeModal();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al actualizar el libro: ' + error.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  public deleteBook(): void {
    this._bookSvc
      .deleteBook(this.isbn)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._toastrUtil.emitInfoToast(
            'success',
            'Libro eliminado con éxito'
          );
          this.closeModal();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al eliminar el libro: ' + error.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }
}
