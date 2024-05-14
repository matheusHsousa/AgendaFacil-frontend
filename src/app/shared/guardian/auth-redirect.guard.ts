import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated && state.url.includes('/login')) {
      // Usuário autenticado tentando acessar a página de login diretamente
      this.router.navigate(['/courses']);
      return false;
    }

    return true;
  }
}
