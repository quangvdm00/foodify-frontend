import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CarouselModule } from "ngx-owl-carousel-o";
import { SharedModule } from "../../shared/shared.module";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { SignupComponent } from "./signup/signup.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SendEmailComponent } from './send-email/send-email.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ForbiddenComponent, ResetPasswordComponent, SendEmailComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    CarouselModule,
    SharedModule,
    NgbModule,
    FormsModule],
})
export class AuthModule { }
