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
import { GaolService } from '../../../models/services/gaol.service.service';
import {
  GoalDetails,
  UpdateGoal,
} from '../../../models/interfaces/goal.interface';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-manage-goals',
  templateUrl: './manage-goals.page.html',
  styleUrls: ['./manage-goals.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGoalsPage implements OnInit {
  private _modalController = inject(ModalController);
  private _destroyedRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _fb = inject(FormBuilder);
  private _goalSvc = inject(GaolService);

  public goalData: GoalDetails | undefined;
  public isGoalLoaded: boolean | undefined;

  private _taostUtil = new ToastrUtils();

  public form: FormGroup;

  @Input() goalId: string = '';
  @Input() isEdition: boolean = false;

  constructor() {
    this.form = this._fb.group({
      title: ['', [Validators.required]],
      initialDate: [null, [Validators.required]],
      finalDate: [null, [Validators.required]],
      quantity: [0, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getGoalDetails();
  }

  public getGoalDetails(): void {
    if (!this.isEdition) {
      this.isGoalLoaded = true;
      return;
    }
    this.isGoalLoaded = undefined;
    this._goalSvc
      .getGoal(this.goalId)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: (goal) => {
          this.goalData = goal;
          this.isGoalLoaded = true;
          this.updateForm();
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Error al obtener los detalles de la meta ' + err.error.message
          );
          this._cdr.detectChanges();
        },
      });
  }

  public updateForm(): void {
    this.form.get('title')?.setValidators([]);
    this.form.get('initialDate')?.setValidators([]);
    this.form.get('finalDate')?.setValidators([]);
    this.form.get('quantity')?.setValidators([]);

    this.form.patchValue({
      title: this.goalData!.title,
      initialDate: this.formatDate(this.goalData!.initialDate),
      finalDate: this.formatDate(this.goalData!.finalDate),
      quantity: this.goalData!.quantity,
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

  public updateGoal(): void {
    this._goalSvc
      .updateGoal(this.goalId, this.formatUpdateGoal())
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._taostUtil.emitInfoToast('success', 'Meta actualizada');
          this.closeModal();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Error al actualizar la meta ' + err.error.message
          );
        },
      });
  }

  public createGoal(): void {
    this._goalSvc
      .createGoal(this.form.value)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._taostUtil.emitInfoToast('success', 'Meta creada');
          this.closeModal();
        },
        error: (err) => {
          this._taostUtil.emitInfoToast(
            'danger',
            'Error al crear la meta ' + err.error.message
          );
        },
      });
  }

  private formatUpdateGoal(): UpdateGoal {
    return {
      title: this.form.get('title')?.value || undefined,
      initialDate: this.form.get('initialDate')?.value || undefined,
      finalDate: this.form.get('finalDate')?.value || undefined,
      quantity: this.form.get('quantity')?.value?.toString() || undefined,
    };
  }

  public requestDeleteGoal(): void {
    this._taostUtil.deleteAlert(
      'Eliminar meta',
      '¿Estás seguro de que quieres eliminar esta meta?',
      () => {
        this.deleteGoal();
      },
      undefined
    );
  }

  private deleteGoal(): void {
    this._goalSvc
      .deleteGoal(this.goalId)
      .pipe(takeUntilDestroyed(this._destroyedRef))
      .subscribe({
        next: () => {
          this._taostUtil.emitInfoToast('success', 'Meta eliminada');
          this.closeModal(true);
        },
        error: (err) => {
          this.closeModal();
          this._taostUtil.emitInfoToast(
            'danger',
            'Error al eliminar la meta ' + err.error.message
          );
        },
      });
  }
}
