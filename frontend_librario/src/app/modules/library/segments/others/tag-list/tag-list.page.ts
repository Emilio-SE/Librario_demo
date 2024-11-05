import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OtherService } from '../../../modals/services/other.service';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { Tag } from '../../../modals/interfaces/other.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.page.html',
  styleUrls: ['./tag-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListPage implements OnInit {

  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _modalController = inject(ModalController);
  private _otherSvc = inject(OtherService);

  public toastrUtils = new ToastrUtils();
  public tags: Tag[] = [];

  constructor() {}

  ngOnInit() {
    this.getTags();
  }

  public closeModal() {
    this._modalController.dismiss();
  }

  public openDeleteTag(id: string): void {
    this.toastrUtils.deleteAlert(
      'Eliminar etiqueta',
      '¿Está seguro que desea eliminar la etiqueta?',
      () => {
        this.deleteTag(id);
      },
      undefined
    );
  }

  public openAddTag(): void {
    this.toastrUtils.addAlert(
      'Agregar etiqueta',
      'Ingrese el nombre de la etiqueta',
      (data) => {
        this.createTag(data.name);
      },
      undefined,
      {
        name: 'name',
        placeholder: 'Nombre',
      }
    );
  }

  private getTags(): void {
    this._otherSvc
      .getTags()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (Tags: Tag[]) => {
          this.tags = Tags;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this.toastrUtils.emitInfoToast(
            'danger',
            'Error al obtener las etiquetas'
          );
        },
      });
  }

  private createTag(name: string): void {
    this._otherSvc
      .createTag({ name })
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this.toastrUtils.emitInfoToast('success', 'Etiqueta agregada');
          this.getTags();
        },
        error: (error) => {
          this.toastrUtils.emitInfoToast('danger', error.error.message);
        },
      });
  }

  private deleteTag(id: string): void {
    this._otherSvc
      .deleteTag(id)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this.toastrUtils.emitInfoToast('success', 'Etiqueta eliminada');
          this.getTags();
        },
        error: (error) => {
          this.toastrUtils.emitInfoToast('danger', error.error.message);
        },
      });
  }
}
