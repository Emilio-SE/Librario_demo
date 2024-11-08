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
import { ReadingsService } from '../../../models/services/readings.service';
import { ReadingDetails, UpdateReading } from '../../../models/interfaces/readings.interface';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-update-reading',
  templateUrl: './update-reading.page.html',
  styleUrls: ['./update-reading.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateReadingPage implements OnInit {
  private _modalController = inject(ModalController);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _fb = inject(FormBuilder);
  private _readingSvc = inject(ReadingsService);

  public bookData: ReadingDetails | undefined;
  public isBookLoaded: boolean | undefined;
  public searchTerm: string = '';

  private _taostUtil = new ToastrUtils();

  public form: FormGroup;

  @Input() readingId: string = '';

  constructor() {
    this.form = this._fb.group({
      rate: [0, []],
      review: [''],
      currentPage: [0, [Validators.required]],
      startReadingDate: [null],
      endReadingDate: [null],
    });
  }

  ngOnInit() {
    this.getReadingDetails();
  }

  public getReadingDetails(): void {
    this.isBookLoaded = undefined;
    this._readingSvc
      .getReading(this.readingId)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (reading) => {
          this.bookData = reading;
          this.isBookLoaded = true;
          this.form.patchValue({
            rate: this.bookData.rate,
            review: this.bookData.review,
            currentPage: this.bookData.currentPage,
            startReadingDate: this.formatDate(this.bookData.startReadingDate),
            endReadingDate: this.formatDate(this.bookData.endReadingDate),
          });
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Error al obtener los detalles de la lectura ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  private formatDate(date: string | null): string | null {
    return date ? date.substring(0, 10) : null;
  }

  public closeModal(data?: any): void {
    this._modalController.dismiss({
      dismissed: true,
      data: data,
    });
  }

  public updateReading(): void {
    this._readingSvc
      .updateReading(this.readingId, this.formatUpdateReading())
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._taostUtil.emitInfoToast('success', 'Lectura actualizada');
          this.closeModal();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Error al actualizar la lectura ' + err.error.message
          );
        },
      });
  }

  private formatUpdateReading(): UpdateReading {
    return {
      rate: this.form.get('rate')?.value?.toString() || undefined,
      review: this.form.get('review')?.value || undefined,
      currentPage: this.form.get('currentPage')?.value || undefined,
      startReadingDate: this.form.get('startReadingDate')?.value || undefined,
      endReadingDate: this.form.get('endReadingDate')?.value || undefined,
    };
  }

  public requestDeleteReading(): void {
    this._taostUtil.deleteAlert(
      'Eliminar lectura',
      '¿Estás seguro de que quieres eliminar esta lectura?',
      () => {
        this.deleteReading();
      },
      undefined
    );
  }

  private deleteReading(): void {
    this._readingSvc
      .deleteReading(this.readingId)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._taostUtil.emitInfoToast('success', 'Lectura eliminada');
          this.closeModal();
        },
        error: (err) => {
          this.closeModal();
          this._taostUtil.emitInfoToast(
            'danger',
            'Error al eliminar la lectura ' + err.error.message
          );
        },
      });
  }
}
