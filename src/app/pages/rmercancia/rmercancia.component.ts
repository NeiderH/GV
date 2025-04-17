import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rmercancia',
  templateUrl: './rmercancia.component.html',

  styleUrl: './rmercancia.component.css',
  imports: [FormsModule, CommonModule, RouterLink],
  standalone: true
})
export default class RmercanciaComponent {
  // Variables
  mercancia: any[] = [];
  mercanciaFiltrados: any[] = [];
  nuevamercancia: any = { proveedor: '', producto: '', descripcion: '', precio: '', fecha: '', estado: '' };
  mercanciaSeleccionada: any = { _id: null, proveedor: '', producto: '', descripcion: '', precio: '', fecha: '', estado: '' };
  modalActivo: boolean = false;
  busqueda: string = '';
  tipoModal: string = '';
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
        }));
        this.mercanciaFiltrados = this.mercancia;
      },
      (error) => console.error('Error al obtener las Mercancias:', error)
    );
  }
  registrarMercancia() {
    // Validar que los campos obligatorios no estén vacíos
    if (!this.nuevamercancia.proveedor || !this.nuevamercancia.producto || !this.nuevamercancia.precio || !this.nuevamercancia.fecha) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos obligatorios antes de registrar.',
        });
        return; // Detener la ejecución si hay campos vacíos
    }
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
    this.http.put(`http://localhost:3016/api/Mercancia/UpMercancia/${this.mercanciaSeleccionada._id}`, this.mercanciaSeleccionada).subscribe(
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
  anularMercancia(mercancia: any) {
    // Mostrar un cuadro de confirmación antes de anular
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${mercancia.estado == 1 ? 'anular' : 'activar'} esta mercancía?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoEstado = mercancia.estado == 1 ? 0 : 1; // Cambiar entre 1 (activo) y 0 (anulado)

        this.http.put(`http://localhost:3016/api/Mercancia/EstadoMercancia/${mercancia._id}`, { estado: nuevoEstado }).subscribe(
          () => {
            this.obtenerMercancia(); // Actualizar la lista de mercancías
            Swal.fire('Éxito', `La mercancía ha sido ${nuevoEstado == 1 ? 'activada' : 'anulada'} correctamente`, 'success');
          },
          (error) => {
            console.error('Error al cambiar el estado de la mercancía:', error);
            Swal.fire('Error', 'No se pudo cambiar el estado de la mercancía', 'error');
          }
        );
      }
    });
  }
  abrirModal() {
    this.tipoModal = 'registrar'; // Indicar que se abrirá el modal de registro
    this.modalActivo = true;
    this.nuevamercancia = { proveedor: '', producto: '', descripcion: '', precio: '', fecha: new Date().toISOString().slice(0, 16), estado: '' };
    this.mercanciaSeleccionada = { id_merca: null };
  }
  abrirModalEdicion(mercancia: any) {
    this.tipoModal = 'editar'; // Indicar que se abrirá el modal de edición
    this.mercanciaSeleccionada = { ...mercancia };
    this.modalActivo = true;
  }
  abrirModalDetalles(mercancia: any) {
    this.tipoModal = 'detalles'; // Indicar que se abrirá el modal de detalles
    this.mercanciaSeleccionada = { ...mercancia };
    this.modalActivo = true;
  }
  habilitarCampos() {
    this.camposHabilitados = true;
  }
  cerrarModal() {
    this.tipoModal = ''; // Reiniciar el tipo de modal al cerrarlo
    this.camposHabilitados = false; // Reinicia el estado al cerrar el modal
    this.modalActivo = false;
  }
  filtrarMercancia() {
    this.mercanciaFiltrados = this.mercancia.filter(mercancia => {
      return (
        (this.busqueda === '' || mercancia.producto.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || mercancia.proveedor.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || mercancia.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (this.busqueda === '' || mercancia.fecha.toLowerCase().includes(this.busqueda.toLowerCase()))
      );
    });
  }
}
