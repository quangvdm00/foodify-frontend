import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddressService } from 'src/app/shared/service/address.service';
import { AddressResponse } from 'src/app/shared/tables/AddressResponse';

@Component({
  selector: 'app-list-address',
  templateUrl: './list-address.component.html',
  styleUrls: ['./list-address.component.scss']
})
export class ListAddressComponent {

  addresses: AddressResponse[];
  deleteAddressId: number;

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 5;
  theTotalElements = 0;

  constructor(private addressService: AddressService,
    private modalService: BsModalService) {

  }

  ngOnInit() {
    this.listAllAddress()
  }

  listAllAddress() {
    this.addressService.getAllAddressPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.addresses = data.addresses;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

  //Modal
  modalRef: BsModalRef;

  confirmDeleted(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.deleteAddressId = id;
  }

  confirm(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.addressService.deleteAddressById(this.deleteAddressId).subscribe();
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  decline() {
    this.modalRef.hide();
  }

  completed() {
    this.modalRef.hide();
    this.listAllAddress();
  }
}
