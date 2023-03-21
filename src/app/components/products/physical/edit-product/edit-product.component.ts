import { Component, TemplateRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from 'src/app/shared/tables/Product';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  public adminImg = environment.adminImg;
  public productForm: UntypedFormGroup;
  public Editor = ClassicEditor;

  product: Product;
  description: string = '';
  message: string;
  items!: FormArray;

  constructor(
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private modalService: BsModalService,
    private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      price: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      category: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      shopId: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      categories: new FormArray([])
    });
  }

  onAddNewProduct() {
    const categoryNames: string[] = this.items.controls.map(control => control.get('categoryName').value);
    console.log(categoryNames);
    const product = new Product();
    product.id = 1;
    product.name = this.productName;
    product.description = this.description;
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

  handleProductDetails() {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe(data => this.product = data);
    console.log(this.product)
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

  onChange({ editor }: ChangeEvent) {
    let data = editor.getData();
    console.log(data)
    // const data = EDITTORC.instances.Editor.document.getBody().getText();
    this.description = data;
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

  ngOnInit() {
    this.addNewCategory();
    this.route.paramMap.subscribe(() => this.handleProductDetails());
  }

  //Modal
  modalRef: BsModalRef;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    this.onAddNewProduct();
    this.productForm.reset();

    // this.ckEditor.instance.setData('');
    // this.ckEditor.setData('');
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
}
