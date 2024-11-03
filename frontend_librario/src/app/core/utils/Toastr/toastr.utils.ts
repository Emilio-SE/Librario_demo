import { inject } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

export class ToastrUtils {
  private _toastrSvc = inject(ToastController);

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
}
