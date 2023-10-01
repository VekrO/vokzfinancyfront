import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

    public token: string = '';
    public processando: boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private notifierService: NotifierService, private authService: AuthenticationService) {}

    ngOnInit(): void {

        this.token = this.route.snapshot.queryParamMap.get("token") ?? '';

        if(!this.token) {
            this.router.navigate(['']);
            this.notifierService.notify('warning', 'Por favor, você deve informar um token!');
        }

    }
    
    onSubmit() {

        if(this.processando) {
            return;
        }

        this.processando = true;

        this.authService.verify(this.token).subscribe({
            next: () => {
                this.notifierService.notify('success', 'Parabéns, sua conta foi confirmada com sucesso!');
                this.processando = false;
                this.router.navigate(['']);
            },
            error: (err) => {
                console.log('ERRO: ', err);
                this.notifierService.notify('error', err.error);
                this.processando = false;
            }
        });

    }



}   