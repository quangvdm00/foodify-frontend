import { Component, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Validation } from "src/app/constants/Validation";
import { ShipperService } from "src/app/shared/service/shipper.service";
import { UserService } from "src/app/shared/service/user.service";
import { Shipper } from "src/app/shared/tables/shipper";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { Observable } from "rxjs-compat";
import { concatMap, finalize, forkJoin, from, of, switchMap } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { User } from "src/app/shared/tables/user";

@Component({
  selector: "app-edit-shipper",
  templateUrl: "./edit-shipper.component.html",
  styleUrls: ["./edit-shipper.component.scss"],
})
export class EditShipperComponent {
  // Form
  editShipperForm: FormGroup;

  // Image
  avatar: string;
  shipperImg: string;

  // Id
  shipperIdToUpdate: number;
  userIdToUpdate: number;

  // Password
  showPassword = false;

  // Shipper status
  isActive: boolean = false;
  isShipping: boolean = false;
  shipperEdited: boolean = false;

  // Property
  shipper: Shipper;

  // File
  downloadURL: Observable<string>;
  shipperImageFile: File;
  imageLink;
  edited: boolean = false;
  fileShipperName: string;

  // Modal
  modalRef: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private shipperService: ShipperService,
    private storage: AngularFireStorage,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.editShipperForm = this.formBuilder.group(
      {
        id: new FormControl(""),
        fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
        imageUrl: new FormControl(''),
        email: new FormControl("", [Validators.required, Validators.email]),
        dateOfBirth: new FormControl("", [Validators.required]),
        phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
        identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
        defaultAddress: new FormControl(""),
        isActive: new FormControl(""),
        isShipping: new FormControl(""),
        password: new FormControl("", [Validators.pattern(Validation.Regex.Password)]),
        confirmPassword: new FormControl("", [Validators.pattern(Validation.Regex.Password)]),
        isLocked: new FormControl(false, [Validators.required]),
        roleName: new FormControl("ROLE_SHIPPER", [Validators.required]),
      },
      {
        validator: this.ConfirmedValidator("password", "confirmPassword"),
      }
    );

