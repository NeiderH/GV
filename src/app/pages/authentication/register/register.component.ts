import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {
  nombre: string = '';
  correo: string = '';
  password: string = '';
  confirmarPassword: string = ''; // Para validar la contraseña
  estado: boolean = true;
  permiso: string = 'empleado';

  constructor(private authservice: AuthService, private router: Router) {}

  register(): void {
    if (this.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    const userData = {
      nombre: this.nombre,
      correo: this.correo,
      password: this.password, // Solo enviamos esta contraseña
      estado: this.estado,
      permiso: this.permiso
    };
  
    this.authservice.register(userData).subscribe({
      next: () => {
        alert('Registro exitoso');
        this.router.navigate(['/login']); // Redirige al login tras registrarse
      },
      error: (err) => {
        console.error('Error en el registro', err);
        alert('Hubo un problema con el registro');
      }
    });
  }  
}
