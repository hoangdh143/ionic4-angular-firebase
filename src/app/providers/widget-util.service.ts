import { Injectable } from '@angular/core';
import {LoadingController, Platform, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WidgetUtilService {
  loading: any = {};

  constructor(private toastController: ToastController, private platform: Platform,
              private loadingController: LoadingController) { }

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
}
