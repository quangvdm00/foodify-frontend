import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeMapModule } from '@swimlane/ngx-charts';
import { rejects } from 'assert';
import { resolve } from 'path';
import { element } from 'protractor';
import { Observable } from 'rxjs-compat';
import { DistrictService } from 'src/app/shared/service/district.service';
import { ShopService } from 'src/app/shared/service/shop.service';
import { UserService } from 'src/app/shared/service/user.service';
import { WardService } from 'src/app/shared/service/ward.service';
import { Address } from 'src/app/shared/tables/Address';
import { District } from 'src/app/shared/tables/District';
import { Shop } from 'src/app/shared/tables/Shop';
import { User } from 'src/app/shared/tables/User';
import { Ward } from 'src/app/shared/tables/Ward';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {
  // form
  public active = 1;
  editUserForm: FormGroup;
  editShopForm: FormGroup;

  // image
  avatar: string;

  // file
  downloadURL: Observable<string>;
  imageFile: File;
  imageLink;

  // password
  showPassword = false;

  // address
  isHaveDistrict: boolean;
  district: District;
  districts: District[];
  wards: Ward[] = [];

  //Shop
  isStudent: boolean = true;
  isEnabled: boolean = true;
  shopImg: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private shopService: ShopService,
    private districtService: DistrictService,
    private wardService: WardService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute
  ) {
    this.createUserForm();
    this.createEditShopForm();
  }

  ngOnInit() {
    const shopId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllDistrict().then(() => {
      this.shopService.getShopById(shopId).subscribe((data => this.fillFormToUpdate(data)))
    }).catch(error => console.log(error));
  }

  createUserForm() {
    this.editUserForm = this.formBuilder.group(
      {
        imageUrl: new FormControl("", [Validators.required]),
        fullName: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        dateOfBirth: new FormControl("", [Validators.required]),
        phoneNumber: new FormControl("", [Validators.required]),
        identifiedCode: new FormControl("", [Validators.required]),
        address: new FormControl("", [Validators.required]),
        district: new FormControl("", [Validators.required]),
        ward: new FormControl("", [Validators.required]),
        password: new FormControl("", [Validators.required]),
        confirmPassword: new FormControl("", [Validators.required]),
      }
    );
  }

  createEditShopForm() {
    this.editShopForm = this.formBuilder.group(
      {
        name: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        image: new FormControl(""),
      }
    );
  }

  fillFormToUpdate(response: Shop) {
    this.isHaveDistrict = false;
    this.isEnabled = response.isEnabled;
    this.shopImg = response.imageUrl;

    this.shopService.downloadImage(this.shopImg)

    this.districts.forEach((element: District) => {
      if (response.user.addresses[0].district == element.name && response.user.addresses[0].district != "Huyện Hoàng Sa") {
        this.isHaveDistrict = true;
        this.wards = element.wards
        console.log(this.wards)
      }
    })

    this.editUserForm.patchValue({
      fullName: response.user.fullName,
      email: response.user.email,
      dateOfBirth: response.user.dateOfBirth,
      phoneNumber: response.user.phoneNumber,
      identifiedCode: response.user.identifiedCode,
      address: response.user.addresses[0].address,
      district: response.user.addresses[0].district,
      ward: response.user.addresses[0].ward
    })

    this.editShopForm.patchValue({
      name: response.name,
      description: response.description
    })

    console.log(this.userWard)
  }

  onDistrictSelected() {
    this.isHaveDistrict = false;

    this.districts.forEach((element: District) => {
      if (this.userDistrict == element.name && this.userDistrict != 'Huyện Hoàng Sa') {
        this.isHaveDistrict = true;
        this.wards = element.wards
      }
    });
  }

  //Edit vendor
  editUser() {
    const newUser = new User();
    const newAddress = new Address();
    const newShop = new Shop();

    newUser.fullName = this.userFullName;
    newUser.email = this.userEmail;
    newUser.dateOfBirth = this.userDateOfBirth;
    newUser.phoneNumber = this.userPhoneNumber;
    newUser.identifiedCode = this.userIdentifiedCode;
    newUser.defaultAddress = 0;
    newUser.isLocked = false;
    newUser.roleName = 'ROLE_SHOP';

    newAddress.address = this.userAddress;
    newAddress.district = this.userDistrict;
    if (this.userDistrict != "Huyện Hoàng Sa") newAddress.ward = this.userWard;

    newShop.name = this.shopName
    newShop.description = this.shopDescription;
    newShop.isStudent = this.isStudent;
    newShop.isEnabled = true;

    console.log(newUser);
    console.log(newAddress)
    console.log(newShop)
  }

  //Districts
  getAllDistrict(): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.districtService.getAllDistricts().subscribe(
        (distrc) => {
          this.districts = distrc;
          resolve();
        }
      )
    })
  }

  swap() {
    if (this.isStudent) {
      this.isStudent = false
    }
    else {
      this.isStudent = true;
    }
  }

  swapEnabled() {
    if (this.isEnabled) {
      this.isEnabled = false
    }
    else {
      this.isEnabled = true;
    }
  }


  //Getter
  get userFullName() { return this.editUserForm.get("fullName").value; }
  get userEmail() { return this.editUserForm.get("email").value; }
  get userDateOfBirth() { return this.editUserForm.get("dateOfBirth").value; }
  get userPhoneNumber() { return this.editUserForm.get("phoneNumber").value; }
  get userIdentifiedCode() { return this.editUserForm.get("identifiedCode").value }
  get userAddress() { return this.editUserForm.get("address").value; }
  get userDistrict() { return this.editUserForm.get("district").value; }
  get userWard() { return this.editUserForm.get("ward").value; }
  get userPassword() { return this.editUserForm.get("password").value; }
  get userConfirmPassword() { return this.editUserForm.get("confirmPassword").value; }

  //Shop
  get shopName() { return this.editShopForm.get("name").value }
  get shopDescription() { return this.editShopForm.get("description").value }

  // // Set avatar image
  // onFileChange(event) {
  //     const reader = new FileReader();
  //     if (event.target.files && event.target.files.length) {
  //         const [file] = event.target.files;
  //         reader.readAsDataURL(file);

  //         reader.onload = () => {
  //             this.avatar = reader.result as string;
  //             localStorage.setItem("image", this.avatar);
  //         };
  //     }
  //     this.imageFile = event.target.files[0];
  // }

  // // Upload the image to firebase
  // uploadImage(): Promise<void> {
  //     return new Promise<void>((resolve) => {
  //         let n = Date.now();
  //         const filePath = `UserImages/${n}`;

  //         const fileRef = this.storage.ref(filePath);
  //         const task = this.storage.upload(`UserImages/${n}`, this.imageFile);
  //         task
  //             .snapshotChanges()
  //             .pipe(
  //                 finalize(() => {
  //                     this.downloadURL = fileRef.getDownloadURL();
  //                     this.downloadURL.subscribe((url) => {
  //                         if (url) {
  //                             //return url here
  //                             this.imageLink = url;
  //                         }
  //                         resolve();
  //                     });
  //                 })
  //             )
  //             .subscribe((url) => {
  //                 // if (url) {
  //                 //     // console.log(url);
  //                 // }
  //             });
  //     });
  // }

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

  // // Call API of wards
  // onDistrictChange(index: string) {
  //     const districtId = this.addressDto.controls[index].get("district").value;
  //     const wardControl = this.addressDto.controls[index].get("ward");

  //     // If districtId == "2" (Hoang Sa) -> No Validate "Ward"
  //     if (districtId === "2") {
  //         wardControl.clearValidators();
  //         wardControl.updateValueAndValidity();
  //         wardControl?.disable();
  //         this.wards = [];
  //     } else {
  //         wardControl.setValidators([Validators.required]);
  //         wardControl.updateValueAndValidity();
  //         wardControl?.enable();
  //     }

  //     // Get API wards of each district
  //     this.wardService.getWardList(districtId).subscribe((data) => {
  //         this.addressDto.controls[index].get("ward").setValue("");
  //         this.wards = districtId === "2" ? [] : data;
  //     });
  // }

}

