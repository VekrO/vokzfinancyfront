import { Component } from "@angular/core";
import { DynamicDialogRef } from "src/app/services/dynamicDialogRef.service";

@Component({
    selector: 'app-confirmacao',
    templateUrl: './confirmacao.component.html',
    styleUrls: ['./confirmacao.component.css']
})
export class ConfirmacaoComponent {

    public header: string = '';
    public message: string = '';

    constructor(private dynamicDialogRef: DynamicDialogRef) {}

    voltar() {
        console.log('VOLTOU');
        this.dynamicDialogRef.destroy();
    }
    
    confirmar() {
        console.log('CONFIRMOU');
        this.dynamicDialogRef.destroy('OK');
    }

}