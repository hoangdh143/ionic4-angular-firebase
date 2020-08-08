import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ADDPRODUCT, LOGIN} from '../constants/formValidationMessage';
import {HelperService} from '../providers/helper.service';
import {Router} from '@angular/router';
import {FirebaseAuthService} from '../providers/firebase-auth.service';
import {WidgetUtilService} from '../providers/widget-util.service';
import {FirestoreDbService} from '../providers/firestore-db.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  addProductForm: FormGroup;
  name: FormControl;
  price: FormControl;
  size: FormControl;
  brand: FormControl;

  formError: any = {
    name: '',
    price: '',
    brand: '',
    size: ''
  };
  validationMessage: any = ADDPRODUCT;
  showAddProductSpinner = false;


  constructor(private helperService: HelperService, private router: Router,
              private widgetUtilService: WidgetUtilService, private firestoreDbService: FirestoreDbService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  createFormControl() {
    this.name = new FormControl('', [
      Validators.required,
    ]);
    this.price = new FormControl('', [
      Validators.required,
    ]);
    this.size = new FormControl('', [
      Validators.required,
    ]);
    this.brand = new FormControl('', [
      Validators.required,
    ]);

  }

  createForm() {
    this.addProductForm = new FormGroup({
      name: this.name,
      price: this.price,
      size: this.size,
      brand: this.brand
    });
    this.addProductForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data) {
    this.formError = this.helperService.prepareValidationMessage(this.addProductForm, this.validationMessage, this.formError);
    console.log('==formError', this.formError);
  }

  resetForm() {
    this.addProductForm.reset();
    this.formError = {
      name: '',
      price: '',
      brand: '',
      size: ''
    };
  }

  async addProduct() {
    try {
      this.showAddProductSpinner = true;
      this.firestoreDbService.insertData('product', {
        name: this.name.value,
        price: this.price.value,
        size: this.size.value,
        brand: this.brand.value
      });
      this.widgetUtilService.presentToast('Product added successfully');
      this.showAddProductSpinner = false;
      this.resetForm();
    } catch (e) {
      this.widgetUtilService.presentToast(e.message);
      this.showAddProductSpinner = false;
    }
  }

}
