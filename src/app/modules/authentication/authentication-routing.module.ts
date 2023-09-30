import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'reset-password', component: ResetPasswordComponent
    },
    {
        path: 'forgot-password', component: ForgotPasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule {}