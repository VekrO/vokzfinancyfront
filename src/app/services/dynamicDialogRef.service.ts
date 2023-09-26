import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DynamicDialogRef {
    
    private _destroy: Subject<string> = new Subject();
    public onDestroy: Observable<string> = this._destroy.asObservable();

    destroy(message: string = ''): void {
        this._destroy.next(message);
    }
    
}