import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { SortEvent } from "src/app/shared/directives/shorting.directive";
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from "src/app/shared/service/table.service";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { Order } from "src/app/shared/tables/order-list";
import { OrderService } from "src/app/shared/service/order.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  providers: [TableService, DecimalPipe],
})
export class OrdersComponent implements OnInit {
  //Required properties
  oldid: number = 1;
  userId: number;
  orderId: number;

  orders = [];

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  sortBy = "orderTime";
  sortDir = "desc";
  theTotalElements = 0;

  order: Order;
  modalRef: BsModalRef;

  // orderId: number
  // orderStatus: string
  selectedStatus: string;

  orderStatuses = ["Chờ xác nhận", "Đã xác nhận", "Đang giao hàng", "Giao thành công", "Đã huỷ đơn"];

  constructor(private orderService: OrderService, private modalService: BsModalService) {}

  ngOnInit() {
    this.listOrder();
  }

  listOrder() {
    this.orderService
      .getOrdersPagination(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.orders = data.orders;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    };
  }

  // Change status order modal
  openStatusModal(confirmBoxChangeStatus: TemplateRef<any>, userId: number, orderId: number, orderStatus: string) {
    this.orderService.getOrderById(userId, orderId).subscribe(
      (order: Order) => {
        this.userId = userId;
        this.orderId = orderId;
        this.selectedStatus = order.status;
        console.log(this.selectedStatus);
        this.modalRef = this.modalService.show(confirmBoxChangeStatus, { class: "modal-sm" });
      },
      (error) => {
        console.error(error); // handle error
      }
    );
  }

  confirmBoxChangeStatus(successChangeStatus: TemplateRef<any>) {
    this.orderService.updateOrderStatus(this.userId, this.orderId, this.selectedStatus).subscribe((res) => {});
    this.modalRef.hide();
    this.modalRef = this.modalService.show(successChangeStatus, { class: "modal-sm" });
  }

  decline() {
    this.modalRef.hide();
  }

  successChangeStatus() {
    this.listOrder();
    this.modalRef.hide();
  }


  // Delete order modal
  openDeleteModal(confirmBoxDelete: TemplateRef<any>, userId: number, orderId: number) {
    this.userId = userId
    this.orderId = orderId
    console.log('userId: ' + this.userId);
    console.log('orderId: ' + this.orderId);
    
    this.modalRef = this.modalService.show(confirmBoxDelete, { class: "modal-sm" });
  }

  confirmBoxDelete(userId: number, orderId: number, successDelete: TemplateRef<any>) {
    this.orderService.deleteOrderById(this.userId, this.orderId).subscribe(() => {
      this.listOrder()
    })
    this.modalRef.hide()
    this.modalRef = this.modalService.show(successDelete, { class: "modal-sm" });
  }

  successDelete() {
    this.listOrder();
    this.modalRef.hide();
  }
}
