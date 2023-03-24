import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
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
}



