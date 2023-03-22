import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Product } from "../../../../shared/tables/Product";
import { Category } from "../../../../shared/tables/Category";
import { ProductService } from 'src/app/shared/service/product.service';
import { environment } from 'src/environments/environment';


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

    public url = [{
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    }
    ];

    // @ViewChild('ckEditor') ckEditor: any;

    description: string = '';
    message: string;
    items!: FormArray;

    constructor(
        private fb: UntypedFormBuilder,
        private productService: ProductService,
        private modalService: BsModalService) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            price: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            category: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            shopId: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            descriptions: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            categories: new FormArray([])
        });
    }

    onAddNewProduct() {
        const categoryNames: string[] = this.items.controls.map(control => control.get('categoryName').value);
        console.log(categoryNames);
        const product = new Product();
        product.id = 1;
        product.name = this.productName;
        product.description = this.descriptions;
        product.isEnabled = true;
        product.discountPercent = 0;
        product.cost = this.productPrice;
        product.averageRating = 0;
        product.reviewCount = 0;
        product.shopId = this.productShopId;
        product.categoryNames = categoryNames;

        this.productService.addProduct(product).subscribe(
            result => console.log(result),
            error => console.error(error)
        );
        // this.productForm.reset();
    }

    addNewCategory() {
        this.items = this.productForm.get('categories') as FormArray;
        this.items.push(this.generateNewCategory());
    }

    generateNewCategory(): FormGroup {
        return new FormGroup({
            categoryName: new FormControl('', Validators.required)
        });
    }

    deleteCategory(index: number) {
        this.items = this.productForm.get('categories') as FormArray;
        this.items.removeAt(index);

    }

    //Getter
    get productName() { return this.productForm.get('name').value; }

    get productCategory() {
        const numberStr: string = this.productForm.get('category').value;
        const idArr: number[] = numberStr.split(",").map(Number);
        return idArr;
    }

    get productPrice() { return this.productForm.get('price').value; }

    get productShopId() { return this.productForm.get('shopId').value; }

    get categories() {
        return this.productForm.get('categories') as FormArray;
    }

    get descriptions() { return this.productForm.get('descriptions').value }

    ngOnInit() {
        this.addNewCategory();
    }

    //Modal
    modalRef: BsModalRef;

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirm(template: TemplateRef<any>): void {
        this.message = 'Confirmed!';
        this.modalRef.hide();
        this.onAddNewProduct();
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' })
    }

    decline(): void {
        this.message = 'Declined!';
        this.modalRef.hide();
    }

    completed(): void {
        this.modalRef.hide();
        this.productForm.reset();
    }


    // FileUpload
    readUrl(event: any, i) {
        if (event.target.files.length === 0) {
            return;
        }
        // Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.url[i].img = reader.result.toString();
        };
    }

}
