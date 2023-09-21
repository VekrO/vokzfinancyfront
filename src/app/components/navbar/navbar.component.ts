import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public opened: boolean = true;

  close(navbar: HTMLDivElement) {
    if(this.opened) {
      navbar.style.right = - navbar.getBoundingClientRect().width + 'px';
      this.opened = false;
    } else {
      navbar.style.right = '0px';
      this.opened = true;
    }
  }

}
