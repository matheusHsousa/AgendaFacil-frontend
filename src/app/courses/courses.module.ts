import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogAppointmentsComponent } from './components/dialog-appointments/dialog-appointments.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CoursesComponent, DialogAppointmentsComponent],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    AppMaterialModule,
    MatCardModule,
    SharedModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    QRCodeModule
  ],
})
export class CoursesModule {}
