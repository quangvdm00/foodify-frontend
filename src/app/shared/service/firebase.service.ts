import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app'
import { UserService } from './user.service';
import { ShopService } from './shop.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StringBoolObject } from '../tables/stringboolobject';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private baseUrl = `${environment.foodOrderingBaseApiUrl}/firebase`

    isLoggedIn = false;
    token: string;

    constructor(
        public firebaseAuth: AngularFireAuth,
        private userService: UserService,
        private shopService: ShopService,
        private httpClient: HttpClient,
        private router: Router) {
    }

    signUp(email: string, password: string) {
        this.firebaseAuth.createUserWithEmailAndPassword(email, password)
            .catch(
                error => console.log(error)
            );
    }

    signIn(email: string, password: string) {
        this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(
                response => {
                    console.log(response);
                    response.user.getIdToken()
                        .then(
                            (token: string) => {
                                this.token = token;
                                console.log('Token Firebase: ', { token });
                                this.token = token;
                                localStorage.setItem('jwt-token', token);

                                this.userService.getUserByEmailOrPhoneNumber(email).subscribe((user) => {
                                    if (user.role.roleName == 'ROLE_ADMIN') {
                                        localStorage.setItem('user-role', user.role.roleName);
                                        localStorage.setItem('email', user.email);
                                        localStorage.setItem('user-id', user.id.toString());
                                    }
                                    else {
                                        localStorage.setItem('user-role', user.role.roleName);
                                        localStorage.setItem('user-email', user.email);
                                        localStorage.setItem('user-id', user.id.toString());
                                        this.shopService.getShopByUserId(user.id).subscribe((shop) => {
                                            localStorage.setItem('shop-id', shop.id.toString());
                                        })
                                    }
                                })
                            }
                        );
                    this.getToken();
                    this.router.navigate(['/dashboard/default']);
                    // this.csrfService.getToken().subscribe(
                    //     token => this.csrfService.setToken(token)
                    // );
                    console.log('navigated');
                }
            ).catch(
                error => console.log("Login error: " + error)
            );
    }

    getToken() {
        this.firebaseAuth.currentUser.then(
            res => res.getIdToken().then(
                (token: string) => {
                    this.token = token;
                    console.log(token);
                }
            )
        );
        console.log('Token: ', this.token);
    }

    isAuthenticated() {
        return this.token != null;
    }

    resetPassword(email: string) {
        this.firebaseAuth.sendPasswordResetEmail(email);
    }

    deleteUserByEmail(email: string): Observable<StringBoolObject> {
        return this.httpClient.delete<StringBoolObject>(this.baseUrl + `/${email}`);
    }

    logout() {
        this.firebaseAuth.signOut().then(
            res => {

            }
        );
        this.token = null;
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }
}

