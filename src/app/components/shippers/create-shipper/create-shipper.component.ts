import { Component, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { url } from 'inspector';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { resolve } from 'path';
import { finalize, mergeMap, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { Validation } from 'src/app/constants/Validation';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { ShipperService } from 'src/app/shared/service/shipper.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Shipper } from 'src/app/shared/tables/shipper';
import { User } from 'src/app/shared/tables/User';

@Component({
  selector: 'app-create-shipper',
  templateUrl: './create-shipper.component.html',
  styleUrls: ['./create-shipper.component.scss']
})
export class CreateShipperComponent {
  public accountForm: FormGroup;
  public permissionForm: UntypedFormGroup;
  public active = 1;

  imageFile: File;
  downloadURL: Observable<string>;
  avatar: string;
  edited: boolean = false;

  // Password
  showPassword = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private storage: AngularFireStorage,
    private userService: UserService,
    private shipperService: ShipperService,
    private router: Router,
    private modalService: BsModalService,
    private firebaseService: FirebaseService
  ) {
    this.createPermissionForm();
  }

  

  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.accountForm = this.formBuilder.group(
      {
        fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
        url: new FormControl('', [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        dob: new FormControl("", [Validators.required]),
        phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
        identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
        defaultAddress: new FormControl(""),
        password: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        confirmPassword: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        isLocked: new FormControl(false, [Validators.required]),
        roleName: new FormControl("ROLE_SHIPPER", [Validators.required]),
        shopId: new FormControl("", [Validators.required]),
      },
      {
        validator: this.ConfirmedValidator("password", "confirmPassword"),
      }
    );
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

  createShipper(): Promise<void> {

    // Check all validations addUserForm
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return Promise.reject('Invalid form');
    }

    return new Promise((resolve, rejects) => {
      this.uploadImage(this.imageFile).then((url) => {
        const newUser = new User()
        const newShipper = new Shipper();
        newUser.fullName = this.shipperFullName.value;
        newUser.dateOfBirth = this.shipperDob.value;
        newUser.email = this.shipperEmail.value;
        newUser.phoneNumber = this.shipperPhoneNumber.value;
        newUser.identifiedCode = this.shipperIdentifiedCode.value;
        newUser.imageUrl = url;
        newUser.isLocked = false;
        newUser.defaultAddress = 0;
        newUser.roleName = 'ROLE_SHIPPER'
        console.log(newUser);
        // this.userService.createUser(newUser).subscribe((user) => {
        //   newShipper.userId = user.id;
        //   newShipper.shopId = this.shipperShopId;
        //   console.log(user.id)
        // })

        this.userService.createUserOnly(newUser).pipe(
          mergeMap((user) => {
            newShipper.userId = user.id
            newShipper.shopId = this.shipperShopId.value
            return this.shipperService.createShipper(newShipper)
          })).subscribe({
            next: (shipper) => {
              of(this.firebaseService.signUp(newUser.email, this.shipperPassword.value)).subscribe({
                next: () => {
                  this.router.navigate(["shippers/list"]);
                }
              });
            }
          });

        resolve();
      })
    })
  }

  //Image
  onFileSelected(event) {
    this.edited = true;
    this.imageFile = event.target.files[0];
    console.log(this.imageFile.name)
  }

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
    this.modalRef.hide()
  }

  uploadImage(fileUpload: File): Promise<string> {
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
          // if (url) {
          //     // console.log(url);
          // }
        }
        );
    })
  }

  modalRef: BsModalRef

  chooseImg(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  //Getter
  get url() { return this.accountForm.get('url').value }

  get shipperFullName() { return this.accountForm.get('fullName') }

  get shipperDob() { return this.accountForm.get('dob') }

  get shipperEmail() { return this.accountForm.get('email') }

  get shipperPhoneNumber() { return this.accountForm.get('phoneNumber') }

  get shipperIdentifiedCode() { return this.accountForm.get('identifiedCode')}

  get shipperPassword() { return this.accountForm.get('password') }

  get shipperConfirmPassword() { return this.accountForm.get('confirmPassword') }

  get shipperShopId() { return this.accountForm.get('shopId') }
}
