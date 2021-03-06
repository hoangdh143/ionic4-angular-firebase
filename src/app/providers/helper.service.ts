import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private platform: Platform) { }

  prepareValidationMessage(form, validationMessage, formFields) {
    // tslint:disable-next-line:forin
    for (const field in formFields) {
      formFields[field] = '';
      const control = form.controls[field];
      if (control && control.invalid) {
        const messageObj = validationMessage[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          formFields[field] = formFields[field] + messageObj[key] + ' ';
        }
      }
    }
    return formFields;
  }

  isNativePlatform() {
    return this.platform.is('cordova') || this.platform.is('capacitor');
  }
}
