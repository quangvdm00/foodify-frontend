import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { User } from '../tables/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = `${environment.foodOrderingBaseApiUrl}/users`

  constructor(private httpClient: HttpClient) { }

  getUsersPagination(thePage: number, thePageSize: number): Observable<GetResponseUsers> {
    return this.httpClient.get<GetResponseUsers>(this.userUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`)
  }

  createUser(createUser: User): Observable<User> {
    return this.httpClient.post<User>(this.userUrl, createUser)
  }

  
}

interface GetResponseUsers {
  users: User[];
  page: {
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
  }
}