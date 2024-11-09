import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ReadingsSubmenuCommunicationService } from '../../models/services/readingsSubmenuCommunication.service';
import { GaolService } from '../../models/services/gaol.service.service';
import { ModalController } from '@ionic/angular';
import { GoalPreview } from '../../models/interfaces/goal.interface';
import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ManageGoalsPage } from './manage-goals/manage-goals.page';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalComponent implements OnInit {
  private _commSvc = inject(ReadingsSubmenuCommunicationService);
  private _readingSvc = inject(GaolService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _modalSvc = inject(ModalController);

  public isLoaded: boolean | undefined;
  private _goalId: string | undefined;

  public goalsPreview: GoalPreview[] = [];

  public isNewGoalOpen = false;
  public isEditGoalOpen = false;

  private _toastrUtil = new ToastrUtils();

  constructor() {}

  ngOnInit() {
    this.getGoals();
    this._commSvc.openSubmenu$.subscribe(() => {
      this.isNewGoalOpen = true;
      this._cdr.detectChanges();
    });
  }

  public getGoals(event?: any): void {
    this.isLoaded = undefined;
    this._readingSvc
      .getGoals()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (goals) => {
          this.goalsPreview = goals;
          this.isLoaded = true;
          console.log(this.goalsPreview);
          if (event) event.target.complete();
          this._cdr.detectChanges();
        },
        error: (err) => {
          this.isLoaded = false;
          this._toastrUtil.emitInfoToast(
            'danger',
            'Ha ocurrido un error al cargar las metas ' + err.error.message
          );
          if (event) event.target.complete();
          this._cdr.detectChanges();
        },
      });
  }

  public async closeModal(): Promise<void> {
    await this._modalSvc.dismiss();
  }

  public onNewGoalDismiss(): void {
    this.isNewGoalOpen = false;
    this._cdr.detectChanges();
  }

  public onEditGoalDismiss(): void {
    this.isEditGoalOpen = false;
    this._goalId = undefined;
    this._cdr.detectChanges();
  }

  public openGoalOptions(goalId: string): void {
    this._goalId = goalId;
    this.isEditGoalOpen = true;
  }

  public async openEditGoal(): Promise<void> {
    const modal = await this._modalSvc.create({
      component: ManageGoalsPage,
      componentProps: {
        goalId: this._goalId,
        isEdition: true,
      },
    });

    await modal.present();

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data.data){
        this.closeModal();
      }

      this.getGoals();
    });
  }

  public async openNewGoal(): Promise<void> {
    const modal = await this._modalSvc.create({
      component: ManageGoalsPage,
    });

    await modal.present();

    modal.onDidDismiss().then(() => {
      this.getGoals();
    });
  }
}
