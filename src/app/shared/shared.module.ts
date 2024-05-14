import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { CategoryPipe } from './pipes/category.pipe';
import { DialogDetailsComponent } from './components/dialog-details/dialog-details.component';
import { MapComponent } from './components/map/map.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { NgxStarsModule } from 'ngx-stars';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ErrorDialogComponent,
    CategoryPipe,
    DialogDetailsComponent,
    MapComponent,
    ConfirmDialogComponent,
    GoogleMapsComponent,
    
    
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    NgxStarsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ErrorDialogComponent,
    CategoryPipe,
  ]

})
export class SharedModule { }
