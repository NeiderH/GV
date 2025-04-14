import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit {
  usuario: any = {}; // Almacena los datos del usuario

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarioLogueado();
  }

  obtenerUsuarioLogueado() {
    const userId = localStorage.getItem('userId'); // Asegúrate de que el nombre de la clave sea correcto
    console.log('ID del usuario obtenido del localStorage:', userId); // Verifica el ID
  
    if (!userId) {
      console.error('No se encontró el ID del usuario en localStorage');
      return;
    }
  
    this.http.put('http://localhost:3016/api/Usuario/VerUsuario', { id: userId }).subscribe({
      next: (data) => {
        console.log('Datos del usuario obtenidos del servidor:', data); // Verifica los datos
        this.usuario = data; // Asigna los datos del usuario a la variable
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
      }
    });
  }
}