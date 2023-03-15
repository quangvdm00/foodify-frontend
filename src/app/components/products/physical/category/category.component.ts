import {Component, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {Category, CATEGORY} from '../../../../shared/tables/category';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {finalize, Observable} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {TableService} from 'src/app/shared/service/table.service';
import {NgbdSortableHeader} from 'src/app/shared/directives/NgbdSortableHeader';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers: [TableService, DecimalPipe],
})


export class CategoryComponent implements OnInit {
    public closeResult: string;
    categoryForm: FormGroup;

    productCategory: Category[];
    imageFile: File;

    searchText;
    tableItem$: Observable<Category[]>;
    total$: Observable<number>;
    modalRef: BsModalRef;

    edittedProductCategory: number;

    selectedFile: File = null;
    fb;
    downloadURL: Observable<string>;

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

    constructor(public service: TableService,
                private modalService: BsModalService,
                private formBuilder: FormBuilder,
                private storage: AngularFireStorage) {
        this.loadTableCategoryData();
        this.total$ = service.total$;
        this.service.setUserData(CATEGORY);

    }

    loadTableCategoryData() {
        this.service.tableItem$.subscribe(
            (data) => {
                this.productCategory = data;
                this.tableItem$ = this.service.tableItem$;
            }
        );
    }

    onSort({column, direction}) {
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.service.sortColumn = column;
        this.service.sortDirection = direction;

    }

    open(content) {
        // this.ngbModal.open(content, {ariaLabelledBy: 'modal-basic-title'})
        //     .result
        //     .then((result) => {
        //         this.closeResult = `Closed with: ${result}`;
        //     }, (reason) => {
        //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //     });
    }

    createProductCategoryForm() {
        this.categoryForm = this.formBuilder.group({
            categoryName: [''],
            categoryImage: ['']
        });
    }

    editProductCategory(item: Category, template: TemplateRef<any>) {
        // this.ngbModal.open(content, {ariaLabelledBy: 'modal-basic-title'})
        //     .result
        //     .then((result) => {
        //         this.closeResult = `Closed with: ${result}`;
        //     }, (reason) => {
        //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //     });

        this.edittedProductCategory = this.productCategory.findIndex(t => t.product_name === item.product_name);

        this.categoryForm.patchValue({
            categoryName: item.product_name,
        });

        this.modalRef = this.modalService.show(template, {class: 'modal-md'});

    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    ngOnInit() {
        this.createProductCategoryForm();
    }

    onSaveCategory(event) {
        // this.tableItem$.subscribe(
        //     data => data.push(new Category(categoryName, categoryImage))
        // );
        // console.log(categoryName);
        // console.log(categoryImage);

        const updatedProductCategory = this.productCategory[this.edittedProductCategory];

        updatedProductCategory.product_name = this.getProductCategoryName;
        updatedProductCategory.img = this.getProductCategoryImage;

        // console.log(this.getProductCategoryImage);
        // this.uploadImage();

        this.uploadImage();

        this.modalRef.hide();
    }

    onDeleteCategory(indexProductCategory: number, productCategory: Category) {
        console.log(indexProductCategory);
        // this.tableItem$.subscribe(
        //     data => data = data.slice(0, indexProductCategory)
        // );

        // this.tableItem$.subscribe(
        //     data => data.splice(indexProductCategory, 1)
        // );
        // delete the product category in DB
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    confirm(indexProductCategory: number): void {
        this.tableItem$.subscribe(
            data => data.splice(indexProductCategory, 1)
        );
        this.modalRef.hide();
    }

    decline(): void {
        this.modalRef.hide();
    }

    onClose() {
        this.modalRef.hide();
    }

    get form() {
        return this.categoryForm.controls;
    }

    get getProductCategoryName() {
        return this.categoryForm.get('categoryName').getRawValue();
    }

    get getProductCategoryImage() {
        return this.categoryForm.get('categoryImage').getRawValue();
    }

    onFileSelected(event) {
        this.imageFile = event.target.files[0];
    }

    uploadImage() {
        let n = Date.now();
        const filePath = `RoomsImages/${n}`;

        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(`RoomsImages/${n}`, this.imageFile);
        task
            .snapshotChanges()
            .pipe(
                finalize(() => {
                    this.downloadURL = fileRef.getDownloadURL();
                    this.downloadURL.subscribe(url => {
                        if (url) {
                            this.fb = url;
                        }
                        console.log(this.fb);
                    });
                })
            )
            .subscribe(url => {
                    if (url) {
                        console.log(url);
                    }
                }
            );
    }
}
