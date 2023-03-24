import { Component, TemplateRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from 'src/app/shared/tables/Product';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/shared/tables/Category';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  public adminImg = environment.adminImg;
  public editProductForm: UntypedFormGroup;
  // public Editor = ClassicEditor;

  editProductId: number;
  product: Product;
  isEnabled: boolean;
  description: string = '';
  items!: FormArray;

  constructor(
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router) {
    this.editProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      price: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      shopId: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      descriptions: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      discountPercent: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      categories: new FormArray([])
    });
  }

  ngOnInit() {
    // this.addNewCategory();
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe(
      data => this.fillFormToUpdate(data)
    )
  }

  fillFormToUpdate(response: Product) {
    response.categories.forEach((category: Category) => {
      console.log(category.name);
      this.items = this.editProductForm.get('categories') as FormArray;
      this.items.push(new FormGroup({
        categoryName: new FormControl(category.name, Validators.required)
      }))
    })

    this.isEnabled = response.isEnabled;
    this.editProductId = response.id;

    this.editProductForm.patchValue({
      id: response.id,
      name: response.name,
      price: response.cost,
      descriptions: response.description,
      discountPercent: response.discountPercent,
      shopId: response.shop.id
    })
    this.description = response.description;
  }

  onUpdateProduct() {
    const categoryNames: string[] = this.items.controls.map(control => control.get('categoryName').value);
    console.log(categoryNames);
    const product = new Product();
    product.id = 1;
    product.name = this.productName;
    product.description = this.description;
    product.isEnabled = this.isEnabled;
    product.discountPercent = this.discountPercent;
    product.cost = this.productPrice;
    product.averageRating = 0;
    product.reviewCount = 0;
    product.shopId = this.productShopId;
    product.categoryNames = categoryNames;
    console.log(product);
    this.productService.updateProductById(this.editProductId, product).subscribe();
  }

  handleProductDetails() {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe(data => this.product = data);
    console.log(this.product)
  }

  addNewCategory() {
    this.items = this.editProductForm.get('categories') as FormArray;
    this.items.push(this.generateNewCategory());
  }

  generateNewCategory(): FormGroup {
    return new FormGroup({
      categoryName: new FormControl('', Validators.required)
    });
  }

  deleteCategory(index: number) {
    this.items = this.editProductForm.get('categories') as FormArray;
    this.items.removeAt(index);

  }

  onChange({ editor }: ChangeEvent) {
    let data = editor.getData();
    console.log(data)
    // const data = EDITTORC.instances.Editor.document.getBody().getText();
    this.description = data;
  }

  swap() {
    if (this.isEnabled) {
      this.isEnabled = false
    }
    else {
      this.isEnabled = true;
      console.log(this.isEnabled);
    }
  }

  //Getter
  get productName() { return this.editProductForm.get('name').value; }

  get productCategory() {
    const numberStr: string = this.editProductForm.get('category').value;
    const idArr: number[] = numberStr.split(",").map(Number);
    return idArr;
  }

  get productPrice() { return this.editProductForm.get('price').value; }

  get productShopId() { return this.editProductForm.get('shopId').value; }

  get categories() {
    return this.editProductForm.get('categories') as FormArray;
  }

  get descriptions() { return this.editProductForm.get('descriptions').value }

  get discountPercent() { return this.editProductForm.get('discountPercent').value }



  //Modal
  modalRef: BsModalRef;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(template: TemplateRef<any>): void {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.onUpdateProduct();
  }

  decline(): void {
    this.modalRef.hide();
  }

  list() {
    this.modalRef.hide();
    this.router.navigate(["/products/product-list"])
  }
}