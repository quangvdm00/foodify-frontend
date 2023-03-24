import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Shipper } from '../tables/shipper';
import { User } from '../tables/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }
}
