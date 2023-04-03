import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from "../../../../shared/service/product.service";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
    //Login Info
    loggedId: number = Number(localStorage.getItem('user-id'));
    loggedRole: string = localStorage.getItem('user-role');

    products = [];
    deleteProductId: number;
    usingTimes: number;

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 12;
    theTotalElements = 0;

    constructor(private productService: ProductService,
        private modalService: BsModalService,
        private router: Router) {
    }

    ngOnInit() {
        this.listProduct();
    }

    listProduct() {
        if (this.loggedRole == 'ROLE_ADMIN') {
            this.productService.getProductsPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
        }
        else {
            this.productService.getProductsByShopId(Number(localStorage.getItem('shop-id')), this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
        }
    }

    processResult() {
        return (data: any) => {
            this.products = data.products;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }

    //Modal
    modalRef: BsModalRef;

    openModal(template: TemplateRef<any>, id: number) {
        this.deleteProductId = id;
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirm(deleteProductId: number, template: TemplateRef<any>): void {
        console.log("Delete product with id :" + deleteProductId);
        this.productService.deleteProduct(deleteProductId).subscribe(data => {
            console.log("Deleted successfully");
        });
        this.modalRef.hide();
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    decline(): void {
        this.modalRef.hide();
    }

    successDelete() {
        this.modalRef.hide()
        this.listProduct();
        this.router.navigate(['/products/product-list']);
    }
}
