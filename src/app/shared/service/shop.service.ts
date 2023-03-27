import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../tables/Address';
import { Shop } from '../tables/Shop';
import { GoogleResponse } from '../tables/google-response';

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

  getLocation(address: Address): Observable<GoogleResponse> {
    return this.httpClient.get<GoogleResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.address},${address.ward},${address.district}&key=${environment.key}`)
  }

  downloadImage(url: string) {
    this.httpClient.get(url, { responseType: 'arraybuffer' }).subscribe(response => {
      const file = new File([response], 'YOUR_IMG.jpg', { type: 'image/jpeg' })
      console.log("File : ", file)
    })
  }
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
