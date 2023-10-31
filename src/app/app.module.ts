import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FinanceiroModule } from './modules/financeiro/financeiro.module';

import localePt from '@angular/common/locales/pt';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './interceptors/http.interceptor';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { NotifierModule } from 'angular-notifier';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DashboardModule,
    FinanceiroModule,
    AuthenticationModule,
    AppRoutingModule,
    HttpClientModule,
    NotifierModule.withConfig({
      position: {

        horizontal: {
      
          /**
           * Defines the horizontal position on the screen
           * @type {'left' | 'middle' | 'right'}
           */
          position: window.innerWidth > 768 ? 'right' : 'left',
      
          /**
           * Defines the horizontal distance to the screen edge (in px)
           * @type {number}
           */
          distance: 12
      
        },
      
        vertical: {
      
          /**
           * Defines the vertical position on the screen
           * @type {'top' | 'bottom'}
           */
          position: 'bottom',
      
          /**
           * Defines the vertical distance to the screen edge (in px)
           * @type {number}
           */
          distance: 12,
      
          /**
           * Defines the vertical gap, existing between multiple notifications (in px)
           * @type {number}
           */
          gap: 10
      
        }
      
      },
      behaviour: {
        autoHide: 5000,
        stacking: false
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
