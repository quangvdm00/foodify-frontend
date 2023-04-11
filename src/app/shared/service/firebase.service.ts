import { Injectable, TemplateRef, ViewChild } from '@angular/core';
import { FirebaseApp } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app'
import { UserService } from './user.service';
import { ShopService } from './shop.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StringBoolObject } from '../tables/string-bool-object';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private baseUrl = `${environment.foodOrderingBaseApiUrl}/firebase`

    //Modal
    @ViewChild('error_modal') errorModal: TemplateRef<any>
    layer1: BsModalRef;

    loggedIn: boolean = false;
    token: string;

    constructor(
        public firebaseAuth: AngularFireAuth,
        private modalService: BsModalService,
        private userService: UserService,
        private shopService: ShopService,
        private httpClient: HttpClient,
        private router: Router) {
    }

    signUp(email: string, password: string) {
        this.firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                userCredential.user.sendEmailVerification();
            })
            .catch(
                error => console.log(error)
            );
    }

    // signIn(email: string, password: string) {
    //     this.firebaseAuth.signInWithEmailAndPassword(email, password)
    //         .then(
    //             response => {
    //                 if (!response.user.emailVerified) {
    //                     response.user.sendEmailVerification();
    //                     this.router.navigate(['/auth/email-not-verified']);
    //                 }
    //                 else {
    //                     response.user.getIdToken()
    //                         .then(
    //                             (token: string) => {
    //                                 this.token = token;
    //                                 console.log(token);
    //                                 localStorage.setItem('jwt-token', token);

    //                                 this.userService.getUserByEmailOrPhoneNumber(email).subscribe((user) => {
    //                                     if (user.role.roleName == 'ROLE_ADMIN') {
    //                                         this.loggedIn = true;
    //                                         localStorage.setItem('user-role', user.role.roleName);
    //                                         localStorage.setItem('email', user.email);
    //                                         localStorage.setItem('user-id', user.id.toString());
    //                                         localStorage.setItem('is-logged', JSON.stringify(this.loggedIn));
    //                                         this.router.navigate(['/dashboard/default']);

    //                                     }
    //                                     else if (user.role.roleName == 'ROLE_SHOP') {
    //                                         localStorage.setItem('user-role', user.role.roleName);
    //                                         localStorage.setItem('user-email', user.email);
    //                                         localStorage.setItem('user-id', user.id.toString());
    //                                         this.shopService.getShopByUserId(user.id).subscribe((shop) => {
    //                                             if (shop.isEnabled) {
    //                                                 this.loggedIn = true;
    //                                                 localStorage.setItem('is-logged', JSON.stringify(this.loggedIn))
    //                                                 localStorage.setItem('shop-id', shop.id.toString());
    //                                                 this.router.navigate(['/dashboard/default']);
    //                                             }
    //                                             else {
    //                                                 this.firebaseAuth.signOut().then(
    //                                                     res => {
    //                                                         this.loggedIn = false;
    //                                                         this.token = null;
    //                                                         localStorage.clear();
    //                                                         this.router.navigate(['/auth', 'forbidden']);
    //                                                     }
    //                                                 );
    //                                             }
    //                                         })
    //                                     }
    //                                     else {
    //                                         this.firebaseAuth.signOut().then(
    //                                             res => {
    //                                                 this.loggedIn = false;
    //                                                 this.token = null;
    //                                                 localStorage.clear();
    //                                                 this.router.navigate(['/auth', 'forbidden']);

    //                                             }
    //                                         );
    //                                     }
    //                                 })
    //                             }
    //                         );
    //                 }
    //             }
    //         ).catch(
    //             error => {
    //                 this.layer1 = this.modalService.show(this.errorModal);
    //             }
    //         );
    // }

    signIn(email: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.signInWithEmailAndPassword(email, password)
                .then((response) => {
                    if (!response.user.emailVerified) {
                        response.user.sendEmailVerification();
                        this.router.navigate(['/auth/email-not-verified']);
                        resolve(false); // trả về false nếu email chưa được xác thực
                    } else {
                        response.user.getIdToken().then((token: string) => {
                            this.token = token;
                            localStorage.setItem('jwt-token', token);

                            this.userService.getUserByEmailOrPhoneNumber(email).subscribe((user) => {
                                if (user.role.roleName == 'ROLE_ADMIN') {
                                    this.loggedIn = true;
                                    localStorage.setItem('user-role', user.role.roleName);
                                    localStorage.setItem('email', user.email);
                                    localStorage.setItem('user-id', user.id.toString());
                                    localStorage.setItem('is-logged', JSON.stringify(this.loggedIn));
                                    this.router.navigate(['/dashboard/default']);
                                    resolve(true); // trả về true nếu đăng nhập thành công
                                } else if (user.role.roleName == 'ROLE_SHOP') {
                                    localStorage.setItem('user-role', user.role.roleName);
                                    localStorage.setItem('user-email', user.email);
                                    localStorage.setItem('user-id', user.id.toString());
                                    this.shopService.getShopByUserId(user.id).subscribe((shop) => {
                                        if (shop.isEnabled) {
                                            this.loggedIn = true;
                                            localStorage.setItem('is-logged', JSON.stringify(this.loggedIn))
                                            localStorage.setItem('shop-id', shop.id.toString());
                                            this.router.navigate(['/dashboard/default']);
                                            resolve(true); // trả về true nếu đăng nhập thành công
                                        } else {
                                            this.firebaseAuth.signOut().then(
                                                res => {
                                                    this.loggedIn = false;
                                                    this.token = null;
                                                    localStorage.clear();
                                                    this.router.navigate(['/auth', 'forbidden']);
                                                    resolve(true); // trả về false nếu tài khoản bị khóa
                                                }
                                            );
                                        }
                                    })
                                } else {
                                    this.firebaseAuth.signOut().then(
                                        res => {
                                            this.loggedIn = false;
                                            this.token = null;
                                            localStorage.clear();
                                            this.router.navigate(['/auth', 'forbidden']);
                                            resolve(true); // trả về false nếu tài khoản không có quyền truy cập
                                        }
                                    );
                                }
                            })
                        });
                    }
                }).catch((error) => {
                    resolve(false);
                });
        });
    }



    // getToken() {
    //     this.firebaseAuth.currentUser.then(
    //         res => res.getIdToken().then(
    //             (token: string) => {
    //                 this.token = token;
    //                 console.log(token);
    //             }
    //         )
    //     );
    //     console.log('Token: ', this.token);
    // }

    isAuthenticated() {
        return this.token != null;
    }

    isLoggedIn(): boolean {
        const isLog = localStorage.getItem('is-logged');
        if (isLog != null) {
            this.loggedIn = JSON.parse(isLog);
            return this.loggedIn;
        }
    }

    isAdmin() {
        const role = localStorage.getItem('user-role');
        if (role == 'ROLE_ADMIN') {
            return true;
        }
        return false;
    }

    resetPassword(email: string) {
        this.firebaseAuth.sendPasswordResetEmail(email);
    }

    confirmPasswordReset(oobCode: string, password: string) {
        this.firebaseAuth.confirmPasswordReset(oobCode, password)
            .then(() => {

            })
            .catch((error) => {
                console.log(error);
            })
    }

    confirmVerifyEmail(oobCode: string) {
        this.firebaseAuth.applyActionCode(oobCode).then(() => {

        })
            .catch((err) => {
                console.log(err);
            })
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
        window.location.href = '/auth/login'
    }
}

