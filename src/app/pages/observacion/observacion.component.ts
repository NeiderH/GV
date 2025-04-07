import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-observacion',
  templateUrl: './observacion.component.html',
  styleUrl: './observacion.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export default class ObservacionComponent {

  observacion: any[] = [];
  observacionFiltrados: any[] = [];
  nuevaobservacion: any = { observaciont: '', fecha: '' };
  observacionSeleccionada: any = { id_ob: null, observaciont: '', fecha: ''};
  modalActivo: boolean = false;
  busqueda: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerObservacion();
  }

  obtenerObservacion() {
    this.http.get('http://localhost:3016/api/Observacion/GetObservacion').subscribe(
      (data: any) => {
        this.observacion = data.map((obs: any) => ({
          ...obs,
        }));
        this.observacionFiltrados = this.observacion; // Los datos ya están ordenados desde el backend
      },
      (error) => console.error('Error al obtener las Observaciones:', error)
    );
}

  registrarObservacion() {
    this.http.post('http://localhost:3016/api/Observacion/RegObservacion', this.nuevaobservacion).subscribe(
      () => {
        this.obtenerObservacion();
        this.cerrarModal();
        Swal.fire('Éxito', 'Observacion registrada correctamente', 'success');
      },
      (error) => {
        console.error('Error al registrar la Observacion:', error);
        Swal.fire('Error', 'Error al registrar la Observacion', 'error');
      }
    );
  }

  editarObservacion() {
    this.http.put(`http://localhost:3016/api/Observacion/UpObservacion/${this.observacionSeleccionada.id_ob}`, this.observacionSeleccionada).subscribe(
      () => {
        this.obtenerObservacion();
        this.cerrarModal();
        Swal.fire('Éxito', 'Observacion actualizada correctamente', 'success');
      },
      (error) => {
        console.error('Error al actualizar la Observacion:', error);
        Swal.fire('Error', 'Error al actualizar la Observacion', 'error');
      }
    );
  }

  eliminarObservacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3016/api/Observacion/DelObservacion/${id}`).subscribe(
          () => {
            this.obtenerObservacion();
            Swal.fire('Eliminado', 'La Observacion ha sido eliminada', 'success');
          },
          (error) => {
            console.error('Error al eliminar la Observacion:', error);
            Swal.fire('Error', 'Error al eliminar la Observacion', 'error');
          }
        );
      }
    });
  }

  abrirModal() {
    this.modalActivo = true;
    this.nuevaobservacion = { observacion: '', fecha: '' }; 
    this.observacionSeleccionada = { id_ob: null, observacion: '', fecha: new Date().toISOString().slice(0, 16) }; 
  }

  abrirModalEdicion(observacion: any) {
    this.observacionSeleccionada = { ...observacion };
    this.modalActivo = true;
  }

  cerrarModal() {
    this.modalActivo = false;
  }
  
  filtrarObservacion() {
    this.observacionFiltrados = this.observacion.filter(observacion => {
      return (
        (this.busqueda === '' || observacion.observaciont.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || observacion.fecha.toLowerCase().includes(this.busqueda.toLowerCase()))
      );
    });
  }
}