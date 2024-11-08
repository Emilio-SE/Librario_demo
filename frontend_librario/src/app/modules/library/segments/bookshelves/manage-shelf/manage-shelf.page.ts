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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BookPreview } from '../../../modals/interfaces/books.interface';
import {
  CreateShelf,
  ShelfDetails,
  UpdateShelf,
} from '../../../modals/interfaces/bookshelf.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BooksService } from '../../../modals/services/books.service';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

@Component({
  selector: 'app-manage-shelf',
  templateUrl: './manage-shelf.page.html',
  styleUrls: ['./manage-shelf.page.scss'],
})
export class ManageShelfPage implements OnInit {
  private _modalController = inject(ModalController);
  private _bookSvc = inject(BooksService);
  private _bookshelfSvc = inject(BookshelfService);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _fb = inject(FormBuilder);

  public bookList: BookPreview[] = [];
  public shelfDetails: ShelfDetails | undefined;
  public isShelfLoaded: boolean | undefined;
  public isBookListLoaded: boolean | undefined;
  public searchTerm: string = '';

  private _taostUtil = new ToastrUtils();
  public form: FormGroup;

  @Input() bookshelfId: number = -1;
  @Input() shelfId: number = -1;
  @Input() isEdition: boolean = false;

  constructor() {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      books: [[], []],
      searchTerm: [''],
    });
  }

  ngOnInit() {
    this.getShelfDetails();
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

  public closeModal(data?: any): void {
    this._modalController.dismiss({
      dismissed: true,
      data: data,
    });
  }

  public getShelfDetails(): void {
    if (!this.isEdition) {
      this.isShelfLoaded = true;
      this.getBookList();
      return;
    }

    this.isShelfLoaded = undefined;
    this._bookshelfSvc
      .getShelfDetails(
        this.bookshelfId.toString(),
        this.shelfId.toString()
      )
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.form.patchValue({
            name: data.name,
          });
          this.shelfDetails = data;
          this.isShelfLoaded = true;
          this._cdr.detectChanges();

          if(this.isEdition) {
            this.getBookList();
          }

        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error los detalles del estante ' + err.error.message
          );
          this.isShelfLoaded = false;
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
      this.shelfDetails?.books.forEach((book) => {
        this.form.get(`book-${book.id}`)?.setValue(true);
      });
    }
  }

  public save(): void {
    if (this.isEdition) {
      this.editShelf();
    } else {
      this.createShelf();
    }
  }

  private editShelf(): void {
    const shelf = this.formatForm() as UpdateShelf;

    this._bookshelfSvc
      .updateShelf(
        this.bookshelfId.toString(),
        this.shelfId.toString(),
        shelf
      )
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this._taostUtil.emitInfoToast(
            'success',
            'Estante actualizado correctamente'
          );
          this._modalController.dismiss();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al actualizar el estante ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  private createShelf(): void {
    const shelf = this.formatForm() as CreateShelf;

    this._bookshelfSvc
      .createShelf(this.bookshelfId.toString(), shelf)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this._taostUtil.emitInfoToast(
            'success',
            'Estante creado correctamente'
          );
          this._modalController.dismiss();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al crear el estante ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  private formatForm(): CreateShelf | UpdateShelf {
    const books = this.bookList.filter(
      (book) => this.form.get(`book-${book.id}`)?.value
    );
    const ids = books.map((book) => book.id);

    return {
      name: this.form.get('name')?.value,
      book: ids,
    };
  }

  public confirmDeleteShelf(): void {
    this._taostUtil.deleteAlert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este estante?',
      () => {
        this.deleteShelf();
      },
      undefined
    );
  }

  private deleteShelf(): void {
    this._bookshelfSvc
      .deleteShelf(
        this.bookshelfId.toString(),
        this.shelfId.toString()
      )
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this._taostUtil.emitInfoToast(
            'success',
            'Estante eliminado correctamente'
          );
          this.closeModal(true);
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al eliminar el estante ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }
}
