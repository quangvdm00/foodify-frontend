import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { environment } from "src/environments/environment";
import { User, UserCreate, UserUpdate } from "../tables/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private userUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  getUsersPagination(thePage: number, thePageSize: number): Observable<GetResponseUsers> {
    return this.httpClient.get<GetResponseUsers>(this.userUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
  }

  createUser(createUser: UserCreate): Observable<UserCreate> {
    let createApi = `${environment.foodOrderingBaseApiUrl}/auth/signup`;
    return this.httpClient.post<UserCreate>(createApi, createUser);
  }

  getUser(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.userUrl}/${id}`);
  }

  updateUser(id: string, updateUser: UserUpdate): Observable<UserUpdate> {
    return this.httpClient.put<UserUpdate>(`${this.userUrl}/${id}`, updateUser);
  }

  deleteUser(userId: string): Observable<User> {
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
