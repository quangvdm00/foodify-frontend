import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/shared/service/order.service';
import { Order } from 'src/app/shared/tables/order-list';
import { Product } from 'src/app/shared/tables/product';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent {
  constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router) { }

  order: Order
  products: Product[] = []


  ngOnInit() {
    this.handleOrderEdit();
  }

  handleOrderEdit() {
    let orderId = +this.route.snapshot.paramMap.get("id")!;
    let userId = +this.route.snapshot.paramMap.get("userId")!;
    console.log("order id:" + orderId);
    console.log("user id:" + userId);

    this.orderService.getOrderById(userId, orderId).subscribe((order) => {
      this.order = order;
    })
  }

  goBackToList() {
    this.router.navigate(['/sales/orders']);
  }
}
