import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/service/user.service';
import { User } from 'src/app/shared/tables/User';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User;
  active = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loadUserDetail(id);
  }

  loadUserDetail(id: number) {
    this.userService.getUserById(id).subscribe((user) => {
      this.user = user;
    })
  }
}
