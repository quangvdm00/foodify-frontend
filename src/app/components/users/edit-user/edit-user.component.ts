import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators, UntypedFormGroup, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Validation } from "src/app/constants/Validation";
import { DistrictService } from "src/app/shared/service/district.service";
import { UserService } from "src/app/shared/service/user.service";
import { WardService } from "src/app/shared/service/ward.service";
import { Address } from "src/app/shared/tables/address";
import { District } from "src/app/shared/tables/district";
import { User } from "src/app/shared/tables/user";
import { Ward } from "src/app/shared/tables/ward";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  avatar: string;
  userIdToUpdate: string;
  showPassword = false;
  districts: District[];
  wards: Ward[][] = [];

  
  // wards: Ward[] = []

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private districtService: DistrictService,
    private wardService: WardService
  ) {}

  ngOnInit() {
    this.editUserForm = this.formBuilder.group(
      {
        id: new FormControl(""),
        imageUrl: new FormControl("", [Validators.required]),
        fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        dateOfBirth: new FormControl("", [Validators.required]),
        phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
        identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
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
          Validators.pattern(Validation.Regex.Password),
        ]),
        confirmPassword: new FormControl("", [
          Validators.required,
          Validators.pattern(Validation.Regex.Password),
        ]),
        isLocked: new FormControl(false, [Validators.required]),
        roleName: new FormControl("ROLE_USER", [Validators.required]),
      },
      {
        validator: this.ConfirmedValidator("password", "confirmPassword"),
      }
    );

    this.districtService.getDistrictList().subscribe((data) => {
      this.districts = data;
      console.log(data);
    });

    // Lấy thông tin của người dùng
    this.route.params.subscribe((val) => {
      this.userIdToUpdate = val["id"];
      console.log(this.userIdToUpdate);
      this.userService.getUser(this.userIdToUpdate).subscribe((res) => {
        console.log(res);
        this.fillFormToUpdate(res);
      });
    });
  }

  get id() {return this.editUserForm.get("id");}
  get imageUrl() {return this.editUserForm.get("imageUrl");}
  get fullName() {return this.editUserForm.get("fullName");}
  get email() {return this.editUserForm.get("email");}
  get dateOfBirth() {return this.editUserForm.get("dateOfBirth");}
  get phoneNumber() {return this.editUserForm.get("phoneNumber");}
  get identifiedCode() {return this.editUserForm.get("identifiedCode");}
  get addresses() {return this.editUserForm.get("addresses") as FormArray;}
  get addressId() {return this.editUserForm.get("addresses")["controls"][0].get("addressId");}
  get address() {return this.editUserForm.get("addresses")["controls"][1].get("address");}
  get district() {return this.editUserForm.get("addresses")["controls"][2].get("district");}
  get ward() {return this.editUserForm.get("addresses")["controls"][3].get("ward");}
  get password() {return this.editUserForm.get("password");}
  get confirmPassword() {return this.editUserForm.get("confirmPassword");}
  get isLocked() {return this.editUserForm.get("isLocked");}
  get roleName() {return this.editUserForm.get("roleName");}

  fillFormToUpdate(response: User) {
    this.editUserForm.patchValue({
      id: response.id,
      // imageUrl: response.imageUrl,
      fullName: response.fullName,
      email: response.email,
      dateOfBirth: response.dateOfBirth,
      phoneNumber: response.phoneNumber,
      identifiedCode: response.identifiedCode,
      // password: response.password,
      // confirmPassword: response.confirmPassword,
      isLocked: response.isLocked,
    });

    // Tạo control cho từng địa chỉ
    const addresses = response.addresses.map((address) => this.createAddressControl(address));
    this.editUserForm.setControl("addresses", this.formBuilder.array(addresses));
  }

  createAddressControl(address: Address): FormGroup {
    console.log("Address:", address);
    return this.formBuilder.group({
      addressId: [address.id],
      address: [address.address],
      district: [address.district],
      ward: [address.ward],
    });
    
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
  onDistrictChange(index: string) {
    const districtId = this.addresses.controls[index].get("district").value;
    const wardControl = this.addresses.controls[index].get("ward");

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
    this.wardService.getWardList(districtId).subscribe((data) => {
      this.addresses.controls[index].get("ward").setValue("");
      this.wards[index] = districtId === "2" ? [] : data;
    });
  }
  

  // Đưa API của ward hiển thị trên UI
  getWards(index: string) {
    return this.wards[index] || [];
  }

  addAddress() {
    this.addresses.push(
      this.formBuilder.group({
        addressId: new FormControl(""),
        address: new FormControl("", [Validators.required]),
        district: new FormControl("", [Validators.required]),
        ward: new FormControl("", [Validators.required]),
      })
    );
    console.log(this.addresses.value);
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  updateUser() {}
}
