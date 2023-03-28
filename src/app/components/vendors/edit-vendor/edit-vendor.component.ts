import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeMapModule } from '@swimlane/ngx-charts';
import { rejects } from 'assert';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { resolve } from 'path';
import { element } from 'protractor';
import { EMPTY, finalize, switchMap } from 'rxjs';
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
  //ids
  userId: number;
  shopId: number;
  addressId: number;

  // form
  public active = 1;
  editUserForm: FormGroup;
  editShopForm: FormGroup;


  // image
  avatar: string;
  shopBanner: string;

  // file
  downloadURL: Observable<string>;
  userImageFile: File;
  shopImageFile: File;
  imageLink;
  edited: boolean = false;
  shopEdited: boolean = false;
  fileUserName: string;

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
  userImg: string;
  shopImg: string;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private shopService: ShopService,
    private districtService: DistrictService,
    private wardService: WardService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private modalService: BsModalService
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
        image: new FormControl("", [Validators.required]),
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
    this.userImg = response.user.imageUrl;
    this.shopImg = response.imageUrl;
    this.userId = response.user.id;
    this.shopId = response.id;
    this.addressId = response.user.addresses[0].id;
    console.log(this.userId + " " + this.shopId + " " + this.addressId)

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
    const editUser = new User();
    const editAddress = new Address();
    const editShop = new Shop();

    editUser.fullName = this.userFullName;
    editUser.email = this.userEmail;
    editUser.dateOfBirth = this.userDateOfBirth;
    editUser.phoneNumber = this.userPhoneNumber;
    editUser.identifiedCode = this.userIdentifiedCode;
    editUser.defaultAddress = 0;
    editUser.isLocked = false;
    editUser.roleName = 'ROLE_SHOP';

    editAddress.id = this.addressId
    editAddress.address = this.userAddress;
    editAddress.district = this.userDistrict;
    if (this.userDistrict != "Huyện Hoàng Sa") editAddress.ward = this.userWard;

    editShop.name = this.shopName
    editShop.description = this.shopDescription;
    editShop.isStudent = this.isStudent;
    editShop.isEnabled = this.isEnabled;

    if (this.edited == true && this.shopEdited == true) {
      this.uploadUserImage(this.userImageFile).then((url) => {
        editUser.imageUrl = url
        this.userService.updateUser(this.userId, editUser).pipe(
          switchMap((user) => {
            this.uploadShopImage(this.shopImageFile).then((url) => {
              editShop.imageUrl = url;
              this.shopService.updateShop(this.shopId, editShop).subscribe();
              this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
                () => { },
                (error) => {
                  console.log("Address existed ! No problem")
                });
            })
            return EMPTY;
          })
        ).subscribe();
      })
    } else if (this.edited && !this.shopEdited) {
      this.uploadUserImage(this.userImageFile).then
    } else if (!this.edited && this.shopEdited) {
      console.log("Edit shop only");
    } else {
      console.log("No need to upload")
    }


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

  //Image
  onFileSelected(event) {
    this.edited = true;
    this.fileUserName = event.target.files[0].name;
    this.userImageFile = (event.target as HTMLInputElement).files[0];
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

  //Shop Image
  onShopFileSelected(event) {
    this.shopEdited = true;
    this.shopImageFile = event.target.files[0];
    console.log(this.shopImageFile)
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file)

      reader.onload = () => {
        this.shopBanner = reader.result as string;
        localStorage.setItem("image", this.shopBanner);
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

  uploadShopImage(fileUpload: File): Promise<string> {
    return new Promise<string>((resolve) => {
      let n = Date.now();
      const filePath = `Shops/${n}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`Shops/${n}`, fileUpload);
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

  //Modal
  modalRef: BsModalRef;

  chooseImg(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
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

