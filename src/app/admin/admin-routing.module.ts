import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CustomersRegisteredComponent } from './customers-registered/customers-registered.component';
import { AuthGuard } from '../shared/guardian/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'cadastrados',
    canActivate: [AuthGuard],
    component: CustomersRegisteredComponent,
    data: {
      name: 'Empresas',
      expectedRoles: ['ADMIN'],
    },
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
