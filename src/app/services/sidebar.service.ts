import { ComponentFactoryResolver, ComponentRef, Injectable, Injector, OnDestroy, Type, ViewContainerRef } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SidebarService {

    private sidebarNotifier!: Subject<void>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) { }

    open(componentType: Type<any>, dynamicComponentContainer: ViewContainerRef, options: { title: string, item: any, route: string }) {
        
        // Crie uma fábrica de componente usando o ComponentFactoryResolver
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        
        // Crie uma instância do componente dinâmico
        const dynamicComponentRef = componentFactory.create(this.injector);

        dynamicComponentRef.instance.closeEvent.subscribe(() => this.close(dynamicComponentRef));
        dynamicComponentRef.instance.title = options.title;
        dynamicComponentRef.instance.item = options.item;
        dynamicComponentRef.instance.route = options.route;

        // Adicione o componente dinâmico ao contêiner especificado
        dynamicComponentContainer.clear(); // Limpe qualquer conteúdo anterior
        dynamicComponentContainer.insert(dynamicComponentRef.hostView);

        this.sidebarNotifier =  new Subject();
        return this.sidebarNotifier.asObservable();

    }

    close(dynamicComponentRef: ComponentRef<any>) {
        dynamicComponentRef.destroy();
        this.sidebarNotifier.next();
        this.sidebarNotifier.complete();
    }

}