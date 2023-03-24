import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { vendorsDB } from "../../../shared/tables/vendor-list";

@Component({
    selector: 'app-create-vendors',
    templateUrl: './create-vendors.component.html',
    styleUrls: ['./create-vendors.component.scss']
})
export class CreateVendorsComponent implements OnInit {
    accountForm: FormGroup;
    active = 1;
    submitted = false;
    vendors = [];

    constructor(private formBuilder: FormBuilder) {
        this.vendors = vendorsDB.data;
        // this.createPermissionForm();
    }

    ngOnInit() {
        this.createAccountForm();
    }

    createAccountForm() {
        this.accountForm = this.formBuilder.group({
            fname: ['', Validators.required],
            lname: ['', Validators.required],
            email: ['', [
                Validators.required,
                Validators.email
            ],
            ],
            password: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')],
            ],
            // Minimum 6 characters, at least one letter, one number and one special character
            confirmPwd: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]]
        });
    }

    //
    // createPermissionForm() {
    //     this.permissionForm = this.formBuilder.group({});
    // }

    onSubmit() {
        this.submitted = true;
        if (this.accountForm.invalid) {
            console.log('err');
            return;
        }

        console.log(this.accountForm.getRawValue());
        // const shop = new Shop(
        //     this.getFirstName, this.getLastName, this.getEmail, this.getPassword, this.confirmPassword);
        const vendor = new vendorsDB(
            'assets/images/dashboard/designer.jpg', this.getFirstName, this.getEmail, this.getPassword, null, BigInt(20000), BigInt(40000)
        );
        this.vendors.push(vendor);
    }


    get form() {
        return this.accountForm.controls;
    }

    get getFirstName(): string {
        return this.accountForm.get('fname').getRawValue();
    }

    get getLastName(): string {
        return this.accountForm.get('lname').getRawValue();
    }

    get getEmail(): string {
        return this.accountForm.get('email').getRawValue();
    }

    get getPassword(): string {
        return this.accountForm.get('password').getRawValue();
    }

    get confirmPassword(): string {
        return this.accountForm.get('confirmPwd').getRawValue();
    }
}
