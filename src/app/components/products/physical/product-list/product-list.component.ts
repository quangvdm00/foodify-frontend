import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../../shared/service/product.service";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

    products = [];

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 12;
    theTotalElements = 0;

    constructor(private productService: ProductService) {
    }

    ngOnInit() {
        this.listProduct();
    }

    listProduct() {
        this.productService.getProductsPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
    }

    processResult() {
        return (data: any) => {
            this.products = data.products;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }
}
