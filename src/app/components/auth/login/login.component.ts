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
            title: "Chào mừng đến với Foodify",
            desc: "Foodify - Một trong những ứng dụng đặt đồ ăn tốt nhất hiện nay, được phát triển bởi Pyramide team",
        },
        {
            title: "Foodify - xu hướng mới",
            desc: "Với mục đích tạo ra những sản phẩm tốt nhất cho người dùng, chúng mình đã quyết định sử dụng các công nghệ mới nhất vào Foodify",
        },
        {
            title: "Về Pyramide Team",
            desc: "Pyramide team là một nhóm sinh viên trường Đại học FPT, team nghiên cứu và phát triển sản phẩm theo công nghệ Angular và Spring Boot",
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
