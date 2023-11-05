import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeAnimation = trigger('fade', [
    state('void', style({ opacity: 0 })),
    transition(':enter, :leave', [
        animate(300, style({ opacity: 1 })),
    ]),
]);

export const slideInFromLeft = trigger('slideInFromLeft', [

    // void significa o estado inicial
    state('void', style({ transform: 'translateX(-100%)' })), // Defina a posição inicial fora da tela
    
    // enter significa que será chamado quando o elemento for inserido no DOM.
    transition(':enter', [
        animate('200ms', style({ transform: 'translateX(0)' })) // Mova o elemento para a posição desejada
    ])

]);