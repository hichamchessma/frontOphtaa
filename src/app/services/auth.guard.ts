import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    // If the user is already authenticated and tries to access the login page, redirect them
    if (isAuthenticated && (state.url === '/login'
      ||state.url === '/register'
      ||state.url === '/forgot-password'
      ||state.url === '/reset-password')) {
      this.router.navigate(['/dashboard']); // Redirect to the dashboard or another page
      return false;
    }

    // If the user is not authenticated and tries to access a protected route, redirect to login
    if (!isAuthenticated && state.url !== '/login'
      && state.url !== '/register'
      && state.url !== '/forgot-password'
      && state.url !== '/reset-password') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}