import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DetailOrderComponent } from "./detail-order/detail-order.component";
import { OrdersComponent } from "./orders/orders.component";
import { TransactionsComponent } from "./transactions/transactions.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "orders",
        component: OrdersComponent,
        data: {
          title: "Đơn hàng",
          breadcrumb: "Đơn hàng",
        },
      },
      {
        path: "detail-order/user/:userId/order/:id",
        component: DetailOrderComponent,
        data: {
          title: "Chi tiết đơn hàng",
          breadcrumb: "Chi tiết",
        },
      },
      {
        path: "transactions",
        component: TransactionsComponent,
        data: {
          title: "Giao dịch",
          breadcrumb: "Giao dịch",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
