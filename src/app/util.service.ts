import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    isDesktop(): boolean {
        return window.innerWidth >= 1024;
    }

}