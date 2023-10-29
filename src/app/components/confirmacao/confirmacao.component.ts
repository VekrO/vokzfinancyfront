import { Component, OnInit } from "@angular/core";
import { DynamicDialogRef } from "src/app/services/dynamicDialogRef.service";

@Component({
    selector: 'app-confirmacao',
    templateUrl: './confirmacao.component.html',
    styleUrls: ['./confirmacao.component.css']
})
export class ConfirmacaoComponent  {
    
    constructor(private dynamicDialogRef: DynamicDialogRef) {}

    voltar() {
        this.dynamicDialogRef.destroy();
    }
    
    confirmar() {
        console.log('CONFIRMOU');
        this.dynamicDialogRef.destroy('OK');
    }

}