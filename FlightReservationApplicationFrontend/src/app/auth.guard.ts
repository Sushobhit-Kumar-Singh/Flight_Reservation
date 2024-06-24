import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
     private router: Router     
     ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
      if (!this.authService.isAdminOrStaffOrCustomerLoggedIn()) {
        this.router.navigate(['/login']);
        return false;
      }
  
      const requiredRoles = next.data['roles'] as string; 
  
      if (requiredRoles && requiredRoles.length > 0) {
        const userRoles = this.authService.getCurrentUserRoles();
  
        if (!userRoles.some(role => requiredRoles.includes(role))) {
          this.router.navigate(['/login']);
          return false;
        }
      }
  
      return true;
    }
  }
