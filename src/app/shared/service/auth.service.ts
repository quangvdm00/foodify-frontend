import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignUpUser } from '../tables/sign-up-user';
import { User } from '../tables/user';
import { StringBoolObject } from '../tables/string-bool-object';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/auth`;

  constructor(private httpClient: HttpClient) {

  }

  createNewSignUpUser(signUpUser: SignUpUser) {
    this.httpClient.post<SignUpUser>(this.baseUrl + `/signup`, signUpUser);
  }

  checkEmailOrPhoneNumberExist(userDto: User) {
    return this.httpClient.post<StringBoolObject>(this.baseUrl + `/check`, userDto);
  }
}
