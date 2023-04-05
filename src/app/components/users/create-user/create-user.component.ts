import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { FormGroup, FormBuilder, FormControl, Validators, UntypedFormGroup, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize, switchMap } from "rxjs";
import { Observable } from "rxjs-compat";
import { Validation } from "src/app/constants/Validation";
import { AddressService } from "src/app/shared/service/address.service";
import { DistrictService } from "src/app/shared/service/district.service";
import { FirebaseService } from "src/app/shared/service/firebase.service";
import { UserService } from "src/app/shared/service/user.service";
import { WardService } from "src/app/shared/service/ward.service";
import { Address } from "src/app/shared/tables/Address";
import { District } from "src/app/shared/tables/district";
import { User } from "src/app/shared/tables/User";
import { Ward } from "src/app/shared/tables/ward";

@Component({
    selector: "app-create-user",
    templateUrl: "./create-user.component.html",
    styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent implements OnInit {
    public permissionForm: UntypedFormGroup;
    public active = 1;
    newId: number;

    // form
    addUserForm: FormGroup;

    // image
    avatar: string;
    userImageChoosen: boolean = false;

    // file
    downloadURL: Observable<string>;
    userImageFile: File;
    imageLink;

    // password
    showPassword = false;

    // address
    districts: District[];
    wards: Ward[] = [];

    //Validate
    isHaveDistrict: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private districtService: DistrictService,
        private storage: AngularFireStorage,
        private modalService: BsModalService,
        private firebaseService: FirebaseService
    ) {
        this.createPermissionForm();
    }

    createPermissionForm() {
        this.permissionForm = this.formBuilder.group({});
    }

    ngOnInit() {
        this.addUserForm = this.formBuilder.group({
            email: new FormControl("", [Validators.required, Validators.email]),
            phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
            fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
            dob: new FormControl("", [Validators.required]),
            identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
            address: new FormControl("", [Validators.required, Validators.minLength(8)]),
            district: new FormControl("", [Validators.required]),
            ward: new FormControl("", [Validators.required]),
            password: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
            // confirmedPassword: ['', Validators.required]
        });

        this.getAllDistrict();
    }

    createUser(success: TemplateRef<any>) {
        const newUser = new User();
        const newAddress = new Address();

        newUser.fullName = this.userFullName.value;
        newUser.dateOfBirth = this.userDateOfBirth.value;
        newUser.email = this.userEmail.value;
        newUser.phoneNumber = this.userPhoneNumber.value;
        newUser.identifiedCode = this.userIdentifiedCode.value;
        newUser.defaultAddress = 0;
        newUser.isLocked = false;
        newUser.roleName = "ROLE_USER";

        newAddress.address = this.userAddress.value;
        newAddress.district = this.userDistrict.value;
        if (this.userDistrict.value != "Huyện Hoàng Sa") newAddress.ward = this.userWard.value;

        if (this.addUserForm.invalid) {
          this.addUserForm.markAllAsTouched();
          console.log(this.addUserForm);
          return;
        }

        this.uploadUserImage(this.userImageFile).then((url) => {
            newUser.imageUrl = url;

            this.userService.createNewUser(newUser).subscribe(
                (user) => {
                    newUser.id = user.id;
                    this.newId = user.id;
                    this.userService.createAddressForUser(user.id, newAddress).subscribe(
                        () => { },
                        (error) => {
                            console.log("Address existed! No problem!")
                        }
                    )
                    this.firebaseService.signUp(newUser.email, this.userPassword.value);
                    this.layer1 = this.modalService.show(success, { class: 'modal-sm' });
                }
            )
        })
    }

    //Image Selected
    onFileSelected(event) {
        this.userImageChoosen = true;
        this.userImageFile = event.target.files[0];

        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file)

            reader.onload = () => {
                this.avatar = reader.result as string;
                localStorage.setItem("image", this.avatar);
            }
        }
        this.layer1.hide();
    }

    uploadUserImage(fileUpload: File): Promise<string> {
        return new Promise<string>((resolve) => {
            let n = Date.now();
            const filePath = `UserImages/${n}`;

            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`UserImages/${n}`, fileUpload);
            task
                .snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        this.downloadURL.subscribe(url => {
                            if (url) {
                                resolve(url);
                            }
                        });
                    })
                )
                .subscribe(url => {

                }
                );
        })
    }

    //District and Wards
    getAllDistrict() {
        this.districtService.getAllDistricts().subscribe((distrs) => {
            this.districts = distrs;
        })
    }

    onDistrictSelected() {
        this.isHaveDistrict = false;
        this.wards = [];

        this.districts.forEach((element: District) => {
            if (this.userDistrict.value == element.name && this.userDistrict.value != 'Huyện Hoàng Sa') {
                this.isHaveDistrict = true;
                this.wards = element.wards
            }
        });
    }

    layer1: BsModalRef;

    chooseImg(template: TemplateRef<any>) {
        this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
    }

    closeLayer1() {
        this.layer1.hide();
        this.router.navigate(['/users', 'detail', this.newId]);
    }

    //Getter
    get userFullName() { return this.addUserForm.get("fullName") }
    get userEmail() { return this.addUserForm.get("email") }
    get userDateOfBirth() { return this.addUserForm.get("dob") }
    get userPhoneNumber() { return this.addUserForm.get("phoneNumber") }
    get userIdentifiedCode() { return this.addUserForm.get("identifiedCode") }
    get userAddress() { return this.addUserForm.get('address') }
    get userDistrict() { return this.addUserForm.get('district') }
    get userWard() { return this.addUserForm.get('ward') }
    get userPassword() { return this.addUserForm.get('password') }

    // // Check password and confirm password is match
    // ConfirmedValidator(controlName: string, matchingControlName: string) {
    //     return (formGroup: FormGroup) => {
    //         const control = formGroup.controls[controlName];
    //         const matchingControl = formGroup.controls[matchingControlName];
    //         if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
    //             return;
    //         }
    //         if (control.value !== matchingControl.value) {
    //             matchingControl.setErrors({ confirmedValidator: true });
    //         } else {
    //             matchingControl.setErrors(null);
    //         }
    //     };
    // }
}