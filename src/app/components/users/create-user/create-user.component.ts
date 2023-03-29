import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { FormGroup, FormBuilder, FormControl, Validators, UntypedFormGroup, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize, switchMap } from "rxjs";
import { Observable } from "rxjs-compat";
import { AddressService } from "src/app/shared/service/address.service";
import { DistrictService } from "src/app/shared/service/district.service";
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
        private modalService: BsModalService
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
            ward: ['', Validators.required]
        });

        this.getAllDistrict();
    }

    createUser() {
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

        this.uploadUserImage(this.userImageFile).then((url) => {
            newUser.imageUrl = url;

            this.userService.createNewUser(newUser).subscribe(
                (user) => {
                    newUser.id = user.id;
                    this.userService.createAddressForUser(user.id, newAddress).subscribe(
                        () => { },
                        (error) => {
                            console.log("Address existed! No problem!")
                        }
                    )
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
        this.modalRef.hide();
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

    modalRef: BsModalRef;

    chooseImg(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    continue() {
        this.modalRef.hide();
        this.router.navigate(['/users/list']);
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