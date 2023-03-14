import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    isLoggedIn = false;
    token: string;

    constructor(public firebaseAuth: AngularFireAuth,
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
                                console.log('Token Firebase: ', {token});
                                this.token = token;
                                localStorage.setItem('jwt-token', token);
                            }
                        );
                    this.getToken();
                    // this.csrfService.getToken().subscribe(
                    //     token => this.csrfService.setToken(token)
                    // );
                    this.router.navigate(['dashboard/default']);
                }
            ).catch(
            error => console.log(error)
        );
    }

    // async signUp(email: string, password: string) {
    //     await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
    //         .then(
    //             res => {
    //                 this.isLoggedIn = true;
    //                 localStorage.setItem('user', JSON.stringify(res.user));
    //             }
    //         );
    // }

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

    logout() {
        this.firebaseAuth.signOut().then(
            res => {
                console.log('Log out successfully', res);
            }
        );
        this.token = null;
        this.router.navigate(['/auth/login']);
    }
}

