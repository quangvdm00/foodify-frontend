import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddressResponse } from '../tables/AddressResponse';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl = `${environment.foodOrderingBaseApiUrl}/addresses`;

  constructor(private httpClient: HttpClient) { }

  deleteAddressById(id: number) {
    return this.httpClient.delete(this.baseUrl + `/${id}`);
  }

  getAllAddressPagination(thePage: number, thePageSize: number): Observable<GetResponseAddresses> {
    return this.httpClient.get<GetResponseAddresses>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
  }
}

interface GetResponseAddresses {
  addresses: AddressResponse[],
  page: {
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
  };
}