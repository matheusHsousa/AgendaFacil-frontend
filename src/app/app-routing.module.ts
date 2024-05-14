import { NgModule } from '@angular/core';
import { RouterModule, Routes, Data } from '@angular/router';
import { AuthGuard } from './shared/guardian/auth.guard';
import { AuthRedirectGuard } from './shared/guardian/auth-redirect.guard';
import { CustomRoute } from './shared/types/custom-route.service';

const routes: Routes = [
  {
    path: 'courses',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['ADMIN', 'USER', 'CUSTOMER'],
      name: 'Estabelecimento',
    },
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['ADMIN'],
      name: 'Administrador',
    } as CustomRoute,
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'customer',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['CUSTOMER', 'ADMIN'],
      name: 'Minha Empresa',
    } as CustomRoute,
    loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule),
  },
  {
    path: 'login',
    canActivate: [AuthRedirectGuard],
    data: {
      expectedRoles: ['ADMIN'],
      name: 'Login',
    },
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '', pathMatch: 'full', redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
