import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { SignupComponent } from "./signup/signup.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SendEmailComponent } from "./send-email/send-email.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forbidden",
    component: ForbiddenComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "send-email",
    component: SendEmailComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
