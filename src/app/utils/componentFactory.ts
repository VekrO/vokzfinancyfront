import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, Type, createComponent } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ComponentFactory {

    public componentRef!: ComponentRef<any>

    constructor(private appRef: ApplicationRef, private environmentInjector: EnvironmentInjector) {}

    create(component: Type<any>) {

        this.componentRef = createComponent(component, {
            environmentInjector: this.environmentInjector
        });

        document.body.appendChild(this.componentRef.location.nativeElement);
        
        this.appRef.attachView(this.componentRef.hostView);

    }
    
    destroy() {
        this.appRef.detachView(this.componentRef.hostView);
    }

}