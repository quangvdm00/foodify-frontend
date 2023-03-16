import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { vendorsDB } from '../../../shared/tables/vendor-list';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ShopService } from 'src/app/shared/service/shop.service';

@Component({
    selector: 'app-list-vendors',
    templateUrl: './list-vendors.component.html',
    styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {
    shops = [];

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 5;
    theTotalElements = 0;

    constructor(private shopService: ShopService) {

    }

    ngOnInit(): void {
        this.listShops();
    }

    listShops() {
        this.shopService.getShopsPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
    }

    processResult() {
        return (data: any) => {
            this.shops = data.shops;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }
}