    // Get information of shipper to fill the form
    this.route.params.subscribe((val) => {
      this.shipperIdToUpdate = val["id"];
      this.shipperService.getShipperById(this.shipperIdToUpdate).subscribe((res) => {
        console.log(res);
        this.fillFormToUpdate(res);
      });
    });
  }

  fillFormToUpdate(response: Shipper) {
    this.isActive = response.isActive;
    this.isShipping = response.isShipping;
    this.userIdToUpdate = response.user.id;
    this.shipperImg = response.user.imageUrl;

    this.editShipperForm.patchValue({
      id: response.id,
      fullName: response.user.fullName,
      email: response.user.email,
      dateOfBirth: response.user.dateOfBirth,
      phoneNumber: response.user.phoneNumber,
      identifiedCode: response.user.identifiedCode,
      defaultAddress: response.user.defaultAddress,
      isLocked: response.user.isLocked,
    });
  }

  // Set avatar image
  onFileSelected(event) {
    this.edited = true;
    this.fileShipperName = event.target.files[0].name;
    this.shipperImageFile = (event.target as HTMLInputElement).files[0];
    console.log(this.shipperImageFile);
    
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.avatar = reader.result as string;
        localStorage.setItem("image", this.avatar);
      };
    }
    this.modalRef.hide();
    console.log("New image: " + this.edited);
  }

  // Modal Image
  chooseImg(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  // Upload the image to firebase
  uploadShipperImage(fileUpload: File): Promise<string> {
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
            this.downloadURL.subscribe((url) => {
              if (url) {
                resolve(url);
              }
            });
          })
        )
        .subscribe((url) => {});
    });
  }

  // Validation for password and confirm password
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

  // Check isActive
  swapActive() {
    // if (this.isActive) {
    //   this.isActive = false;
    //   console.log("Swap Active case 01: " + this.isActive);
    //   if (this.isShipping) {
    //     this.isShipping = false;
    //     console.log("SwapShipping case 02 in active: " + this.isShipping);
    //   }
    // } else {
    //   this.isActive = true;
    //   console.log("Swap Active case 02: " + this.isActive);
    // }
    console.log("Active state before: " + this.isActive);
    if (this.isActive) {
      this.isShipping = false;
    }
    this.isActive = !this.isActive;
    console.log("Active state after: " + this.isActive);
    console.log("Shipping state from swapActive: " + this.isShipping);
    
  }

  // Check isShipping
  swapShipping() {
    // console.log("active log 1: " + this.isActive);
    // console.log("shipping log 1: " + this.isShipping);
    
    // if (this.isActive && !this.isShipping) {
    //   this.isShipping = true;
    //   console.log("SwapShipping case 01: " + this.isShipping);
    // } else if (this.isActive && this.isShipping) {
    //   this.isShipping = false;
    //   console.log("SwapShipping case 02 in shipping: " + this.isShipping);
    // } 
    // console.log("active log 2: " + this.isActive);
    // console.log("shipping log 2: " + this.isShipping);
    console.log("Shipping state before: " + this.isShipping);
    if (this.isActive) {
      this.isShipping = !this.isShipping;
    }
    console.log("Shipping state after: " + this.isShipping);
    
  }
  
  // Update shipper information
  updateShipper() {
    let editShipper = new Shipper();
    let editUser = new User();

    editShipper.isActive = this.isActive;
    editShipper.isShipping = this.isShipping;

    editUser.fullName = this.fullName.value;
    editUser.email = this.email.value;
    editUser.dateOfBirth = this.dateOfBirth.value;
    editUser.phoneNumber = this.phoneNumber.value;
    editUser.identifiedCode = this.identifiedCode.value;
    editUser.defaultAddress = 0;
    editUser.isLocked = false;
    editUser.roleName = "ROLE_SHIPPER";

    const updateUser$ = this.userService.updateUser(this.userIdToUpdate, editUser);
    const updateShipperActive$ = this.shipperService.updateShiperActive(this.shipperIdToUpdate, editShipper, this.isActive);
    const updateShipperShipping$ = this.shipperService.updateShiperShipping(this.shipperIdToUpdate, editShipper, this.isShipping);
    
    if (editUser && editShipper) {
      if (this.shipperImageFile) {
        this.uploadShipperImage(this.shipperImageFile).then((url) => {
          editUser.imageUrl = url
          return updateUser$.subscribe({
            next: () => {
              updateShipperActive$.subscribe({
                next: () => {
                  updateShipperShipping$.subscribe({
                    next: () => {
                      this.router.navigate(["shippers/list"]);
                    }
                  })
                }
              })
            }
          })
        })
      } else {
        editUser.imageUrl = this.shipperImg;
        return updateUser$.subscribe({
          next: () => {
            updateShipperActive$.subscribe({
              next: () => {
                updateShipperShipping$.subscribe({
                  next: () => {
                    this.router.navigate(["shippers/list"]);
                  }
                })
              }
            })
          }
        })
      }
    } 

    // Check all validations addUserForm
    if (this.editShipperForm.invalid) {
      this.editShipperForm.markAllAsTouched();
      return;
    }
  }

  //Getter
  get id() {
    return this.editShipperForm.get("id");
  }
  get imageUrl() {
    return this.editShipperForm.get("imageUrl");
  }
  get fullName() {
    return this.editShipperForm.get("fullName");
  }
  get email() {
    return this.editShipperForm.get("email");
  }
  get dateOfBirth() {
    return this.editShipperForm.get("dateOfBirth");
  }
  get phoneNumber() {
    return this.editShipperForm.get("phoneNumber");
  }
  get identifiedCode() {
    return this.editShipperForm.get("identifiedCode");
  }
  get defaultAddress() {
    return this.editShipperForm.get("defaultAddress");
  }
  get password() {
    return this.editShipperForm.get("password");
  }
  get confirmPassword() {
    return this.editShipperForm.get("confirmPassword");
  }
  get isLocked() {
    return this.editShipperForm.get("isLocked");
  }
  get roleName() {
    return this.editShipperForm.get("roleName");
  }
}
