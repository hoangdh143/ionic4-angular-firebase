import { Injectable } from '@angular/core';
import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WidgetUtilService {
  loading: any = {};

  constructor(private toastController: ToastController, private platform: Platform,
              private loadingController: LoadingController,
              private alertController: AlertController) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: this.platform.is('desktop') ? 'top' : 'bottom',
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
    });
    await this.loading.present();
  }

  async dismissLoader() {
    this.loading.dismiss();
  }

  async presentAlertConfirm(header, message, buttons) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons
    });

    await alert.present();
  }

}
