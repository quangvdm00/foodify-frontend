import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListUserComponent,
        data: {
          title: "Danh sách",
          breadcrumb: "Danh sách"
        }
      },
      {
        path: 'create',
        component: CreateUserComponent,
        data: {
          title: "Tạo người dùng",
          breadcrumb: "Tạo"
        }
      },
      {
        path: 'edit/:id',
        component: EditUserComponent,
        data: {
          title: "Chỉnh sửa người dùng",
          breadcrumb: "Chỉnh sửa"
        }
      },
      {
        path: 'detail/:id',
        component: UserDetailComponent,
        data: {
          title: "Chi tiết người dùng",
          breadcrumb: "Chi tiết"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
