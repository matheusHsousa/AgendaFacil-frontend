import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    AppMaterialModule,
    MatCardModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent
  ],
})
export class LoginModule { }
