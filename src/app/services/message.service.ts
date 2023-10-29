import { Injectable } from "@angular/core";
import { NotifierService } from "angular-notifier";

@Injectable({
    providedIn: 'root',
})
export class MessageService {

    constructor(private notifierService: NotifierService) {}

    notify(type: string, message: string) {
        this.notifierService.notify(type, message);
    }

}