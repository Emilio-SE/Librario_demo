import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OtherService } from '../../../modals/services/other.service';
import { Category } from '../../../modals/interfaces/other.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListPage implements OnInit {
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _modalController = inject(ModalController);
  private _otherSvc = inject(OtherService);

  public toastrUtils = new ToastrUtils();
  public categories: Category[] = [];

  constructor() {}

  ngOnInit() {
    this.getCategories();
  }

  public closeModal() {
    this._modalController.dismiss();
  }

  public openDeleteCategory(id: string): void {
    this.toastrUtils.deleteAlert(
      'Eliminar categoría',
      '¿Está seguro que desea eliminar la categoría?',
      () => {
        this.deleteCategory(id);
      },
      undefined
    );
  }

  public openAddCategory(): void {
    this.toastrUtils.addAlert(
      'Agregar categoría',
      'Ingrese el nombre de la categoría',
      (data) => {
        this.createCategory(data.name);
      },
      undefined,
      {
        name: 'name',
        placeholder: 'Nombre',
      }
    );
  }

  private getCategories(): void {
    this._otherSvc
      .getCategories()
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (categories: Category[]) => {
          this.categories = categories;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this.toastrUtils.emitInfoToast(
            'danger',
            'Error al obtener las categorías'
          );
        },
      });
  }

  private createCategory(name: string): void {
    this._otherSvc
      .createCategory({ name })
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this.toastrUtils.emitInfoToast('success', 'Categoría agregada');
          this.getCategories();
        },
        error: (error) => {
          this.toastrUtils.emitInfoToast('danger', error.error.message);
        },
      });
  }

  private deleteCategory(id: string): void {
    this._otherSvc
      .deleteCategory(id)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this.toastrUtils.emitInfoToast('success', 'Categoría eliminada');
          this.getCategories();
        },
        error: (error) => {
          this.toastrUtils.emitInfoToast('danger', error.error.message);
        },
      });
  }
}
