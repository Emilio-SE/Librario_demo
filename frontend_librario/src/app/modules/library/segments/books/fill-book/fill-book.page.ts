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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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

  public isLoaded: boolean | undefined;

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
    }else{
      this.isLoaded = true;
      this._cdr.detectChanges();
    }
  }

  private getBookDetailsByOpenLibrary(): void {
    this.isLoaded = undefined;
    this._bookSvc
      .getBookDetailsByISBN(this.isbn)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (book) => {
          this.form.patchValue(book);
          this.isLoaded = true;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener los detalles del libro, es posible que no exista en la base de datos'
          );
          this.isLoaded = false;
          this._cdr.detectChanges();
        },
      });
  }

  private getBookDetailsInDatabase(): void {
    this.isLoaded = undefined;
    this._bookSvc
      .getBook(this.isbn)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (book) => {
          this.bookId = book.id;
          this.form.patchValue(book);
          this.getControl('format').setValue(book.format?.id);
          this.getControl('genre').setValue(
            book.genre?.map((genre) => genre.id)
          );
          this.getControl('tag').setValue(book.tag?.map((tag) => tag.id));
          this.isLoaded = true;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener los detalles del libro: ' + error.error.message
          );
          this.isLoaded = false;
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

  public closeModal(data?: any): void {
    this._modalController.dismiss({
      dismissed: true,
      data: data
    });
  }

  public saveBook(): void {
    if (this.isEdition) {
      this.updateBook();
    } else {
      this.createBook();
    }
  }

  private formatValues(): CreateBook {
    const values: CreateBook = this.form.getRawValue();
    values.format = values.format ? Number(values.format) : undefined;
    values.tag?.map((tag) => Number(tag));
    values.genre = values.genre?.map((genre) => Number(genre));
    values.price = typeof values.price === 'string' ? Number(values.price) : values.price;
    values.pages = typeof values.pages === 'string' ? Number(values.pages) : values.pages;
    values.asExpense = values.asExpense ? !!values.asExpense : false;

    return values;
  }

  public createBook(): void {
    this._bookSvc
      .createBook(this.formatValues())
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

  public getControl(from: string): FormControl {
    return this.form.get(from) as FormControl;
  }

  public updateBook(): void {
    this._bookSvc
      .updateBook(
        this.bookId.toString(),
        this.formatValues()
      )
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

  public requestDeleteBook(): void {
    this._toastrUtil.deleteAlert(
      'Eliminar libro',
      '¿Estás seguro que deseas eliminar el libro?',
      () => this.deleteBook(),
      undefined
    )
  }

  private deleteBook(): void {
    this._bookSvc
      .deleteBook(this.isbn)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._toastrUtil.emitInfoToast(
            'success',
            'Libro eliminado con éxito'
          );
          this.closeModal(true);
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
