import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { TableService } from 'src/app/shared/service/table.service';
import { UserService } from 'src/app/shared/service/user.service';
import { UserListDB, USERLISTDB } from 'src/app/shared/tables/list-users';
import { User } from 'src/app/shared/tables/user';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class ListUserComponent implements OnInit {
  public user_list = []
  public tableItem$: Observable<UserListDB[]>;
  public searchText;
  total$: Observable<number>;

  users = [];
  

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  constructor(public service: TableService,
              private userService: UserService) {}


  ngOnInit(): void {
    this.listUser()
  }

  listUser() {
    this.userService.getUsersPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult())
  }

  processResult() {
    return (data: any) => {
      this.users = data.users;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

}

