import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {auth} from 'firebase';
import {HelperService} from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(private angularFireAuth: AngularFireAuth, private googlePlus: GooglePlus, private helperService: HelperService) { }

  async registerWithEmailPassword(email, password) {
    try {
      const result = await this.angularFireAuth.createUserWithEmailAndPassword(email, password)
          .then(userData => {userData.user.sendEmailVerification(); return userData; });
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async loginWithEmailPassword(email, password) {
    try {
      const result = await this.angularFireAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async logout() {
    try {
      await this.angularFireAuth.signOut();
      if (this.helperService.isNativePlatform()) {
        await this.nativeGoogleLogout();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  getAuthState() {
    return this.angularFireAuth.authState;
  }

  async googleLoginWeb() {
    try {
     return await this.angularFireAuth.signInWithRedirect(new GoogleAuthProvider());
    } catch (e) {
      throw new Error(e);
    }
  }

  async nativeGoogleLogin() {
    try {
      const result = await this.googlePlus.login({
        webClientId: '425874707839-nv5a0usmg6bgo2pbvnqml85el2basp5r.apps.googleusercontent.com',
        offline: true,
        scope: 'profile email'
      });
      this.angularFireAuth.signInAndRetrieveDataWithCredential(auth.GoogleAuthProvider.credential(result.idToken));
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  nativeGoogleLogout() {
    try {
      this.googlePlus.logout();
    } catch (e) {
      throw new Error(e);
    }
  }
}
