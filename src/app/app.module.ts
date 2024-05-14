import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import { AppMaterialModule } from './shared/app-material/app-material.module';
import { SharedModule } from './shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps'
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerInterceptor } from './shared/interceptor/loading-spinner-interceptor.interceptor';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    AdminModule,
    HttpClientModule,
    LoginModule,
    AppMaterialModule,
    SharedModule,
    GoogleMapsModule,
    FormsModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingSpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
