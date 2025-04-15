import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/Api.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Reservas } from '../../../shared/interface/reservas.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ver',
  imports: [CardModule, ButtonModule, CommonModule,RouterOutlet],
  providers: [MessageService],
  templateUrl: './ver.component.html',
  styleUrl: './ver.component.css'
})
export class VerComponent {
  reservas: Reservas[] = [];

  rol: number = 0;


  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute,private messageService: MessageService) {

  }

  ngOnInit() {
    this.rol = Number(localStorage.getItem('rol'));

    this.api.postItem('reservas/index',{}).subscribe((data: any) => {
      this.reservas = data.reservas || [];
      console.log(this.reservas);
    });
  }

  editarReserva(reserva: Reservas) {
    const id = reserva.id;
    this.router.navigate(['editarReserva', id]);
  }

  cancelarReserva(reserva: any) {
    this.api.updateItem('reservas', reserva.id, { estado: 'cancelada' }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reserva cancelada',
          detail: `La reserva ha sido cancelada correctamente`
        });

        reserva.estado = 'cancelada';
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cancelar la reserva'
        });
      }
    });
  }

}
