import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShipperService } from 'src/app/shared/service/shipper.service';
import { Shipper } from 'src/app/shared/tables/shipper';

@Component({
  selector: 'app-list-shipper',
  templateUrl: './list-shipper.component.html',
  styleUrls: ['./list-shipper.component.scss']
})
export class ListShipperComponent {
  shippers: Shipper[] = [];

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  modalRef: BsModalRef;
  shipperId: number

  constructor(private shipperService: ShipperService,
    private modalService: BsModalService,
    private router: Router) {
  }

  ngOnInit() {
    this.listAllShipper();
  }

  listAllShipper() {
    return this.shipperService.getShipperPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult())
  }

  processResult() {
    return (data: any) => {
      this.shippers = data.shippers;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.shipperId = id;
    console.log(this.shipperId);
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  confirmBox(shipperId: number, template: TemplateRef<any>) {
    this.shipperService.deleteShipperById(shipperId).subscribe(res => {
      this.listAllShipper();
    });
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  decline(): void {
    this.modalRef.hide();
  }

  successDelete() {
    this.modalRef.hide();
    this.listAllShipper();
    this.router.navigate(["shippers/list"]);
  }
}



