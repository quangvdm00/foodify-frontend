import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { FormGroup, FormBuilder, FormControl, Validators, UntypedFormGroup, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { Observable } from "rxjs-compat";
import { Validation } from "src/app/constants/Validation";
import { DistrictService } from "src/app/shared/service/district.service";
import { UserService } from "src/app/shared/service/user.service";
import { WardService } from "src/app/shared/service/ward.service";
import { District } from "src/app/shared/tables/district";
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

  // file
  downloadURL: Observable<string>;
  imageFile: File;
  imageLink;

  // password
  showPassword = false;

  // address
  districts: District[];
  wards: Ward[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private districtService: DistrictService,
    private wardService: WardService,
    private storage: AngularFireStorage
  ) {
    this.createPermissionForm();
  }

  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group(
      {
        imageUrl: new FormControl("", [Validators.required]),
        fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        dateOfBirth: new FormControl("", [Validators.required]),
        phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
        identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
        addressDto: this.formBuilder.array([
          this.formBuilder.group({
            address: new FormControl("", [Validators.required]),
            district: new FormControl("", [Validators.required]),
            ward: new FormControl("", [Validators.required]),
          }),
        ]),
        password: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        confirmPassword: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        isLocked: new FormControl(false),
        roleName: new FormControl("ROLE_USER"),
      },
      {
        validator: this.ConfirmedValidator("password", "confirmPassword"),
      }
    );

    this.districtService.getDistrictList().subscribe((data) => {
      this.districts = data;
    });
  }

  get id() {
    return this.addUserForm.get("id");
  }
  get imageUrl() {
    return this.addUserForm.get("imageUrl");
  }
  get fullName() {
    return this.addUserForm.get("fullName");
  }
  get email() {
    return this.addUserForm.get("email");
  }
  get dateOfBirth() {
    return this.addUserForm.get("dateOfBirth");
  }
  get phoneNumber() {
    return this.addUserForm.get("phoneNumber");
  }
  get identifiedCode() {
    return this.addUserForm.get("identifiedCode");
  }
  get addressDto() {
    return this.addUserForm.get("addressDto") as FormArray;
  }
  get addressId() {
    return this.addUserForm.get("addressDto")["controls"][0].get("addressId");
  }
  get address() {
    return this.addUserForm.get("addressDto")["controls"][1].get("address");
  }
  get district() {
    return this.addUserForm.get("addressDto")["controls"][2].get("district");
  }
  get ward() {
    return this.addUserForm.get("addressDto")["controls"][3].get("ward");
  }
  get password() {
    return this.addUserForm.get("password");
  }
  get confirmPassword() {
    return this.addUserForm.get("confirmPassword");
  }
  get isLocked() {
    return this.addUserForm.get("isLocked");
  }
  get roleName() {
    return this.addUserForm.get("roleName");
  }

  // Set avatar image
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.avatar = reader.result as string;
        localStorage.setItem("image", this.avatar);
      };
    }
    this.imageFile = event.target.files[0];
  }

  // Upload the image to firebase
  uploadImage(): Promise<void> {
    return new Promise<void>((resolve) => {
      let n = Date.now();
      const filePath = `UserImages/${n}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`UserImages/${n}`, this.imageFile);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe((url) => {
              if (url) {
                //return url here
                this.imageLink = url;
              }
              resolve();
            });
          })
        )
        .subscribe((url) => {
          // if (url) {
          //     // console.log(url);
          // }
        });
    });
  }

  // Check password and confirm password is match
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Call API of wards
  onDistrictChange(index: string) {
    const districtId = this.addressDto.controls[index].get("district").value;
    const wardControl = this.addressDto.controls[index].get("ward");

    // If districtId == "2" (Hoang Sa) -> No Validate "Ward"
    if (districtId === "2") {
      wardControl.clearValidators();
      wardControl.updateValueAndValidity();
      wardControl?.disable();
      this.wards = [];
    } else {
      wardControl.setValidators([Validators.required]);
      wardControl.updateValueAndValidity();
      wardControl?.enable();
    }

    // Get API wards of each district
    this.wardService.getWardList(districtId).subscribe((data) => {
      this.addressDto.controls[index].get("ward").setValue("");
      this.wards = districtId === "2" ? [] : data;
    });
  }

  // Get API of wards to show on UI
  getWards() {
    return this.wards || [];
  }

  /**
   * create User from Form
   */
  createUser() {
    let districtId = this.addressDto.controls[0].get("district").value;
    let districtName = this.districts.filter((district) => district.id == districtId)[0]?.name;

    let wardId = this.addressDto.controls[0].get("ward").value;
    // let wardName = this.wards.filter((ward) => ward.id == wardId)[0].name;
    let wardName = "";
    if (districtId === "2") {
      wardName = "";
    } else {
      wardName = this.wards.filter((ward) => ward.id == wardId)[0]?.name;
    }

    console.log(this.addUserForm.value);

    // if(districtId === '2' && wardId == null && wardName == null) {
    //   wardName = ''
    // }

    // Check all validations addUserForm
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    // addressDto of Form return array. So get first value to send req
    let valueForm = this.addUserForm.value;
    valueForm.addressDto = valueForm.addressDto[0];
    valueForm.addressDto.district = districtName;
    valueForm.addressDto.ward = wardName;

    // Send image to firebase and another datas to database
    this.uploadImage().then(() => {
      this.userService.createUserWithOneAddress(valueForm).subscribe({
        next: (user) => {
          this.router.navigate(["users/list-user"]);
        },
      });
    });
  }
}
