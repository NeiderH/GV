import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-platosyb',
  templateUrl: './platosyb.component.html',
  styleUrls: ['./platosyb.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PlatosybComponent implements OnInit {
  platos: any[] = [];
  platosFiltrados: any[] = [];
  nuevoPlato: any = { nom_plato: '', valor: null, categoria: '' };
  platoSeleccionado: any = { id_pl: null, nom_plato: '', valor: null, categoria: '' };
  modalActivo: boolean = false;
  busqueda: string = '';
  categoriaSeleccionada: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerPlatos();
  }

  obtenerPlatos() {
    this.http.get('http://localhost:3016/api/Plato/GetPlato').subscribe(
      (data: any) => {
        this.platos = data;
        this.platosFiltrados = data;
      },
      (error) => console.error('Error al obtener los platos:', error)
    );
  }

  registrarPlato() {
    this.http.post('http://localhost:3016/api/Plato/RegPlato', this.nuevoPlato).subscribe(
      () => {
        this.obtenerPlatos();
        this.cerrarModal();
        Swal.fire('Éxito', 'Plato registrado correctamente', 'success');
      },
      (error) => {
        console.error('Error al registrar el plato:', error);
        Swal.fire('Error', 'Error al registrar el plato', 'error');
      }
    );
  }

  editarPlato() {
    this.http.put(`http://localhost:3016/api/Plato/UpPlato/${this.platoSeleccionado.id_pl}`, this.platoSeleccionado).subscribe(
      () => {
        this.obtenerPlatos();
        this.cerrarModal();
        Swal.fire('Éxito', 'Plato actualizado correctamente', 'success');
      },
      (error) => {
        console.error('Error al actualizar el plato:', error);
        Swal.fire('Error', 'Error al actualizar el plato', 'error');
      }
    );
  }

  eliminarPlato(id: number) {
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
        this.http.delete(`http://localhost:3016/api/Plato/DelPlato/${id}`).subscribe(
          () => {
            this.obtenerPlatos();
            Swal.fire('Eliminado', 'El plato ha sido eliminado', 'success');
          },
          (error) => {
            console.error('Error al eliminar el plato:', error);
            Swal.fire('Error', 'Error al eliminar el plato', 'error');
          }
        );
      }
    });
  }

  abrirModal() {
    this.modalActivo = true;
    this.nuevoPlato = { nom_plato: '', valor: null, categoria: '' };
    this.platoSeleccionado = { id_pl: null, nom_plato: '', valor: null, categoria: '' }; // Reiniciar platoSeleccionado
  }

  abrirModalEdicion(plato: any) {
    this.platoSeleccionado = { ...plato };
    this.modalActivo = true;
  }

  cerrarModal() {
    this.modalActivo = false;
  }
  
  filtrarPlatos() {
    this.platosFiltrados = this.platos.filter(plato => {
      return (
        (this.busqueda === '' || plato.nom_plato.toLowerCase().includes(this.busqueda.toLowerCase())) &&
        (this.categoriaSeleccionada === '' || plato.categoria === this.categoriaSeleccionada)
      );
    });
  }
}