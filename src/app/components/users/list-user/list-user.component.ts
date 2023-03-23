import { DecimalPipe } from "@angular/common";
import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { NgbdSortableHeader, SortEvent } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from "src/app/shared/service/table.service";
import { UserService } from "src/app/shared/service/user.service";
import { UserListDB, USERLISTDB } from "src/app/shared/tables/list-users";
import { User } from "src/app/shared/tables/user";

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.scss"],
  providers: [TableService, DecimalPipe],
})
export class ListUserComponent implements OnInit {
  public tableItem$: Observable<UserListDB[]>;
  public searchText;
  total$: Observable<number>;
  modalRef: BsModalRef;
  userId: string

  users = [];

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  constructor(public service: TableService, private userService: UserService,
              private modalService: BsModalService,
              private router: Router,) {}

  ngOnInit(): void {
    this.listUser();
  }

  listUser() {
    this.userService.getUsersPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.users = data.users;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    };
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.userId = id;
    console.log(this.userId);
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  confirmBox(userId: string, template: TemplateRef<any>) {
    this.userService.deleteUser(userId).subscribe(res => {
      this.listUser();
    });
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  decline(): void {
    this.modalRef.hide();
  }

  successDelete() {
    this.modalRef.hide();
    this.listUser();
    this.router.navigate(["users/list-user"]);
  }

  // delete(id: string) {
  //   this.confirm.showConfirm("Bạn muốn xoá người dùng này?",
  //   () => {
  //     this.userService.deleteUser(id)
  //     .subscribe(res => {
  //       this.toast.success({detail: 'SUCCESS', summary: 'Xoá người dùng thành công', duration:3000})
  //       this.listUser()
  //     })
  //   },
  //   () => {

  //   })
  // }
}
