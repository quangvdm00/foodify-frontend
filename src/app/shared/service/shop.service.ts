import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shop } from '../tables/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/shops`;

  constructor(private httpClient: HttpClient) { }

  createShop(shop: Shop) {
    return this.httpClient.post(this.baseUrl, shop)
  }

  getShopsPagination(thePage: number, thePageSize: number): Observable<GetResponseShops> {
    return this.httpClient.get<GetResponseShops>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
  }

  getShopById(shopId: number) {
    return this.httpClient.get<Shop>(this.baseUrl + `/${shopId}`)
  }

  getShopByUserId(userId: number) {
    return this.httpClient.get<Shop>(this.baseUrl + `/user?userId=${userId}`)
  }

  getShopRevenue(shopId: number, day: number) {
    return this.httpClient.get<number>(this.baseUrl + `/${shopId}/revenue?day=${day}`);
  }

  updateShop(shopId: number, shopUpdate: Shop) {
    return this.httpClient.put<Shop>(this.baseUrl + `/${shopId}`, shopUpdate);
  }

  deleteShop(shopId: number) {
    return this.httpClient.delete(this.baseUrl + `/${shopId}`);
  }

  // downloadImage(url: string) {
  //   this.httpClient.get(url, { responseType: 'arraybuffer' }).subscribe(response => {
  //     const file = new File([response], 'YOUR_IMG.jpg', { type: 'image/jpeg' })
  //     console.log("File : ", file)
  //   })
  // }
}

interface GetResponseShops {
  shops: Shop[];
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
