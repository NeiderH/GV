import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuth();
    console.log('¿Usuario autenticado?', isAuthenticated); // Verifica si el usuario está autenticado
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['login']); // Redirige al login si no está autenticado
      return false;
    }
  }
}