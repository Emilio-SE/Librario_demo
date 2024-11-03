import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertButton, AlertController, AlertInput } from '@ionic/angular';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

import { AccountService } from '../services/account.service';
import { AuthService } from 'src/app/core/services/auth.service';

import { UserData } from '../interfaces/account.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private _accountSvc: AccountService = inject(AccountService);
  private _cdr = inject(ChangeDetectorRef);
  private _authSvc = inject(AuthService);
  private _destroyRef = inject(DestroyRef);
  private _alertSvc = inject(AlertController);

  public profileData: UserData | null = null;

  private _toastrUtils = new ToastrUtils();

  private _alertButtons: AlertButton[] = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: (data) => {
        this.requestDeleteAccount(data.delete);
      },
    },
  ];
  private _alertInputs: AlertInput[] = [
    {
      name: 'delete',
      placeholder: 'Escriba su contraseña',
    },
  ];

  constructor() {}

  ngOnInit() {
    this._accountSvc
      .getProfile()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          this.profileData = data;
          this._cdr.detectChanges();
        },
        error: (error) => {
          this._toastrUtils.emitInfoToast(
            'danger',
            'Ha ocurrido un error al intentar obtener los datos'
          );
          this._cdr.detectChanges();
        },
      });
  }

  public logout() {
    this._authSvc.logout();
  }

  public deleteAccount() {
    this.emitAlert();
  }

  private requestDeleteAccount(password: string) {
    if (!password) {
      this._toastrUtils.emitInfoToast('warning', 'La contraseña es requerida');
      return;
    }

    this._accountSvc
      .deleteAccount(password)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (value) => {
          this._toastrUtils.emitInfoToast(
            'success',
            'Cuenta eliminada exitosamente'
          );
          this._authSvc.logout();
        },
        error: (error) => {
          this._toastrUtils.emitInfoToast('danger', error.error.message);
          this._cdr.detectChanges();
        },
      });
  }

  private async emitAlert() {
    const alert = await this._alertSvc.create({
      header: 'Eliminar cuenta',
      message: '¿Está seguro de que desea eliminar su cuenta?',
      buttons: this._alertButtons,
      inputs: this._alertInputs,
    });

    await alert.present();
  }
}
