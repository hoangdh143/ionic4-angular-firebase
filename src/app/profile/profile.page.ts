import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from '../providers/firebase-auth.service';
import {WidgetUtilService} from '../providers/widget-util.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private firebaseAuthService: FirebaseAuthService,
              private widgetUtilService: WidgetUtilService,
              private router: Router) {
    this.getUserProfile();
  }
  profileInfo: any  = {};
  profileAvailable = false;

  ngOnInit() {
  }

  getUserProfile() {
    this.profileAvailable = false;
    this.firebaseAuthService.getAuthState().subscribe(user => {
      this.profileInfo = user.toJSON();
      this.profileAvailable = true;
    }, error => {
      this.profileAvailable = true;
      this.widgetUtilService.presentToast(error.message);
    });
  }

  async logout() {
    try {
      await this.firebaseAuthService.logout();
      this.widgetUtilService.presentToast('Logout success!');
      this.router.navigate(['/login']);
    } catch (e) {
      throw new Error(e);
    }
  }

}
