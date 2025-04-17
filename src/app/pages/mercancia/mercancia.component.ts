import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mercancia',
  templateUrl: './mercancia.component.html',
  styleUrl: './mercancia.component.css',
  imports: [FormsModule, CommonModule, RouterLink],
  standalone: true
})
export default class MercanciaComponent {
  mercancias: any[] = [];
  modalActivo: boolean = false;
  camposHabilitados: boolean = false;
  totalPorFecha: number = 0;
  mercanciasPorFecha: any[] = [];
  fechaSeleccionada: string = '';
  tipoModal: string = '';
  filtroFecha: string = ''; // Variable para almacenar la fecha seleccionada

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerMercanciaAgrupada();
  }
  obtenerMercanciaAgrupada() {
    this.http.get('http://localhost:3016/api/Mercancia/GetMercanciaAgrupada').subscribe(
      (data: any) => {
        console.log('Datos recibidos:', data); // Verificar los datos en la consola
        this.mercanciasPorFecha = Object.entries(data).map(([fecha, grupo]: any) => ({
          fecha,
          total: grupo.total.toFixed(2), // Formatear el total
          mercancias: grupo.detalles
          
        }));
      },
      (error) => console.error('Error al obtener mercancías agrupadas:', error)
    );
  }
  filtrarPorFecha() {
    const url = this.filtroFecha
      ? `http://localhost:3016/api/Mercancia/GetMercanciaAgrupada?fecha=${this.filtroFecha}`
      : 'http://localhost:3016/api/Mercancia/GetMercanciaAgrupada';
  
    this.http.get(url).subscribe(
      (data: any) => {
        console.log('Datos filtrados:', data); // Verificar los datos en la consola
        this.mercanciasPorFecha = Object.entries(data).map(([fecha, grupo]: any) => ({
          fecha,
          total: grupo.total.toFixed(2), // Formatear el total
          mercancias: grupo.detalles
        }));
      },
      (error) => console.error('Error al filtrar mercancías por fecha:', error)
    );
  }
  abrirModalDetalles(mercanciaPorFecha: any) {
    this.tipoModal = 'detalles'; // Indicar que se abrirá el modal de detalles
    this.fechaSeleccionada = mercanciaPorFecha.fecha; // Asignar la fecha seleccionada
    this.mercancias = mercanciaPorFecha.mercancias; // Asignar las mercancías de la fecha seleccionada
    this.totalPorFecha = mercanciaPorFecha.total; // Asignar el total de la fecha seleccionada
    this.modalActivo = true;
  }
  habilitarCampos() {
    this.camposHabilitados = true;
  }
  cerrarModal() {
    this.camposHabilitados = false; // Reinicia el estado al cerrar el modal
    this.modalActivo = false;
  }
}
