import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rmercancia',
  templateUrl: './rmercancia.component.html',
  styleUrl: './rmercancia.component.css',
  imports: [FormsModule, CommonModule],
  standalone: true
})
export default class RmercanciaComponent {
  mercancia: any[] = [];
  mercanciaFiltrados: any[] = [];
  nuevamercancia: any = { proveedor: '', producto: '', descripcion: '', precio: '', fecha: '', estado: '', cantidad: '', id_inv: '' };
  mercanciaSeleccionada: any = { id_merca: null, proveedor: '', producto: '', descripcion: '', precio: '', fecha: '', estado: '', cantidad: '', id_inv: '' };
  modalActivo: boolean = false;
  busqueda: string = '';
  camposHabilitados: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerMercancia();
  }

  obtenerMercancia() {
    this.http.get('http://localhost:3016/api/Mercancia/GetMercancia').subscribe(
      (data: any) => {
        this.mercancia = data.map((obs: any) => ({
          ...obs,
          fecha: new Date(obs.fecha).toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
        }));
        this.mercanciaFiltrados = this.mercancia; // Los datos ya están ordenados desde el backend
      },
      (error) => console.error('Error al obtener las Mercancias:', error)
    );
  }

  registrarMercancia() {
    this.http.post('http://localhost:3016/api/Mercancia/RegMercancia', this.nuevamercancia).subscribe(
      () => {
        this.obtenerMercancia();
        this.cerrarModal();
        Swal.fire('Éxito', 'Mercancia registrada correctamente', 'success');
      },
      (error) => {
        console.error('Error al registrar la Mercancia:', error);
        Swal.fire('Error', 'Error al registrar la Mercancia', 'error');
      }
    );
  }
  editarMercancia() {
    this.http.put(`http://localhost:3016/api/Mercancia/UpMercancia/${this.mercanciaSeleccionada.id_merca}`, this.mercanciaSeleccionada).subscribe(
      () => {
        this.obtenerMercancia();
        this.cerrarModal();
        Swal.fire('Éxito', 'Mercancia actualizada correctamente', 'success');
      },
      (error) => {
        console.error('Error al actualizar la Mercancia:', error);
        Swal.fire('Error', 'Error al actualizar la Mercancia', 'error');
      }
    );
  }
  anularMercancia() {
    this.http.delete(`http://localhost:3016/api/Mercancia/EstadoMercancia/${this.mercanciaSeleccionada.id_merca}`).subscribe(
      () => {
        this.obtenerMercancia();
        this.cerrarModal();
        Swal.fire('Éxito', 'Mercancia anulada correctamente', 'success');
      },
      (error) => {
        console.error('Error al anular la Mercancia:', error);
        Swal.fire('Error', 'Error al anular la Mercancia', 'error');
      }
    );
  }

  abrirModal() {
    this.modalActivo = true;
    this.nuevamercancia = { proveedor: '', producto: '', descripcion: '', precio: '', fecha: new Date().toISOString().slice(0, 16), estado: '', cantidad: '', id_inv: '' };
    this.mercanciaSeleccionada = { id_ob: null, observacion: '', fecha: new Date().toISOString().slice(0, 16) };
  }
  habilitarCampos() {
    this.camposHabilitados = true;
  }
  abrirModalEdicion(mercancia: any) {
    this.mercanciaSeleccionada = { ...mercancia };
    this.modalActivo = true;
  }

  cerrarModal() {
    this.camposHabilitados = false; // Reinicia el estado al cerrar el modal
    this.modalActivo = false;
  }

  filtrarMercancia() {
    this.mercanciaFiltrados = this.mercancia.filter(mercancia => {
      return (
        (this.busqueda === '' || mercancia.producto.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || mercancia.proveedor.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || mercancia.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || mercancia.estado.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || mercancia.fecha.toLowerCase().includes(this.busqueda.toLowerCase()))
      );
    });
  }
}
