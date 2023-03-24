import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAddressComponent } from './list-address/list-address.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list-address',
                component: ListAddressComponent,
                data: {
                    title: "Danh sách địa chỉ",
                    breadcrumb: "Danh sách"
                }
            }
            //   {
            //     path: 'create-coupons',
            //     component: CreateCouponComponent,
            //     data: {
            //       title: "Create Coupon",
            //       breadcrumb: "Create Coupons"
            //     }
            //   }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddressRoutingModule { }
