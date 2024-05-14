import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomersRegisteredComponent } from './customers-registered/customers-registered.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [
    AdminComponent,
    CustomersRegisteredComponent,
    EditCustomerComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
    MatCardModule,
    SharedModule,
    ReactiveFormsModule,
    QRCodeModule
  ]
})
export class AdminModule { }
