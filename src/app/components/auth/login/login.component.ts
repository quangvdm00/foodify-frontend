import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FirebaseService } from "../../../shared/service/firebase.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: UntypedFormGroup;
    public registerForm: UntypedFormGroup;
    public active = 1;

    constructor(private formBuilder: UntypedFormBuilder,
        private firebaseAuthService: FirebaseService,
        private router: Router) {
        this.createLoginForm();
        this.createRegisterForm();
    }

    owlcarousel = [
        {
            title: "Welcome to Multikart",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
        },
        {
            title: "Welcome to Multikart",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
        },
        {
            title: "Welcome to Multikart",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
        }
    ]
    owlcarouselOptions = {
        loop: true,
        items: 1,
        dots: true
    };

    createLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: [''],
            password: [''],
        });
    }

    createRegisterForm() {
        this.registerForm = this.formBuilder.group({
            email: [''],
            password: [''],
            confirmPassword: [''],
        });
    }

    ngOnInit() {
    }

    onSubmit() {

    }

    onSignUp() {
        console.log(this.getSignUpEmail);
        console.log(this.getSignUpPassword);
        this.firebaseAuthService.signUp(this.getSignUpEmail, this.getSignUpPassword);
    }

    onSignIn() {
        this.firebaseAuthService.signIn(this.getSignInEmail, this.getSignInPassword);
    }

    get getSignUpEmail() {
        return this.registerForm.get('email').getRawValue();
    }

    get getSignUpPassword() {
        return this.registerForm.get('password').getRawValue();
    }

    get getSignInEmail() {
        return this.loginForm.get('email').getRawValue();
    }

    get getSignInPassword() {
        return this.loginForm.get('password').getRawValue();
    }
}
