import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { environment } from "src/environments/environment";
import { Order } from "../tables/order-list";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private orderUrl = `${environment.foodOrderingBaseApiUrl}/orders`;
  private getOrderUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  getOrdersPagination(
    thePage: number,
    thePageSize: number,
    sortBy: string,
    sortDir: string
  ): Observable<GetResponseOrders> {
    return this.httpClient.get<GetResponseOrders>(
      this.orderUrl + `?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  getOrderById(userId: number, orderId: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.getOrderUrl}/${userId}/orders/${orderId}`);
  }

  updateOrderStatus(userId: number, orderId: number, status: string): Observable<Order> {
    return this.httpClient.put<Order>(`${this.getOrderUrl}/${userId}/orders/${orderId}/status?status=${status}`, "");
  }

  deleteOrderById(userId: number, orderId: number): Observable<Order> {
    return this.httpClient.delete<Order>(`${this.getOrderUrl}/${userId}/orders/${orderId}`, {});
  }
}

interface GetResponseOrders {
  orders: Order[];
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
