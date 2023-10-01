import { NgModule } from "@angular/core";
import { SharedModule } from "../shared.module";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { PerfilComponent } from "./perfil/perfil.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { VerifyComponent } from "./verify/verify.component";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        PerfilComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        VerifyComponent
    ],
    imports: [
        SharedModule,
        AuthenticationRoutingModule
    ],
    exports: []
})
export class AuthenticationModule {}