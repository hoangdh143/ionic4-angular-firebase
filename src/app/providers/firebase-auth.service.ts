import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }
  async registerWithEmailPassword(email, password) {
    try {
      const result = await this.angularFireAuth.createUserWithEmailAndPassword(email, password)
          .then(userData => {userData.user.sendEmailVerification(); return userData; });
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }
}
