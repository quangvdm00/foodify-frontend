import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForbiddenComponent } from './components/auth/forbidden/forbidden.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { AuthGuard } from './shared/guard/auth-guard.service';
import { NotLogged } from './shared/guard/not-logged.service';
import { EmailVerifiedComponent } from './components/auth/email-verified/email-verified.component';
import { EmailNotVerifiedComponent } from './components/auth/email-not-verified/email-not-verified.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/default',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: content
  },
  {
    path: 'auth/login',
    canActivate: [NotLogged],
    component: LoginComponent,
  },
  {
    path: 'auth/signup',
    canActivate: [NotLogged],
    component: SignupComponent
  },
  {
    path: 'auth/forbidden',
    canActivate: [NotLogged],
    component: ForbiddenComponent
  },
  {
    path: 'auth/reset-password',
    canActivate: [NotLogged],
    component: ResetPasswordComponent
  },
  {
    path: 'auth/email-verified',
    canActivate: [NotLogged],
    component: EmailVerifiedComponent
  },
  {
    path: 'auth/email-not-verified',
    canActivate: [NotLogged],
    component: EmailNotVerifiedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
