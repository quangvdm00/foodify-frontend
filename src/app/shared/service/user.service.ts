import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Address } from '../tables/Address';
import { Shipper } from '../tables/shipper';
import { StringBoolObject } from '../tables/StringBoolObject';
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

  getUserById(userId): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + `/${userId}`)
  }

  //Update user
  updateUser(userId: number, userUpdate: User): Observable<User> {
    return this.httpClient.put<User>(this.baseUrl + `/${userId}`, userUpdate);
  }

  //Create address for user
  createAddressForUser(userId: number, address: Address) {
    return this.httpClient.post<StringBoolObject>(this.baseUrl + `/${userId}/addresses`, address)
  }

  //Update Address for User
  updateUserAddress(userId: number, addressId: number, updateAddress: Address) {
    return this.httpClient.put<Address>(this.baseUrl + `/${userId}/addresses/${addressId}`, updateAddress)
  }

  //Update User Default Address
  updateUserDefaultAddress(userId: number, defaultAddressId: number) {
    return this.httpClient.put(this.baseUrl + `/${userId}/addresses/default?addressId=${defaultAddressId}`, '');
  }

  //Delete User Address
  deleteUserAddress(userId: number, addressId: number) {
    return this.httpClient.delete(this.baseUrl + `/${userId}/addresses/${addressId}`)
  }

  //get All Users
  getAllUsersByRole(roleName: string, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get(this.baseUrl + `/roles/${roleName}?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  //Get All Users
  getAllUsers(thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }
}
