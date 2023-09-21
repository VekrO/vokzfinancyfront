import { NgModule } from "@angular/core";
import { SharedModule } from "../shared.module";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthenticationRoutingModule } from "./authentication-routing.module";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        SharedModule,
        AuthenticationRoutingModule
    ],
    exports: []
})
export class AuthenticationModule {}