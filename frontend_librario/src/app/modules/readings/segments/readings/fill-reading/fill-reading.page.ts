import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { BookSummary, CreateReading } from '../../../models/interfaces/readings.interface';
import { ReadingsService } from '../../../models/services/readings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-fill-reading',
  templateUrl: './fill-reading.page.html',
  styleUrls: ['./fill-reading.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FillReadingPage implements OnInit {
  private _modalController = inject(ModalController);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _fb = inject(FormBuilder);
  private _readingSvc = inject(ReadingsService);

  public bookData: BookSummary | undefined;
  public isBookLoaded: boolean | undefined;
  public searchTerm: string = '';

  private _taostUtil = new ToastrUtils();

  public form: FormGroup;

  @Input() bookId: string = '';

  constructor() {
    this.form = this._fb.group({
      currentPage: [0, [Validators.required]],
      startReadingDate: [null, []],
    });
  }

  ngOnInit() {
    this.getBookDetails();
  }

  public closeModal(data?: any): void {
    this._modalController.dismiss({
      dismissed: true,
      data: data,
    });
  }

  private getBookDetails(): void {
    this.isBookLoaded = undefined;
    this._readingSvc
      .getBooksReading(this.bookId)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (data) => {
          this.bookData = data;
          console.log(this.bookData);
          this.isBookLoaded = true;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al cargar los datos del libro' +
              err.error.message
          );
          this.isBookLoaded = false;
          this._cdr.detectChanges();
        },
      });
  }

  public createReading(): void {

    const reading: CreateReading = {
      book: this.bookId,
      currentPage: this.form.get('currentPage')?.value || 0,
      startReadingDate: this.form.get('startReadingDate')?.value,
    }

    this._readingSvc
      .createReading(reading)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._taostUtil.emitInfoToast('success', 'Lectura creada con éxito');
          this.closeModal(true);
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al crear la lectura' + err.error.message
          );
        },
      });
  }
}
