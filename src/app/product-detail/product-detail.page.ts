import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreDbService} from '../providers/firestore-db.service';
import {WidgetUtilService} from '../providers/widget-util.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EDITPRODUCT} from '../constants/formValidationMessage';
import {HelperService} from '../providers/helper.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.page.html',
    styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
    productId = '';
    productDetailAvailable = false;
    productDetail = {};
    productDetailList: Array<any> = [];
    showEditProductForm = false;

    editProductForm: FormGroup;
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
    validationMessage: any = EDITPRODUCT;
    showEditProductSpinner = false;
    showDeleteProductSpinner = false;


    constructor(private activatedRoute: ActivatedRoute, private firestoreDbService: FirestoreDbService,
                private widgetUtilService: WidgetUtilService, private helperService: HelperService,
                private router: Router) {
        this.activatedRoute.params.subscribe(result => {
            this.productId = result.id;
            this.getProductDetail();
        });
    }

    ngOnInit() {
        this.createFormControl();
        this.createForm();
    }

    async getProductDetail() {
        try {
            this.productDetailAvailable = false;
            const result = await this.firestoreDbService.getDataById('product', this.productId);
            this.productDetail = result;
            this.productDetailList = [];
            // tslint:disable-next-line:forin
            for (const key in this.productDetail) {
                this.productDetailList.push({
                    name: key,
                    value: this.productDetail[key]
                });
            }
            this.productDetailAvailable = true;
        } catch (e) {
            this.widgetUtilService.presentToast(e.message);
            this.productDetailAvailable = true;
        }
    }

    openProductEditForm() {
        this.showEditProductForm = true;
        // tslint:disable-next-line:forin
        for (const key in this.editProductForm.controls) {
            this.editProductForm.controls[key].setValue(this.productDetail[key]);
        }
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
        this.editProductForm = new FormGroup({
            name: this.name,
            price: this.price,
            size: this.size,
            brand: this.brand
        });
        this.editProductForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
    }

    onFormValueChanged(data) {
        this.formError = this.helperService.prepareValidationMessage(this.editProductForm, this.validationMessage, this.formError);
        console.log('==formError', this.formError);
    }

    resetForm() {
        this.editProductForm.reset();
        this.formError = {
            name: '',
            price: '',
            brand: '',
            size: ''
        };
    }

    async editProduct() {
        try {
            this.showEditProductSpinner = true;
            const updatedProductDetail = {};
            // tslint:disable-next-line:forin
            for (const formField in this.editProductForm.controls) {
                const control = this.editProductForm.controls[formField];
                if (control.dirty) {
                    updatedProductDetail[formField] = control.value;
                }
            }
            await this.firestoreDbService.updateData('product', this.productId, updatedProductDetail);
            await this.getProductDetail();
            await this.openProductEditForm();
            this.widgetUtilService.presentToast('Product updated successfully');
            this.showEditProductSpinner = false;
            this.showEditProductForm = false;
        } catch (e) {
            this.widgetUtilService.presentToast(e.message);
            this.showEditProductSpinner = false;
        }
    }

    cancelEdit() {
        this.showEditProductForm = false;
    }

    deleteProduct() {
        this.widgetUtilService.presentAlertConfirm(
            'Delete Product',
            `Are you sure you want to delete ${this.productDetail.name}`,
            [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {}
                },
                {
                    text: 'Okay',
                    handler: async () => {
                        try {
                            this.showDeleteProductSpinner = true;
                            await this.firestoreDbService.deleteData('product', this.productId);
                            this.widgetUtilService.presentToast('Product deleted successfully');
                            this.showDeleteProductSpinner = false;
                            this.router.navigate(['/home']);
                        } catch (e) {
                            this.widgetUtilService.presentToast(e.message);
                            this.showDeleteProductSpinner = false;
                        }
                    }
                }
            ]
        );
    }
}
