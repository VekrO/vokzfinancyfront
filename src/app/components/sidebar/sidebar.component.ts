import { Component } from "@angular/core";
import { fadeAnimation, slideInFromLeft } from "src/app/animations/animations";
import { ComponentFactory } from "src/app/utils/componentFactory";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    animations: [slideInFromLeft], // Importe a animação aqui
})
export class SidebarComponent {

    constructor(private componentFactory: ComponentFactory) {}

    destroy() {
        this.componentFactory.destroy();
    }

}