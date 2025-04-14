import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css',
  imports: [FormsModule, CommonModule, RouterLink],
  standalone: true
})
export default class FacturaComponent {
  facturas: any[] = [];
  modalActivo: boolean = false;
  camposHabilitados: boolean = false;
  totalPorFecha: number = 0;
  totalinversion: number = 0;
  totalsi: number = 0;
  totalven: number = 0;
  totaldomicilio: number = 0;
  totaltransferencia: number = 0;
  totalot: number = 0;
  facturasPorFecha: any[] = [];
  fechaSeleccionada: string = '';
  tipoModal: string = '';
  filtroFecha: string = '';
  totalFacturado: number = 0;
  observacion: any[] = [];
  observacionFiltrados: any[] = [];

  // contadores
  totalCVentas: number = 0;
  totalCDomicilios: number = 0;
  totalCTransferencias: number = 0;
  totalCOtros: number = 0;

  mostrarTablaFacturas: boolean = true; // Controla qué tabla se muestra

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerFacturaAgrupada();
    // Si no tienes una fecha inicial, puedes pasar una cadena vacía o una fecha predeterminada
    this.MostrarListaObservaciones(''); // O usa una fecha predeterminada
  }
  obtenerFacturaAgrupada() {
    this.http.get('http://localhost:3016/api/Factura/GetFacturaAgrupada').subscribe(
      (data: any) => {
        console.log('Datos recibidos:', data); // Verificar los datos en la consola
        this.facturasPorFecha = Object.entries(data).map(([fecha, grupo]: any) => ({
          fecha,
          total: parseInt(grupo.total).toLocaleString('es-ES'), // Formatear el total con punto de miles
          totalsini: parseInt(grupo.totalsini).toLocaleString('es-ES'), // Formatear el total sin inversiones
          totalinv: parseInt(grupo.totalinv).toLocaleString('es-ES'), // Formatear el total de inversiones
          totalventa: parseInt(grupo.totalventa).toLocaleString('es-ES'), // Formatear el total de ventas
          totaldom: parseInt(grupo.totaldom).toLocaleString('es-ES'), // Formatear el total de domicilios
          totaltrans: parseInt(grupo.totaltrans).toLocaleString('es-ES'), // Formatear el total de transferencias
          totalotro: parseInt(grupo.totalotro).toLocaleString('es-ES'), // Formatear el total de otros
          totalfac: parseInt(grupo.totalfac).toLocaleString('es-ES'), // Formatear el total facturado
          facturas: grupo.detalles
        }));
      },
      (error) => console.error('Error al obtener mercancías agrupadas:', error)
    );
  }
  filtrarPorFecha() {
    const url = this.filtroFecha
      ? `http://localhost:3016/api/Factura/GetFacturaAgrupada?fecha=${this.filtroFecha}`
      : 'http://localhost:3016/api/Factura/GetFacturaAgrupada';

    this.http.get(url).subscribe(
      (data: any) => {
        console.log('Datos filtrados:', data); // Verificar los datos en la consola
        this.facturasPorFecha = Object.entries(data).map(([fecha, grupo]: any) => ({
          fecha,
          total: grupo.total, // Formatear el total
          totalsini: grupo.totalsini, // Formatear el total sin inversiones
          totalinv: grupo.totalinv, // Formatear el total de inversiones
          totalventa: grupo.totalventa, // Formatear el total de ventas
          totaldom: grupo.totaldom, // Formatear el total de domicilios
          totaltrans: grupo.totaltrans, // Formatear el total de transferencias
          totalotro: grupo.totalotro, // Formatear el total de otros
          totalfac: grupo.totalfac, // Formatear el total facturado
          facturas: grupo.detalles
        }));
      },
      (error) => console.error('Error al filtrar mercancías por fecha:', error)
    );
  }
  abrirModalDetalles(facturasPorFecha: any) {
    this.tipoModal = 'detalles';
    this.fechaSeleccionada = facturasPorFecha.fecha;
    this.facturas = facturasPorFecha.facturas;
    this.totalPorFecha = facturasPorFecha.total;
    this.totalinversion = facturasPorFecha.totalinv;
    this.totalsi = facturasPorFecha.totalsini;
    this.totalven = facturasPorFecha.totalventa;
    this.totaldomicilio = facturasPorFecha.totaldom;
    this.totaltransferencia = facturasPorFecha.totaltrans;
    this.totalot = facturasPorFecha.totalotro;
    this.totalFacturado = facturasPorFecha.totalfac;
  
    this.totalCVentas = 0;
    this.totalCDomicilios = 0;
    this.totalCTransferencias = 0;
    this.totalCOtros = 0;
    this.facturas.forEach((factura: any) => {
      switch (factura.tipo_proceso) {
        case 'Venta':
          this.totalCVentas++;
          break;
        case 'Domicilio':
          this.totalCDomicilios++;
          break;
        case 'Transferencia':
          this.totalCTransferencias++;
          break;
        case 'Otro':
          this.totalCOtros++;
          break;
      }
    });
  
    // Llama al método con la fecha seleccionada
    this.MostrarListaObservaciones(this.fechaSeleccionada);
    this.modalActivo = true;
  }
  habilitarCampos() {
    this.camposHabilitados = true;
  }
  cerrarModal() {
    this.camposHabilitados = false; // Reinicia el estado al cerrar el modal
    this.modalActivo = false;
  }
  alternarTablas() {
    this.mostrarTablaFacturas = !this.mostrarTablaFacturas;
  }
  generarPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4'); // Crear un documento PDF en formato A4
    const marginLeft = 10;
    let y = 10; // Posición inicial en el eje Y

    // Estilo general
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(29, 58, 108); // Color azul similar al usado en el HTML

    // Título principal
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(29, 58, 108); // Azul para el título
    pdf.setFontSize(16);
    pdf.text('Informe del Total de las Facturas', marginLeft, y);
    y += 10;

    // Fecha seleccionada
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0); // Negro
    pdf.text(`Fecha: ${this.fechaSeleccionada}`, marginLeft, y);
    y += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(29, 58, 108); // Azul para el título
    pdf.setFontSize(10);
    pdf.text('Registro de las Facturas', marginLeft, y);
    y += 5;
    // Tabla de facturas con formato de celdas
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(29, 58, 108); // Fondo azul para el encabezado
    pdf.setTextColor(255, 255, 255); // Texto blanco
    pdf.rect(marginLeft, y, 190, 7, 'F'); // Dibujar el fondo del encabezado
    pdf.text('Tipo de Proceso', marginLeft + 2, y + 5);
    pdf.text('Subtotal', marginLeft + 50, y + 5);
    pdf.text('Descripción', marginLeft + 90, y + 5);
    pdf.text('Estado', marginLeft + 150, y + 5);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0); // Negro para las filas
    this.facturas.forEach((factura) => {
      if (y > 280) { // Si se alcanza el final de la página, agregar una nueva
        pdf.addPage();
        y = 10;

        // Repetir encabezado en la nueva página
        pdf.setFont('helvetica', 'bold');
        pdf.setFillColor(29, 58, 108);
        pdf.setTextColor(255, 255, 255);
        pdf.rect(marginLeft, y, 190, 7, 'F');
        pdf.text('Tipo de Proceso', marginLeft + 2, y + 5);
        pdf.text('Subtotal', marginLeft + 50, y + 5);
        pdf.text('Descripción', marginLeft + 90, y + 5);
        pdf.text('Estado', marginLeft + 150, y + 5);
        y += 7;
      }

      // Dibujar celdas para cada fila
      pdf.setDrawColor(200, 200, 200); // Color gris para las líneas de las celdas
      pdf.rect(marginLeft, y, 190, 7); // Dibujar la fila completa
      pdf.text(factura.tipo_proceso, marginLeft + 2, y + 5);
      pdf.text(`$${factura.subtotal}`, marginLeft + 50, y + 5);
      pdf.text((factura.descripcion && factura.descripcion.length > 30 ? factura.descripcion.slice(0, 30) + '...' : factura.descripcion) || '"sin descripcion"', marginLeft + 90, y + 5);
      pdf.text(
        factura.estado === 0 ? 'Anulado' : (factura.estado === 1 ? 'Activo' : 'N/A'),
        marginLeft + 150,
        y + 5
      );
      y += 7;
    });

    // Espacio después de la tabla
    y += 10;

    // Totales con títulos para cada columna
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(29, 58, 108); // Azul para los títulos
    pdf.text('Totales:', marginLeft, y);
    y += 5;

    // Configuración de columnas
    const col1X = marginLeft; // Primera columna
    const col2X = marginLeft + 70; // Segunda columna
    const col3X = marginLeft + 140; // Tercera columna

    // Títulos de las columnas
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(29, 58, 108);
    pdf.text('General', col1X, y);
    pdf.text('Por Proceso', col2X, y);
    pdf.text('Contadores', col3X, y);
    y += 5;

    // Datos de las columnas
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0); // Negro para los valores

    // Primera fila
    pdf.text(`Total Facturado: $${this.totalFacturado}`, col1X, y);
    pdf.text(`Total Venta: $${this.totalven}`, col2X, y);
    pdf.text(`# de Ventas: ${this.totalCVentas}`, col3X, y);
    y += 5;

    // Segunda fila
    pdf.text(`Total Inversion: $${this.totalinversion}`, col1X, y);
    pdf.text(`Total Domicilio: $${this.totaldomicilio}`, col2X, y);
    pdf.text(`# de Domicilios: ${this.totalCDomicilios}`, col3X, y);
    y += 5;

    // Tercera fila
    pdf.text(`Total Ganancias: $${this.totalPorFecha}`, col1X, y);
    pdf.text(`Total Transferencia: $${this.totaltransferencia}`, col2X, y);
    pdf.text(`# de Transferencias: ${this.totalCTransferencias}`, col3X, y);
    y += 5;

    // Cuarta fila
    pdf.text('', col1X, y); // Espacio vacío si no hay más datos en la primera columna
    pdf.text(`Total Otro: $${this.totalot}`, col2X, y);
    pdf.text(`# de Otro: ${this.totalCOtros}`, col3X, y);
    y += 10; // Espacio adicional después de las filas

    // Guardar el PDF
    pdf.save(`Factura_${this.fechaSeleccionada}.pdf`);
  }
  MostrarListaObservaciones(fecha: string) {
    if (!fecha) {
      console.warn('No se proporcionó una fecha válida para MostrarListaObservaciones.');
      this.observacionFiltrados = [{ observaciont: 'No hay observaciones registradas para esta fecha', fecha: '' }];
      return;
    }
  
    this.http.get('http://localhost:3016/api/Observacion/GetObservacion').subscribe(
      (data: any) => {
        const observaciones = data.map((obs: any) => ({
          ...obs,
          fecha: obs.fecha.split('T')[0] // Asegúrate de comparar solo la fecha (sin la hora)
        }));
        this.observacionFiltrados = observaciones.filter((obs: any) => obs.fecha === fecha);
  
        if (this.observacionFiltrados.length === 0) {
          this.observacionFiltrados = [{ observaciont: 'No hay observaciones registradas para esta fecha', fecha: '' }];
        }
      },
      (error) => console.error('Error al obtener las Observaciones:', error)
    );
  }
}
