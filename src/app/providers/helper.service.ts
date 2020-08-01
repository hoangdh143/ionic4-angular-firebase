import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

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
}
