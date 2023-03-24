import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { environment } from "src/environments/environment";
import { BaseService } from "./base.service";
import { Address } from "../tables/address";
import { AddressResponse } from "../tables/AddressResponse";

@Injectable({
  providedIn: "root",
})
export class AddressService extends BaseService {
  private addressUrl = this._url + `/`;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  createAddress(address: Address, userId: string): Observable<Address> {
    let url = this.addressUrl + `users/${userId}/addresses`;
    return this.http.post<Address>(url, address);
  }

  updateAddreess(address: Address, userId: string, addressId: string): Observable<Address> {
    let url = this.addressUrl + `users/${userId}/addresses/${addressId}`;
    return this.http.put<Address>(url, address)
  }

  private baseUrl = `${environment.foodOrderingBaseApiUrl}/addresses`;


  deleteAddressById(id: number) {
    return this.http.delete(this.baseUrl + `/${id}`);
  }

  getAllAddressPagination(thePage: number, thePageSize: number): Observable<GetResponseAddresses> {
    return this.http.get<GetResponseAddresses>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
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
