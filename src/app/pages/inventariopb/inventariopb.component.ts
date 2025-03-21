import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventariopb',
  templateUrl: './inventariopb.component.html',
  styleUrl: './inventariopb.component.css',
  imports: [FormsModule, CommonModule],
  standalone: true
})
export default class InventariopbComponent {


  inventario: any[] = [];
  inventarioFiltrado: any[] = [];
  nuevainventario: any = { stock: '', cantidad: '', estado: '', id_pl: '', id_merca: '' };
  inventarioSeleccionada: any = { id_inv: null, stock: '', cantidad: '', estado: '', id_pl: '', id_merca: '' };
  modalActivo: boolean = false;
  busqueda: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerInventario();
    this.obtenerMercancia();
  }
  obtenerMercancia() {
    this.http.get('http://localhost:3016/api/Mercancia/GetMercancia').subscribe();
  }

  obtenerInventario() {
    this.http.get('http://localhost:3016/api/Inventario/GetInventario').subscribe(
      (data: any) => {
        this.inventario = data;
        this.inventarioFiltrado = data;
      },
      (error) => console.error('Error al obtener los platos:', error)
    );
}
registrarMercancia() {
    this.http.post('http://localhost:3016/api/Mercancia/RegMercancia', this.nuevainventario).subscribe(
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
abrirModal() {
  this.modalActivo = true;
  this.nuevainventario = { stock: '', cantidad: '', estado: '', id_pl: '', id_merca: '' };
  this.inventarioSeleccionada = { id_inv: null, stock: '', cantidad: '', estado: '', id_pl: '', id_merca: '' };
}

abrirModalEdicion(inventario: any) {
  this.inventarioSeleccionada = { ...inventario };
  this.modalActivo = true;
}

cerrarModal() {
  this.modalActivo = false;
}

filtrarMercancia() {
  this.inventarioFiltrado = this.inventario.filter(inventario => {
    return (
      (this.busqueda === '' || inventario.id_pl.toLowerCase().includes(this.busqueda.toLowerCase()))
    );
  });
}
}
