import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Por favor, verifica que ambas contraseñas sean iguales.',
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: '¡Tu cuenta ha sido registrada correctamente!',
        }).then(() => {
          this.router.navigate(['/login']); // Redirige al login tras registrarse
        });
      },
      error: (err) => {
        console.error('Error en el registro', err);
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema con el registro',
          text: 'Por favor, intenta nuevamente.',
        });
      }
    });
  }
}
