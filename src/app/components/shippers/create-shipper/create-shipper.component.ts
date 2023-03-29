import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { rejects } from 'assert';
import { url } from 'inspector';
import { resolve } from 'path';
import { finalize, mergeMap, Observable } from 'rxjs';
import { switchMap } from 'rxjs-compat/operator/switchMap';
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
  public accountForm: UntypedFormGroup;
  public permissionForm: UntypedFormGroup;
  public active = 1;

  imageFile: File;
  downloadURL: Observable<string>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private storage: AngularFireStorage,
    private userService: UserService,
    private shipperService: ShipperService
  ) {
    this.createAccountForm();
    this.createPermissionForm();
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      fullName: [''],
      dob: [''],
      email: [''],
      phoneNumber: [''],
      identifiedCode: [''],
      image: [''],
      password: [''],
      confirmPassword: [''],
      shopId: ['']
    });
  }

  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({});
  }

  ngOnInit() {
  }

  createShipper(): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.uploadImage(this.imageFile).then((url) => {
        const newUser = new User()
        const newShipper = new Shipper();
        newUser.fullName = this.shipperFullName;
        newUser.dateOfBirth = this.shipperDob;
        newUser.email = this.shipperEmail;
        newUser.phoneNumber = this.shipperPhoneNum;
        newUser.identifiedCode = this.shipperIdentifiedCode;
        newUser.imageUrl = url
        newUser.isLocked = false;
        newUser.defaultAddress = 0;
        newUser.roleName = 'ROLE_SHIPPER'
        console.log(newUser);
        // this.userService.createUser(newUser).subscribe((user) => {
        //   newShipper.userId = user.id;
        //   newShipper.shopId = this.shipperShopId;
        //   console.log(user.id)
        // })

        this.userService.createNewUser(newUser).pipe(
          mergeMap((user) => {
            newShipper.userId = user.id
            newShipper.shopId = this.shipperShopId
            return this.shipperService.createShipper(newShipper)
          })).subscribe();

        resolve();
      })
    })
  }

  //Image
  onFileSelected(event) {
    this.imageFile = event.target.files[0];
    console.log(this.imageFile.name)
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

  //Getter
  get shipperFullName() { return this.accountForm.get('fullName').value }

  get shipperDob() { return this.accountForm.get('dob').value }

  get shipperEmail() { return this.accountForm.get('email').value }

  get shipperPhoneNum() { return this.accountForm.get('phoneNumber').value }

  get shipperIdentifiedCode() { return this.accountForm.get('identifiedCode').value }

  get shipperPassword() { return this.accountForm.get('password').value }

  get shipperConfirmPassword() { return this.accountForm.get('confirmPassword').value }

  get shipperShopId() { return this.accountForm.get('shopId').value }
}
