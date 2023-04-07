import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { FirebaseService } from "../../../shared/service/firebase.service";
import { Router } from "@angular/router";
import { Validation } from "src/app/constants/Validation";

@Component({
  selector: "app-send-email",
  templateUrl: "./send-email.component.html",
  styleUrls: ["./send-email.component.scss"],
})
export class SendEmailComponent {
  public sendEmailForm: FormGroup;
  public active = 1;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {

  }

  owlcarousel = [
    {
      title: "Chào mừng đến với Foodify",
      desc: "Foodify - Một trong những ứng dụng đặt đồ ăn tốt nhất hiện nay, được phát triển bởi Pyramide team",
    },
    {
      title: "Foodify - xu hướng mới",
      desc: "Với mục đích tạo ra những sản phẩm tốt nhất cho người dùng, chúng mình đã quyết định sử dụng các công nghệ mới nhất vào Foodify",
    },
    {
      title: "Về Pyramide Team",
      desc: "Pyramide team là một nhóm sinh viên trường Đại học FPT, team nghiên cứu và phát triển sản phẩm theo công nghệ Angular và Spring Boot",
    },
  ];
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true,
  };

  ngOnInit() {
    this.sendEmailForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }

  sendPasswordResetMail() {
    if (this.sendEmailForm.invalid) {
      this.sendEmailForm.markAllAsTouched();
      return;
    }
    this.firebaseService.resetPassword(this.email.value);
  }

  get email() {
    return this.sendEmailForm.get("email");
  }
}
