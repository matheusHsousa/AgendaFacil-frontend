import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { SettingMyCompanyComponent } from './components/setting-my-company/setting-my-company.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
  },
  {
    path: 'EditCustomer',
    component: SettingMyCompanyComponent,
    data: {
      name: 'Editar minha empresa',
      expectedRoles: ['CUSTOMER', 'ADMIN'],
    },
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
