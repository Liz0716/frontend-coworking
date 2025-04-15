import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { MegaMenu } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MegaMenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { ApiService } from '../../shared/services/Api.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, CommonModule, AvatarModule, CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  datos: any = {};
  ingresosData: any;
  ingresosOptions: any;

  reservasData: any;
  reservasOptions: any;

  registrosData: any;
  registrosOptions: any;


  platformId = inject(PLATFORM_ID);



  constructor(private api: ApiService) {


  }



  ngOnInit() {
    this.cargarDatosDashboard();
    this.cargarIngresos();
    this.cargarReservasPorMes();
    this.cargarRegistrosPorMes();
  }

  cargarDatosDashboard() {
    this.api.getItems('dashboard/datos').subscribe({
      next: (data: any) => this.datos = data,
      error: () => console.error('Error al cargar datos del dashboard')
    });
  }

  cargarIngresos() {
    const coloresPorMes: { [key: string]: string } = {
      '01': 'rgba(188, 236, 170)',
      '02': 'rgba(184, 240, 251)',
      '03': 'rgba(245, 200, 172)',
      '04': 'rgba(176, 234, 192)',
      '05': 'rgba(248, 251, 184)',
      '06': 'rgba(238, 172, 245)',
      '07': 'rgba(184, 172, 245)',
      '08': 'rgba(154, 236, 199)',
      '09': 'rgba(154, 190, 236)',
      '10': 'rgba(208, 236, 154)',
      '11': 'rgba(236, 216, 154)',
      '12': 'rgba(236, 179, 154)'
    };

    this.api.getItems('dashboard/ingresos').subscribe({
      next: (data) => {
        const labels = data.map(d => this.obtenerNombreMes(d.mes));
        const valores = data.map((item: any) => item.total);

        const backgroundColors = data.map((d: any) => {
          const mes = d.mes.split('-')[1];
          return coloresPorMes[mes] || 'rgba(0,0,0,0.2)';
        });

        const borderColors = backgroundColors.map(c => c.replace('0.5', '1'));

        this.ingresosData = {
          labels,
          datasets: [
            {
              label: 'Ingresos por mes',
              data: valores,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        };
        this.ingresosOptions = this.getChartOptions('Ingresos por mes');
      },
      error: (err) => console.error('Error al obtener ingresos:', err)
    });
  }

  cargarReservasPorMes() {
    const coloresPorMes: { [key: string]: string } = {
      '01': 'rgba(188, 236, 170)',
      '02': 'rgba(184, 240, 251)',
      '03': 'rgba(245, 200, 172)',
      '04': 'rgba(176, 234, 192)',
      '05': 'rgba(248, 251, 184)',
      '06': 'rgba(238, 172, 245)',
      '07': 'rgba(184, 172, 245)',
      '08': 'rgba(154, 236, 199)',
      '09': 'rgba(154, 190, 236)',
      '10': 'rgba(208, 236, 154)',
      '11': 'rgba(236, 216, 154)',
      '12': 'rgba(236, 179, 154)'
    };

    this.api.getItems('dashboard/reservasMes').subscribe({
      next: (data) => {
        const labels = data.map(d => this.obtenerNombreMes(d.mes));
        const valores = data.map((item: any) => item.total);

        const backgroundColors = data.map((d: any) => {
          const mes = d.mes.split('-')[1];
          return coloresPorMes[mes] || 'rgba(0,0,0,0.2)';
        });

        const borderColors = backgroundColors.map(c => c.replace('0.5', '1'));

        this.reservasData = {
          labels,
          datasets: [{
            label: 'Reservas por mes',
            data: valores,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          }]
        };

        this.reservasOptions = this.getChartOptions('Reservas por mes');
      },
      error: (err) => console.error('Error al obtener reservas:', err)
    });
  }

  cargarRegistrosPorMes() {
    const coloresPorMes: { [key: string]: string } = {
      '01': 'rgba(188, 236, 170)',
      '02': 'rgba(184, 240, 251)',
      '03': 'rgba(245, 200, 172)',
      '04': 'rgba(176, 234, 192)',
      '05': 'rgba(248, 251, 184)',
      '06': 'rgba(238, 172, 245)',
      '07': 'rgba(184, 172, 245)',
      '08': 'rgba(154, 236, 199)',
      '09': 'rgba(154, 190, 236)',
      '10': 'rgba(208, 236, 154)',
      '11': 'rgba(236, 216, 154)',
      '12': 'rgba(236, 179, 154)'
    };

    this.api.getItems('dashboard/registrosMes').subscribe({
      next: (data) => {
        const labels = data.map(d => this.obtenerNombreMes(d.mes));
        const valores = data.map((item: any) => item.total);

        const backgroundColors = data.map((d: any) => {
          const mes = d.mes.split('-')[1];
          return coloresPorMes[mes] || 'rgba(0,0,0,0.2)';
        });

        const borderColors = backgroundColors.map(c => c.replace('0.5', '1'));


        this.registrosData = {
          labels,
          datasets: [{
            label: 'Usuarios registrados por mes',
            data: valores,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,

          }]
        };

        this.registrosOptions = this.getChartOptions('Usuarios registrados por mes');
      },
      error: (err) => console.error('Error al obtener registros:', err)
    });
  }


  obtenerNombreMes(yyyyMm: string): string {
    const [year, month] = yyyyMm.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(date);
  }

  getChartOptions(titulo: string) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
      plugins: {
        title: {
          display: true,
          text: titulo,
          color: textColor,
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            display: false
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            display: false
          },
          grid: {
            display: false
          }
        }
      }
    };
  }

}
