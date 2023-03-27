import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shipper } from '../tables/shipper';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/shippers`;

  constructor(private httpClient: HttpClient) { }

  createShipper(shipper: Shipper): Observable<Shipper> {
    return this.httpClient.post<Shipper>(this.baseUrl, shipper)
  }

  getShipperPagination(thePage: number, thePageSize: number): Observable<GetResponseShippers> {
    return this.httpClient.get<GetResponseShippers>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`)
  }

  getShipperById(shipperId: number): Observable<Shipper> {
    return this.httpClient.get<Shipper>(this.baseUrl + `/${shipperId}`)
  }

  //Active status
  //Shipping status
}

interface GetResponseShippers {
  shippers: Shipper[],
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  }
}