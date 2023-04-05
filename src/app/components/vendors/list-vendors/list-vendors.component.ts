import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { vendorsDB } from '../../../shared/tables/vendor-list';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ShopService } from 'src/app/shared/service/shop.service';
import { Router } from '@angular/router';
import { Shop } from 'src/app/shared/tables/shop';
import { FirebaseService } from 'src/app/shared/service/firebase.service';

@Component({
    selector: 'app-list-vendors',
    templateUrl: './list-vendors.component.html',
    styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {
    shops = [];
    shopId: number;
    emailDelete: string;

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 5;
    theTotalElements = 0;

    constructor(
        private router: Router,
        private shopService: ShopService,
        private modalService: BsModalService,
        private firebaseService: FirebaseService
    ) {

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

    //Modal
    modalRef: BsModalRef;

    openDeleteModal(template: TemplateRef<any>, shopId: number) {
        this.shopId = shopId;
        this.shopService.getShopById(this.shopId).subscribe((shop) => {
            this.emailDelete = shop.user.email;
            this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
        })
    }

    confirm(template: TemplateRef<any>): void {
        this.shopService.deleteShop(this.shopId).subscribe();
        this.firebaseService.deleteUserByEmail(this.emailDelete).subscribe(() => {
            this.listShops();
            this.modalRef.hide();
            this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
        })
    }

    decline(): void {
        this.modalRef.hide();
    }

    continue(): void {
        this.modalRef.hide();
        this.router.navigate(['/vendors/list']);
    }
}
