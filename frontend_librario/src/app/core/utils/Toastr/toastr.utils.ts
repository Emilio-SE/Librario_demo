import { inject } from '@angular/core';
import {
  AlertButton,
  AlertInput,
  AlertOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';

export class ToastrUtils {
  private _toastrSvc = inject(ToastController);
  private _alertSvc = inject(AlertController);

  public async emitInfoToast(type: string, message: string) {
    const toast = await this._toastrSvc.create({
      message,
      duration: 5000,
      color: type,
      buttons: [
        {
          text: 'Ocultar',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

  public async emitToast(config: ToastOptions): Promise<void> {
    const toast = await this._toastrSvc.create(config);
    await toast.present();
  }

  public async emitAlert(alertConfig: AlertOptions): Promise<void> {
    const alert = await this._alertSvc.create(alertConfig);
    await alert.present();
  }

  public async addAlert(
    header: string,
    message: string,
    acceptHandler: undefined | ((data: any) => void),
    cancelHandler: undefined | ((data: any) => void),
    input: AlertInput
  ): Promise<void> {
    const alertButtons: AlertButton[] = [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: cancelHandler,
      },
      {
        text: 'Agregar',
        role: 'primary',
        handler: acceptHandler,
      },
    ];

    const alert = await this._alertSvc.create({
      header,
      message,
      buttons: alertButtons,
      inputs: [input],
    });

    await alert.present();
  }

  public async deleteAlert(
    header: string,
    message: string,
    acceptHandler: undefined | (() => void),
    cancelHandler: undefined | (() => void),
  ): Promise<void> {
    const alertButtons: AlertButton[] = [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: cancelHandler,
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: acceptHandler,
      },
    ];

    const alert = await this._alertSvc.create({
      header,
      message,
      buttons: alertButtons,
    });

    await alert.present();
  }
}
