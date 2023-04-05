import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Product } from "../../../../shared/tables/product";
import { Category } from "../../../../shared/tables/category";
import { ProductService } from 'src/app/shared/service/product.service';
import { environment } from 'src/environments/environment';
import { concatMap, finalize, Observable, switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { resolve } from 'path';
import { rejects } from 'assert';
import { ProductImageService } from 'src/app/shared/service/product-image.service';
import { ProductImage } from 'src/app/shared/tables/product-image';


@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
    providers: []
})
export class AddProductComponent implements OnInit {
    public adminImage = environment.adminImg;
    public productForm: UntypedFormGroup;
    public Editor = ClassicEditor;

    //Log-in
    isShop: boolean = false;
    loggedId: number = Number(localStorage.getItem('user-id'))
    loggedRole = localStorage.getItem('user-role');
    shopId: number;

    adminImg = environment.adminImg;

    description: string = '';
    message: string;
    cats!: FormArray;
    imgs!: FormArray;
    createdId: number;
    imageUrls: string[] = [];

    constructor(
        private fb: UntypedFormBuilder,
        private productService: ProductService,
        private productImageService: ProductImageService,
        private modalService: BsModalService,
        private storage: AngularFireStorage) {
        this.productForm = this.fb.group({
            name: new FormControl("", [Validators.required, Validators.minLength(2)]),
            price: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
            shopId: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
            descriptions: new FormControl("", [Validators.required, Validators.minLength(8)]),
            categories: new FormArray([]),
            images: new FormArray([])
        });
    }

    ngOnInit() {
        if (this.loggedRole != 'ROLE_ADMIN') {
            this.isShop = true;
            this.shopId = Number(localStorage.getItem('shop-id'))
        }
        this.productForm.patchValue({
            shopId: this.shopId
        })
    }

    onAddNewProduct(): Promise<void> {
        return new Promise((resolve, rejects) => {
            const categoryNames: string[] = this.cats.controls.map(control => control.get('categoryName').value);

            const uploadFiles: File[] = this.imgs.controls.map(control => control.get('image_File').value);

            const uploadPromises = uploadFiles.map((file) => {
                return this.uploadImage(file).then((imageUrl: string) => {
                    this.imageUrls.push(imageUrl)
                })
            })

            Promise.all(uploadPromises).then(() => {
                const product = new Product();

                product.name = this.productName.value;
                product.description = this.descriptions.value;
                product.isEnabled = true;
                product.discountPercent = 0;
                product.cost = this.productPrice.value;
                product.averageRating = 0;
                product.reviewCount = 0;
                if (this.isShop) {
                    product.shopId = this.shopId;
                }
                else {
                    product.shopId = this.productShopId.value;
                }
                product.categoryNames = categoryNames;

                this.productService.addProduct(product).pipe(
                    switchMap((product) => {
                        this.createdId = product.id;
                        return this.imageUrls;
                    }),
                    concatMap((url) => {
                        const img = new ProductImage();
                        img.id = 0;
                        img.imageUrl = url;
                        img.productId = this.createdId;
                        return this.productImageService.addProductImage(img, img.productId);
                    })
                ).subscribe();

                resolve();
            })
        })
    }

    // Category Form Array
    addNewCategory() {
        this.cats = this.productForm.get('categories') as FormArray;
        this.cats.push(this.generateNewCategory());
    }

    generateNewCategory(): FormGroup {
        return new FormGroup({
            categoryName: new FormControl('', Validators.required)
        });
    }

    deleteCategory(index: number) {
        this.cats = this.productForm.get('categories') as FormArray;
        this.cats.removeAt(index);

    }

    //Image Form Array
    addNewImage() {
        this.imgs = this.productForm.get('images') as FormArray;
        this.imgs.push(this.generateNewImage())
    }

    generateNewImage(): FormGroup {
        return new FormGroup({
            image_File: new FormControl('', Validators.required)
        })
    }

    deleteImage(index: number) {
        this.imgs = this.productForm.get('images') as FormArray;
        this.imgs.removeAt(index)
    }

    //Getter
    get productName() { return this.productForm.get('name')}

    get productCategory() {
        const numberStr: string = this.productForm.get('category').value;
        const idArr: number[] = numberStr.split(",").map(Number);
        return idArr;
    }

    get productPrice() { return this.productForm.get('price') }

    get productShopId() { return this.productForm.get('shopId') }

    get categories() {
        return this.productForm.get('categories') as FormArray;
    }

    get images() {
        return this.productForm.get('images') as FormArray;
    }

    get descriptions() { return this.productForm.get('descriptions') }


    //Modal
    modalRef: BsModalRef;

    openModal(template: TemplateRef<any>) {
        if (this.productForm.invalid) {
          this.productForm.markAllAsTouched()
          console.log(this.productForm);
          return;
        }
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirm(template: TemplateRef<any>): void {
        this.modalRef.hide();
        this.onAddNewProduct().then(() => {
            this.modalRef = this.modalService.show(template, { class: 'modal-sm' })
        })
    }

    decline(): void {
        this.modalRef.hide();
    }

    completed(): void {
        this.modalRef.hide();
        this.productForm.reset();
    }

    //Image Upload

    //File
    imageFile: File;
    imageUrl: string;
    downloadURL: Observable<string>;

    onFileSelected(event, index: number) {
        this.imageFile = event.target.files[0]
        console.log(this.imageFile.name, index)

        this.imgs = this.productForm.get('images') as FormArray;
        this.imgs.at(index).patchValue({ image_File: this.imageFile });
    }

    uploadImage(fileUpload: File): Promise<string> {
        return new Promise<string>((resolve) => {
            let n = Date.now();
            const filePath = `Products/${n}`;

            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`Products/${n}`, fileUpload);
            task
                .snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        this.downloadURL.subscribe(url => {
                            if (url) {
                                resolve(url);
                            }

                        });
                    })
                )
                .subscribe(url => {
                    // if (url) {
                    //     // console.log(url);
                    // }
                }
                );
        })
    }


    // // FileUpload
    // readUrl(event: any, i) {
    //     if (event.target.files.length === 0) {
    //         return;
    //     }
    //     // Image upload validation
    //     var mimeType = event.target.files[0].type;
    //     if (mimeType.match(/image\/*/) == null) {
    //         return;
    //     }
    //     // Image upload
    //     var reader = new FileReader();
    //     reader.readAsDataURL(event.target.files[0]);
    //     reader.onload = (_event) => {
    //         this.url[i].img = reader.result.toString();
    //     };
    // }

}
