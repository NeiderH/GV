// filepath: /c:/Users/aprendizdp/Gest_DS/GV/src/app/business/dashboard/dashboard.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
interface Agrupacion {
  total: number;
  totalfac: number;
  totalinv: number;
  totalsini: number;
  totalventa: number;
  totaldom: number;
  totaltrans: number;
  totalotro: number;
  detalles: any[];
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export default class DashboardComponent implements OnInit {
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: true }) pieChartRef!: ElementRef<HTMLCanvasElement>;

  gananciasTotales: number = 0;
  filtro: string = 'dia';
  fechaSeleccionada: string = '';
  barChart: any; // Variable para almacenar la instancia del gráfico de barras


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerGananciasPorDia();
    this.obtenerDistribucionTipoProceso();
  }

  obtenerGananciasPorDia(fecha: string = '') {
    const params: any = {}; // No limitamos los registros individuales en la consulta
    if (fecha) {
        params.fecha = fecha;
    }

    this.http
        .get<Record<string, Agrupacion>>('http://localhost:3016/api/Factura/GetFacturaAgrupada', { params })
        .subscribe((data) => {
            // Procesar las agrupaciones por fecha
            const agrupaciones = Object.entries(data) // Convertir a un array de [fecha, datos]
                .sort((a: [string, Agrupacion], b: [string, Agrupacion]) => new Date(b[0]).getTime() - new Date(a[0]).getTime()) // Ordenar por fecha descendente
                .slice(0, 5); // Tomar las 5 agrupaciones más recientes

            const labels = agrupaciones.map(([fecha]) => fecha); // Fechas de las agrupaciones
            const ganancias = agrupaciones.map(([_, datos]) => datos.total); // Totales por fecha

            // Calcular ganancias totales
            this.gananciasTotales = ganancias.reduce((acc, curr) => acc + curr, 0);

            // Destruir el gráfico existente si ya está creado
            if (this.barChart) {
                this.barChart.destroy();
            }

            // Crear gráfico de barras
            this.barChart = new Chart(this.barChartRef.nativeElement, {
                type: 'bar',
                data: {
                    labels: labels, // Fechas agrupadas
                    datasets: [
                        {
                            label: 'Ganancias del día',
                            data: ganancias, // Totales por fecha
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                        },
                    },
                },
            });
        });
  }

  obtenerDistribucionTipoProceso(fecha: string = '') {
    this.http
      .get<any>(`http://localhost:3016/api/Factura/GetFacturaAgrupada`, {
        params: { fecha }, // Enviar la fecha como parámetro de consulta
      })
      .subscribe((data) => {
        const tipoProcesoContadores = { Venta: 0, Domicilio: 0, Transferencia: 0, Otro: 0 };

        type TipoProceso = 'Venta' | 'Domicilio' | 'Transferencia' | 'Inversion' | 'Otro'; // Define los valores posibles

        Object.values(data).forEach((grupo: any) => {
          grupo.detalles.forEach((factura: { tipo_proceso: TipoProceso }) => {
            if (factura.tipo_proceso !== 'Inversion') {
              tipoProcesoContadores[factura.tipo_proceso]++;
            }
          });
        });

        const labels = Object.keys(tipoProcesoContadores);
        const valores = Object.values(tipoProcesoContadores);

        // Crear gráfico circular excluyendo "Inversión"
        new Chart(this.pieChartRef.nativeElement, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                data: valores,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(62, 108, 214, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgb(62, 37, 204)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
            },
          },
        });
      });
  }

  filtrarGanancias() {
    // Llamar a obtenerGananciasPorDia con la fecha seleccionada
    this.obtenerGananciasPorDia(this.fechaSeleccionada);
  }
  limpiarFiltro() {
    // Limpiar la fecha seleccionada y mostrar las 5 más recientes
    this.fechaSeleccionada = '';
    this.obtenerGananciasPorDia();
  }
}
