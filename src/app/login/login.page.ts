import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LOGIN} from '../constants/formValidationMessage';
import {HelperService} from '../providers/helper.service';
import {Router} from '@angular/router';
import {FirebaseAuthService} from '../providers/firebase-auth.service';
import {WidgetUtilService} from '../providers/widget-util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  formError: any = {
    email: '',
    password: ''
  };
  validationMessage: any = LOGIN;
  showLoginSpinner = false;

  constructor(private helperService: HelperService, private router: Router,
              private firebaseAuthService: FirebaseAuthService,
              private widgetUtilService: WidgetUtilService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  createFormControl() {
    this.email = new FormControl('', [
        Validators.required,
        Validators.email
    ]);
    this.password = new FormControl('', [
        Validators.required,
        Validators.minLength(5)
    ]);
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
    this.loginForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data) {
    this.formError = this.helperService.prepareValidationMessage(this.loginForm, this.validationMessage, this.formError);
    console.log('==formError', this.formError);
  }

  goToSignupPage() {
    this.router.navigate(['/signup']);
  }

  resetForm() {
    this.loginForm.reset();
    this.formError = {
      email: '',
      password: ''
    };
  }

  async loginWithEmailPassword() {
    try {
      this.showLoginSpinner = true;
      const result = await this.firebaseAuthService.loginWithEmailPassword(this.email.value, this.password.value);
      console.log('Result: ', result);
      this.showLoginSpinner = false;
      this.widgetUtilService.presentToast('Login success!');
      this.resetForm();
      this.router.navigate(['/home']);
    } catch (e) {
      console.log('Error: ', e);
      this.showLoginSpinner = false;
      this.widgetUtilService.presentToast(e.message);
    }
  }

  googleLogin() {
    if (this.helperService.isNativePlatform()) {
      this.nativeGoogleLogin();
    } else {
      this.googleLoginWeb();
    }
  }

  async googleLoginWeb() {
    try {
      await this.firebaseAuthService.googleLoginWeb();
      this.widgetUtilService.presentToast('Login success!');
      this.router.navigate(['/home']);
    } catch (e) {
      console.log(e);
      this.widgetUtilService.presentToast(e.message);
    }
  }

  async nativeGoogleLogin() {
    try {
      this.widgetUtilService.presentLoading();
      await this.firebaseAuthService.nativeGoogleLogin();
      this.widgetUtilService.presentToast('Login success!');
      this.widgetUtilService.dismissLoader();
    } catch (e) {
      console.log(e);
      this.widgetUtilService.presentToast(e.message);
      this.widgetUtilService.dismissLoader();
    }
  }

}
