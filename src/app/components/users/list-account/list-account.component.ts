import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/shared/service/user.service';
import { User } from 'src/app/shared/tables/User';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent {
  users: User[] = [];

  searchForm: FormGroup

  //Pagination Properties
  role: string = 'ROLE_USER'
  thePageNumber = 1;
  thePageSize = 5;
  sortBy = 'id';
  sortDir = 'asc';
  theTotalElements = 0;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchName: ['']
    })

    this.listAllUsers()
  }

  listAllUsers() {
    if (this.role != 'ALL') {
      this.userService.getAllUsersByRole(this.role, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult());
    }
    else {
      this.userService.getAllUsers(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult())
    }

  }

  processResult() {
    return (data: any) => {
      this.users = data.users;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

  searchUser() {
    console.log(this.searchName)
  }

  onSort(sortItem: string) {
    if (this.sortDir == 'asc') {
      this.sortBy = sortItem;
      this.sortDir = 'desc';
    }
    else {
      this.sortDir = 'asc'
    }
    this.listAllUsers();
  }


  get searchName() { return this.searchForm.get('searchName').value }

}
