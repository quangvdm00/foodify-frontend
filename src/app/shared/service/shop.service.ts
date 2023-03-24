import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shop } from '../tables/Shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/shops`;

  constructor(private httpClient: HttpClient) { }

  getShopsPagination(thePage: number, thePageSize: number): Observable<GetResponseShops> {
    return this.httpClient.get<GetResponseShops>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
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
