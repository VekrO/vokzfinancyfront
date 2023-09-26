import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
    
    public closeEvent: Subject<void> = new Subject();
    @Input() public title?: string = '';
    @Input() public width?: string = '';
    @Input() public height?: string = '';

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        console.log('MODAL COMPONENT INIT');        
    }

    close(event: MouseEvent) {
        this.el.nativeElement.remove();
        this.closeEvent.next();
    }
  
}