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
  nuevafactura: any = {fecha: '', tipo_proceso:'', subtotal:'', descripcion:'', estado: '' };
  facturaSeleccionada: any = { id_factura: null, fecha: '',tipo_proceso:'', subtotal:'', descripcion:'', estado: '' };
  modalActivo: boolean = false;
  busqueda: string = '';
  estadofiltro: number = 1;
  camposHabilitados: boolean = false;
  tipoModal: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerFactura();
  }

  obtenerFactura() {
    this.http.get('http://localhost:3016/api/Factura/GetFactura').subscribe(
      (data: any) => {
        this.factura = data.map((obs: any) => ({
          ...obs,
        }));
        this.facturaFiltrados = this.factura;
      },
      (error) => console.error('Error al obtener las Facturas:', error)
    );
  }

  registrarFactura() {
    // Validar que los campos obligatorios no estén vacíos
    if (!!this.nuevafactura.fecha || !this.nuevafactura.tipo_proceso || !this.nuevafactura.subtotal || !this.nuevafactura.descripcion) {
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
  abrirModal() {
    this.tipoModal = 'registrar'; // Indicar que se abrirá el modal de registro
    this.modalActivo = true;
    this.  nuevafactura = {fecha: new Date().toISOString().slice(0, 16), tipo_proceso:'', subtotal:'', descripcion:'', estado: '' };
    this.facturaSeleccionada = { id_factura: null, observacion: '', fecha: new Date().toISOString().slice(0, 16) };
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
