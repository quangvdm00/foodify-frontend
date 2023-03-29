import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Address } from '../tables/Address';
import { Shipper } from '../tables/shipper';
import { User } from '../tables/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  //Create new User
  createNewUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  //Update user
  updateUser(userId: number, userUpdate: User): Observable<User> {
    return this.httpClient.put<User>(this.baseUrl + `/${userId}`, userUpdate);
  }

  //Create address for user
  createAddressForUser(userId: number, address: Address) {
    return this.httpClient.post(this.baseUrl + `/${userId}/addresses`, address)
  }

  //Update Address for User
  updateUserAddress(userId: number, addressId: number, updateAddress: Address) {
    console.log(this.baseUrl + `/${userId}/addresses/${addressId}`)
    return this.httpClient.put(this.baseUrl + `/${userId}/addresses/${addressId}`, updateAddress)
  }

  //get All Users
  getAllUsersByRole(roleName: string, thePage: number, thePageSize: number) {
    return this.httpClient.get<User>(this.baseUrl + `/roles/${roleName}?pageNo=${thePage}&pageSize=${thePageSize}`);
  }
}
