import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { FormGroup, FormBuilder, FormControl, Validators, UntypedFormGroup, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize, switchMap } from "rxjs";
import { Observable } from "rxjs-compat";
import { AuthService } from "src/app/shared/service/auth.service";
import { DistrictService } from "src/app/shared/service/district.service";
import { FirebaseService } from "src/app/shared/service/firebase.service";
import { UserService } from "src/app/shared/service/user.service";
import { Address } from "src/app/shared/tables/address";
import { District } from "src/app/shared/tables/district";
import { User } from "src/app/shared/tables/user";
import { Ward } from "src/app/shared/tables/ward";
import { environment } from "src/environments/environment";

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
    userDefaultImg = environment.userDefaultImg

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
    failureContent: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private districtService: DistrictService,
        private storage: AngularFireStorage,
        private modalService: BsModalService,
        private firebaseService: FirebaseService,
        private authService: AuthService
    ) {
        this.createPermissionForm();
    }

    createPermissionForm() {
        this.permissionForm = this.formBuilder.group({});
    }

    ngOnInit() {
        this.addUserForm = this.formBuilder.group({
            email: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            fullName: ['', Validators.required],
            dob: ['', Validators.required],
            identifiedCode: ['', Validators.required],
            address: ['', Validators.required],
            district: ['', Validators.required],
            ward: ['', Validators.required],
            password: ['', Validators.required],
            confirmedPassword: ['', Validators.required]
        });

        this.getAllDistrict();
    }

    createUser(success: TemplateRef<any>, failure: TemplateRef<any>) {
        const newUser = new User();
        const newAddress = new Address();

        newUser.fullName = this.userFullName;
        newUser.dateOfBirth = this.userDateOfBirth;
        newUser.email = this.userEmail;
        newUser.phoneNumber = this.userPhoneNumber;
        newUser.identifiedCode = this.userIdentifiedCode;
        newUser.defaultAddress = 0;
        newUser.isLocked = false;
        newUser.roleName = "ROLE_USER";

        newAddress.address = this.userAddress;
        newAddress.district = this.userDistrict;
        if (this.userDistrict != "Huyện Hoàng Sa") newAddress.ward = this.userWard;

        if (this.userImageChoosen) {
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
                        this.firebaseService.signUp(newUser.email, this.userPassword);
                        this.layer1 = this.modalService.show(success, { class: 'modal-sm' });
                    },
                    (error) => {
                        this.authService.checkEmailOrPhoneNumberExist(newUser).subscribe((response) => {
                            if (response.title == 'emailExist') {
                                this.failureContent = 'Email'
                                this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
                            }
                            else if (response.title == 'phoneNumExist') {
                                this.failureContent = 'Số điện thoại'
                                this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
                            }
                            else {
                                this.failureContent = 'Số CCCD/CMND'
                                this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
                            }
                        });
                    }
                )
            })
        }
        else {
            newUser.imageUrl = this.userDefaultImg;
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
                    this.firebaseService.signUp(newUser.email, this.userPassword);
                    this.layer1 = this.modalService.show(success, { class: 'modal-sm' });
                },
                (error) => {
                    this.authService.checkEmailOrPhoneNumberExist(newUser).subscribe((response) => {
                        if (response.title == 'emailExist') {
                            this.failureContent = 'Email'
                            this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
                        }
                        else if (response.title == 'phoneNumExist') {
                            this.failureContent = 'Số điện thoại'
                            this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
                        }
                        else {
                            this.failureContent = 'Số CCCD/CMND'
                            this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
                        }
                    });
                }
            )
        }

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
            if (this.userDistrict == element.name && this.userDistrict != 'Huyện Hoàng Sa') {
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
    get userFullName() { return this.addUserForm.get("fullName").value; }
    get userEmail() { return this.addUserForm.get("email").value; }
    get userDateOfBirth() { return this.addUserForm.get("dob").value; }
    get userPhoneNumber() { return this.addUserForm.get("phoneNumber").value; }
    get userIdentifiedCode() { return this.addUserForm.get("identifiedCode").value; }
    get userAddress() { return this.addUserForm.get('address').value; }
    get userDistrict() { return this.addUserForm.get('district').value; }
    get userWard() { return this.addUserForm.get('ward').value; }
    get userPassword() { return this.addUserForm.get('password').value }

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