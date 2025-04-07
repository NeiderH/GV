import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-factura',
  imports: [RouterLink],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export default class FacturaComponent {

  ngOnInit() {
    this.obtenerFactura();
  }

  obtenerFactura(){

  }
  //mas funciones...
  
}
