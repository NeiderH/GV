import { Component } from '@angular/core';

@Component({
  selector: 'app-rfactura',
  imports: [],
  templateUrl: './rfactura.component.html',
  styleUrl: './rfactura.component.css'
})
export default class RfacturaComponent {
  facturas = [
    { id: 1, columna1: 'Dato 1', columna2: 'Dato 2', columna3: 'Dato 3', columna4: 'Dato 4', columna5: 'Dato 5', estado: 'Activo' },
    // Añade más facturas según sea necesario
  ];

  crearFactura() {
    // Lógica para crear una nueva factura
  }

  anularFactura(id: number) {
    // Lógica para anular una factura
  }
}
