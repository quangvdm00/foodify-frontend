import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { environment } from "src/environments/environment";
import { User, UserCreate } from "../tables/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private userUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  getUsersPagination(thePage: number, thePageSize: number): Observable<GetResponseUsers> {
    return this.httpClient.get<GetResponseUsers>(this.userUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
  }

  createUserWithOneAddress(createUser: UserCreate): Observable<UserCreate> {
    let createApi = `${environment.foodOrderingBaseApiUrl}/auth/signup`;
    return this.httpClient.post<UserCreate>(createApi, createUser);
  }

  private baseUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  createUserOnly(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.userUrl}/${id}`);
  }

  // updateUser(id: string, updateUser: UserUpdate): Observable<UserUpdate> {
  //   return this.httpClient.put<UserUpdate>(`${this.userUrl}/${id}`, updateUser);
  // }

  deleteUser(userId: number): Observable<User> {
    let url = this.userUrl + "/" + userId;
    return this.httpClient.delete<User>(url, {});
  }
}

interface GetResponseUsers {
  users: User[];
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
