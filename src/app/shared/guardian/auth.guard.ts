import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { CustomRoute } from '../types/custom-route.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  userRole = '';
  
  constructor(private authService: AuthService, private router: Router) {}

  
  getUserRole(): string {
    return this.userRole; 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = (route.data as CustomRoute)?.['expectedRoles'] || [];
    const userRole = this.authService.getUserRole();
  
    if (this.authService.isAuthenticated() && expectedRoles.includes(userRole)) {
      return true;
    }
  
    this.router.navigate(['/login']);
    return false;
  }
  
  
  
}


