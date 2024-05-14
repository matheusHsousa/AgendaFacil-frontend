import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  exports: [
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSlideToggleModule,
    MatPaginatorModule
    
  ],
})
export class AppMaterialModule {}
