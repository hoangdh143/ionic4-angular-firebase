import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from '../providers/firebase-auth.service';
import {WidgetUtilService} from '../providers/widget-util.service';
import {Router} from '@angular/router';
import {FirestoreDbService} from '../providers/firestore-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  productList: Array<any> = [];
  productAvailable = false;

  constructor(private firebaseAuthService: FirebaseAuthService, private widgetUtilService: WidgetUtilService,
              private router: Router, private firestoreDbService: FirestoreDbService) {
    this.getProductList();
  }

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

  getProductList(event = null) {
    this.productAvailable = true;
    this.firestoreDbService.getAllData('product').subscribe(result => {
      this.productList = result;
      this.productAvailable = false;
      this.handleEvent(event);
    }, e => {
      this.widgetUtilService.presentToast(e.message);
      this.productAvailable = false;
      this.handleEvent(event);
    });
  }

  handleEvent(event) {
    if (event) {
      event.target.complete();
    }
  }

  doRefresh(event) {
    this.getProductList(event);
  }

  openAddProductPage() {
    this.router.navigate(['/add-product']);
  }

  openProductDetailPage(id: any) {
    this.router.navigate(['product-detail', id]);
  }
}
