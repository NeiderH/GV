import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export default class ProfileComponent implements OnInit {
  usuario: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.authService.user$.subscribe(nombre => {
      this.usuario.nombre = nombre; // Obtiene el nombre del usuario desde el BehaviorSubject
    });

    // Obtener otros datos del usuario desde el localStorage
    this.usuario.correo = localStorage.getItem('authEmail');
    this.usuario.permiso = localStorage.getItem('authPermission');
    this.usuario.estado = localStorage.getItem('authStatus'); // Puedes ajustar esto según tu lógica
  }
}