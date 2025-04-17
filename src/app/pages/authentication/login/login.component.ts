import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  correo: string = '';
  password: string = '';

  constructor(private authservice: AuthService, private router: Router) { }

  login(): void {
    this.authservice.login(this.correo, this.password).subscribe({
      next: () => {
        if (this.authservice.isAuth()) {
          this.router.navigate(['dashboard']); // Redirige solo si el usuario está autenticado
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
      }
    });
  }
}