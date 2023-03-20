import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup, FormBuilder,FormControl, Validators, UntypedFormGroup, FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { DistrictService } from "src/app/shared/service/district.service";
import { UserService } from "src/app/shared/service/user.service";
import { WardService } from "src/app/shared/service/ward.service";
import { District } from "src/app/shared/tables/district";
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

  addUserForm: FormGroup;
  avatar: string;
  showPassword = false
  districts: District[]
  wards: Ward[][] = [[]]


  constructor(private formBuilder: FormBuilder, 
              private httpClient: HttpClient, 
              private router: Router,
              private userService: UserService,
              private districtService: DistrictService,
              private wardService: WardService,) {
    this.createPermissionForm();
  }

  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
      id: new FormControl(""),
      imageUrl: new FormControl("", [Validators.required]),
      fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      dateOfBirth: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [Validators.required, Validators.pattern("[0-9]{10}")]),
      identifiedCode: new FormControl("", [Validators.required, Validators.pattern("[0-9]{9}")]),
      addresses: this.formBuilder.array([
        this.formBuilder.group({
          addessId: new FormControl(""),
          address: new FormControl("", [Validators.required]),
          district: new FormControl("", [Validators.required]),
          ward: new FormControl("", [Validators.required]),
        }),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
      ]),
      isLocked: new FormControl(false, [Validators.required]),
      roleName: new FormControl("ROLE_USER", [Validators.required]),
    },
    {
      validator: this.ConfirmedValidator("password", "confirmPassword"),
    });

    this.districtService.getDistrictList().subscribe((data) => {
      this.districts = data
    })
  }

  get id() {return this.addUserForm.get("id");}
  get imageUrl() {return this.addUserForm.get("imageUrl");}
  get fullName() {return this.addUserForm.get("fullName");}
  get email() {return this.addUserForm.get("email");}
  get dateOfBirth() {return this.addUserForm.get("dateOfBirth");}
  get phoneNumber() {return this.addUserForm.get("phoneNumber");}
  get identifiedCode() {return this.addUserForm.get("identifiedCode");}
  get addresses() {return this.addUserForm.get("addresses") as FormArray;}
  get addressId() {return this.addUserForm.get("addresses")["controls"][0].get("addressId");}
  get address() {return this.addUserForm.get("addresses")["controls"][1].get("address");}
  get district() {return this.addUserForm.get("addresses")["controls"][2].get("district");}
  get ward() {return this.addUserForm.get("addresses")["controls"][3].get("ward");}
  get password() {return this.addUserForm.get("password");}
  get confirmPassword() {return this.addUserForm.get("confirmPassword");}
  get isLocked() {return this.addUserForm.get("isLocked");}
  get roleName() {return this.addUserForm.get("roleName");}

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
  }

  // Xác thực mật khẩu đã nhập
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

  // Gọi API của ward
  onDistrictChange(index: string){
    const districtId = this.addresses.controls[index].get("district").value;
    const wardControl = this.addresses.controls[index].get("ward")

    if(districtId === "2") {
      wardControl.clearValidators();
      wardControl.updateValueAndValidity();
    } else {
      wardControl.setValidators([Validators.required]);
      wardControl.updateValueAndValidity();
    }

    this.wardService.getWardList(districtId).subscribe((data) => {
      this.addresses.controls[index].get("ward").setValue("")
      this.wards[index] = data;
    })
  }

  // Đưa API của ward hiển thị trên UI
  getWards(index: string) {
    return this.wards[index] || [];
  }

  createUser() {
    console.log(this.addUserForm.value);
    
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    this.userService.createUser(this.addUserForm.value).subscribe({
      next: (user) => {
        this.router.navigate(["users/list-user"]);
      },
    })
  }
}
