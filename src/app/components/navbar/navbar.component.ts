import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfirmacaoComponent } from '../confirmacao/confirmacao.component';
import { ModalService } from 'src/app/services/modal.service';
import { NotifierService } from 'angular-notifier';
import { Usuario } from 'src/app/models/Usuario.model';
import { PerfilComponent } from 'src/app/modules/authentication/perfil/perfil.component';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isAuthenticated: boolean = false;
  public activeRoute: string = '';
  private usuario!: Usuario;

  constructor(
    private authService: AuthenticationService, 
    private router: Router, 
    private modalService: ModalService, 
    private notiferService: NotifierService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {

    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      console.log('tá autenticado: ', isAuthenticated);
      this.isAuthenticated = isAuthenticated;
      if(isAuthenticated) {
        this.usuario = this.authService.getUsuario();
      }
    });

    this.router.events.pipe(filter(c => c instanceof NavigationEnd)).subscribe({
      next: (event: any) => {
        this.activeRoute = event.url;
      }
    });

  }

  perfil() {

    this.modalService.open(PerfilComponent, {
      data: {},
      width: this.utilService.isMobile() ? '95%' : '30%'
    }).subscribe({
      next: (res) => {
        console.log('resposta: ', res);
        
      }
    })

  }

  desconectar() {
    this.modalService.open(ConfirmacaoComponent, {data: {}, title: 'Deseja se desconectar do sistema ?', width: this.utilService.isMobile() ? '95%' : '50%' }).subscribe({
      next: (res) => {
          if(res && res == 'OK') {
            this.authService.clearToken();
            this.router.navigate(['']);
            this.notiferService.notify('success', 'Você foi desconectado com sucesso!');
          }
      }
    });
  }

}
