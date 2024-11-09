import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ReadingsSubmenuCommunicationService } from '../../models/services/readingsSubmenuCommunication.service';
import { ReadingPreview } from '../../models/interfaces/readings.interface';
import { ReadingsService } from '../../models/services/readings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { ModalController } from '@ionic/angular';
import { BookSelectionPage } from './book-selection/book-selection.page';
import { UpdateReadingPage } from './update-reading/update-reading.page';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingComponent implements OnInit {
  private _commSvc = inject(ReadingsSubmenuCommunicationService);
  private _readingSvc = inject(ReadingsService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _modalSvc = inject(ModalController);

  public isLoaded: boolean | undefined;

  public readingsPreview: ReadingPreview[] = [];

  public isModalOpen = false;

  private _toastrUtil = new ToastrUtils();

  constructor() {}

  ngOnInit() {
    this.getReadings();
    this._commSvc.openSubmenu$.subscribe(() => {
      this.isModalOpen = true;
      this._cdr.detectChanges();
    });
  }

  public getReadings(event?: any): void {
    this.isLoaded = undefined;
    this._readingSvc
      .getReadings()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (readings) => {
          this.readingsPreview = readings;
          this.isLoaded = true;
          console.log(this.readingsPreview);
          if (event) event.target.complete();
          this._cdr.detectChanges();
        },
        error: (err) => {
          this.isLoaded = false;
          this._toastrUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al cargar las lecturas ' + err.error.message
          );
          if (event) event.target.complete();
          this._cdr.detectChanges();
        },
      });
  }

  public onModalDismiss(): void {
    this.isModalOpen = false;
    this._cdr.detectChanges();
  }

  public async openReadingDetails(readingId: string): Promise<void> {
    const modal = await this._modalSvc.create({
      component: UpdateReadingPage,
      componentProps: {
        readingId: readingId,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getReadings();
    });
  }

  public async openNewReading(): Promise<void> {
    const modal = await this._modalSvc.create({
      component: BookSelectionPage,
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getReadings();
    });
  }
}
