import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from '../providers/firebase-auth.service';
import {WidgetUtilService} from '../providers/widget-util.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private firebaseAuthService: FirebaseAuthService, private widgetUtilService: WidgetUtilService,
              private router: Router) { }

  ngOnInit() {
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
