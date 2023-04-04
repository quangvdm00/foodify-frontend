import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Image } from '@ks89/angular-modal-gallery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/shared/tables/product';
import { ProductService } from 'src/app/shared/service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductImage } from 'src/app/shared/tables/product-image';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    providers: [NgbRatingConfig]
})

export class ProductDetailComponent implements OnInit {
    product: Product
    deleteProductId: number;
    imageUrls: ProductImage[] = [];
    imagesRect: Image[] = [];


    constructor(private modalService: BsModalService,
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    handleProductDetails() {
        const productId = +this.route.snapshot.paramMap.get('id')!;
        this.productService.getProductById(productId).subscribe(data => {
            this.product = data
        });
    }
    ngOnInit() {
        this.route.paramMap.subscribe(() => this.handleProductDetails());
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
        // this.listProduct();
        this.router.navigate(['/products/product-list']);
    }
}
