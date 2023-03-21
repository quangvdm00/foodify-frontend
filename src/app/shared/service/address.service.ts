import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { environment } from "src/environments/environment";
import { BaseService } from "./base.service";
import { Address } from "../tables/address";

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
}

interface GetResponseUsers {}
