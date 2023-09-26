import { DynamicDialogRef } from './dynamicDialogRef.service';
import { Injectable, createComponent, Type, ApplicationRef, EnvironmentInjector, ComponentRef } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import { ModalComponent } from "../components/modal/modal.component";
import { DynamicDialogConfig } from "./dynamicDialog.service";

@Injectable({
    providedIn: 'root',
})
export class ModalService {

    private modalNotifier!: Subject<string>;
    private dialogContentRef!: ComponentRef<any>;
    private dialogRef!: ComponentRef<any>;
    private unsub$: Subject<void> = new Subject();

    constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector, private dynamicDialogConfig: DynamicDialogConfig, private dynamicDialogRef: DynamicDialogRef) { }

    open(component: Type<any>, options: { data: {}, title?: string, width?: string, height?: string }): Observable<any> {

        this.dynamicDialogConfig.data = options.data;

        this.dialogContentRef = createComponent(component, { 
            environmentInjector: this.injector,
        });

        this.dialogRef = createComponent(ModalComponent, {
            environmentInjector: this.injector,
            hostElement: document.querySelector('.modal-container')!,
            projectableNodes: [
              // ng-content nodes
              [this.dialogContentRef.location.nativeElement],
            ]
        });

        this.dialogRef.instance.closeEvent.subscribe(() => this.close());
        this.dynamicDialogRef.onDestroy.pipe(takeUntil(this.unsub$)).subscribe((message) => this.close(message));

        this.dialogRef.instance.title = options?.title;
        this.dialogRef.instance.width = options?.width;
        this.dialogRef.instance.height = options?.height;
        
        document.body.appendChild(this.dialogRef.location.nativeElement);

        this.dialogRef.changeDetectorRef.detectChanges();
            
        this.appRef.attachView(this.dialogContentRef.hostView);
        this.appRef.attachView(this.dialogRef.hostView);

        this.modalNotifier = new Subject();
        return this.modalNotifier.asObservable();

    }

    close(message: string = '') {
        this.appRef.detachView(this.dialogContentRef.hostView);
        this.appRef.detachView(this.dialogRef.hostView);
        this.unsub$.next();
        this.modalNotifier.next(message);
        this.modalNotifier.complete();
    }

}