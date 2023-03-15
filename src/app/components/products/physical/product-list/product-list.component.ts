import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../../shared/service/product.service";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

    products = [];

    constructor(private productService: ProductService) {
    }

    ngOnInit() {
        this.listProduct();
    }

    listProduct() {
        this.productService.getProducts().subscribe(
            data => {
                this.products = data;
                console.log(data);
            }
        );
        // this.products = Product.product;
        // console.log(`products: `, this.products);
    }
}
