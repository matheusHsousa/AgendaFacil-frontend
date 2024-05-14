import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer/customer.component';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { SettingMyCompanyComponent } from './components/setting-my-company/setting-my-company.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataCustomerComponent } from './components/data-customer/data-customer.component';
import { EditImageComponent } from './components/edit-image/edit-image.component';


@NgModule({
  declarations: [
    CustomerComponent,
    SchedulesComponent,
    SettingMyCompanyComponent,
    DataCustomerComponent,
    EditImageComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    AppMaterialModule,
    MatCardModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class CustomerModule { }
