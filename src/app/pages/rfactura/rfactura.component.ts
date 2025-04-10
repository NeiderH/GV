import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import moment from 'moment-timezone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rfactura',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './rfactura.component.html',
  styleUrl: './rfactura.component.css'
})
export default class RfacturaComponent {
  factura: any[] = [];
  facturaFiltrados: any[] = [];
  nuevafactura: any = { fecha: '', tipo_proceso: '', subtotal: '', descripcion: '', estado: '' };
  facturaSeleccionada: any = { id_factura: null, fecha: '', tipo_proceso: '', subtotal: '', descripcion: '', estado: '' };
  modalActivo: boolean = false;
  filtroTipoProceso: string = '';
  filtroEstado: string = '';
  filtroFecha: string = '';
  busqueda: string = '';
  estadofiltro: number = 1;
  camposHabilitados: boolean = false;
  tipoModal: string = '';
  tipoProceso: string = '';
  subtotal: number = 0;
  labelSubtotal: string = 'Subtotal';


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerFactura();
  }

  obtenerFactura() {
    const tipoProcesoFinal = this.tipoProceso;
    console.log('Tipo de Proceso:', tipoProcesoFinal);
    console.log('Subtotal:', this.subtotal);

    this.http.get('http://localhost:3016/api/Factura/GetFactura').subscribe(
      (data: any) => {
        this.factura = data;
        this.facturaFiltrados = this.factura;
      },
      (error) => console.error('Error al obtener las Facturas:', error)
    );
  }
  aplicarFiltros() {
    this.facturaFiltrados = this.factura.filter((factura) => {
      const coincideDescripcion = this.busqueda
        ? factura.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())
        : true;
      const coincideTipoProceso = this.filtroTipoProceso
        ? factura.tipo_proceso === this.filtroTipoProceso
        : true;
      const coincideEstado = this.filtroEstado
        ? factura.estado.toString() === this.filtroEstado
        : true;
      const coincideFecha = this.filtroFecha
        ? factura.fecha.startsWith(this.filtroFecha)
        : true;

      return coincideDescripcion && coincideTipoProceso && coincideEstado && coincideFecha;
    });
  }
  onTipoProcesoChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.nuevafactura.tipo_proceso = selectedValue; // Actualizar el valor en nuevafactura

    if (selectedValue === 'Inversion') {
      this.labelSubtotal = 'Monto de la inversión';
    } else {
      this.labelSubtotal = 'Subtotal';
    }
  }
  registrarFactura() {
    // Validar que los campos obligatorios no estén vacíos
    if (!this.nuevafactura.fecha ||
      !this.nuevafactura.tipo_proceso ||
      !this.nuevafactura.subtotal) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios antes de registrar.',
      });
      return; // Detener la ejecución si hay campos vacíos
    }

    this.http.post('http://localhost:3016/api/Factura/RegFactura', this.nuevafactura).subscribe(
      () => {
        this.obtenerFactura();
        this.cerrarModal();
        Swal.fire('Éxito', 'Factura registrada correctamente', 'success');
      },
      (error) => {
        console.error('Error al registrar la Factura:', error);
        Swal.fire('Error', 'Error al registrar la Factura', 'error');
      }
    );
  }
  editarFactura() {
    this.http.put(`http://localhost:3016/api/Factura/UpFactura/${this.facturaSeleccionada.id_factura}`, this.facturaSeleccionada).subscribe(
      () => {
        this.obtenerFactura();
        this.cerrarModal();
        Swal.fire('Éxito', 'Mercancia actualizada correctamente', 'success');
      },
      (error) => {
        console.error('Error al actualizar la Mercancia:', error);
        Swal.fire('Error', 'Error al actualizar la Mercancia', 'error');
      }
    );
  }
  anularFactura(factura: any) {
    // Mostrar un cuadro de confirmación antes de anular
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${factura.estado == 1 ? 'anular' : 'activar'} esta factura?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoEstado = factura.estado == 1 ? 0 : 1; // Cambiar entre 1 (activo) y 0 (anulado)

        this.http.put(`http://localhost:3016/api/Factura/EstadoFactura/${factura.id_factura}`, { estado: nuevoEstado }).subscribe(
          () => {
            this.obtenerFactura(); // Actualizar la lista de mercancías
            Swal.fire('Éxito', `La factura ha sido ${nuevoEstado == 1 ? 'activada' : 'anulada'} correctamente`, 'success');
          },
          (error) => {
            console.error('Error al cambiar el estado de la factura:', error);
            Swal.fire('Error', 'No se pudo cambiar el estado de la factura', 'error');
          }
        );
      }
    });
  }
  abrirModal() {
    this.tipoModal = 'registrar'; // Indicar que se abrirá el modal de registro
    const fechaActual = new Date();
    this.modalActivo = true;
    this.nuevafactura = {
      fecha: fechaActual.toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
      tipo_proceso: '',
      subtotal: '',
      descripcion: '',
      estado: ''
    };
    this.facturaSeleccionada = {
      id_factura: null,
      observacion: '',
      fecha: fechaActual.toISOString().slice(0, 10)
    };
  }
  getFechaMaxima(): string {
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + 0); // Sumar 3 días a la fecha actual
    return fechaActual.toISOString().slice(0, 10); // Retornar en formato YYYY-MM-DD
  }
  habilitarCampos() {
    this.camposHabilitados = true;
  }
  abrirModalEdicion(factura: any) {
    this.tipoModal = 'editar'; // Indicar que se abrirá el modal de edición
    this.facturaSeleccionada = { ...factura };
    this.modalActivo = true;
  }
  cerrarModal() {
    this.camposHabilitados = false; // Reinicia el estado al cerrar el modal
    this.modalActivo = false;
  }
}
