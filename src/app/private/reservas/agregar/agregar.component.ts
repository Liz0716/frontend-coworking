import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../shared/services/Api.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-agregar',
  imports: [CardModule,ButtonModule,CalendarModule,ToastModule,DropdownModule,ReactiveFormsModule,FloatLabelModule, CommonModule],
  providers: [MessageService],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponentR implements OnInit {
  Formulario: FormGroup;
  ID: any = '0';

  usuarios: any = [];
  espacios: any = [];

  edicion: boolean = false;

  estados = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Confirmada', value: 'confirmada' },
    { label: 'Cancelada', value: 'cancelada' }
  ]


  constructor(public FormBuilder: FormBuilder, private api: ApiService,private messageService: MessageService, private router: Router,private activateRoute: ActivatedRoute ) {
    this.Formulario = this.FormBuilder.group({
      id: [''],
      id_user: ['',Validators.required],
      id_espacio: ['',Validators.required],
      fecha: ['',Validators.required],
      hora_inicio: ['',Validators.required],
      hora_fin: ['',Validators.required],
      estado: [{value: 'pendiente', disabled: true},Validators.required],
      precio: [{value: 0, disabled: true},Validators.required],
    });

    this.getEspacios();
    this.getUsuarios();

  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.edicion = true;
        this.ID = params['id'];
        this.api.getItems('reservas', this.ID).subscribe({
          next: (reserva: any) => {
            this.Formulario.patchValue({
              ...reserva,
              fecha: new Date(reserva.fecha),
              hora_inicio: new Date(`1970-01-01T${reserva.hora_inicio}`),
              hora_fin: new Date(`1970-01-01T${reserva.hora_fin}`)
            });

            this.Formulario.get('estado')?.enable();
            this.Formulario.get('precio')?.enable();

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la reserva' });
            this.router.navigate(['/reservas']);
          }
        });
      }
    });
  }


  getEspacios(){
    this.api.getItems('reservas/espacios').subscribe({
      next: (data:any) => this.espacios = data.espacios,
      complete: ()  => console.log(this.espacios),
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los espacios' })
    });
  }

  getUsuarios(){
    this.api.getItems('reservas/usuarios').subscribe({
      next: (data:any) => this.usuarios = data.usuarios,
      complete: ()  => console.log(this.usuarios),
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' })
    });
  }

  formatearHora(date: Date): string {
    if (!date) return '';
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    const segundos = date.getSeconds().toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  }

  formatearFecha(date: Date): string {
    if (!date) return '';
    const año = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  verificarDisponibilidad(datos: any, callback: (disponible: boolean) => void) {
    this.api.postItem('reservas/horarios', {
      id_espacio: datos.id_espacio,
      fecha: datos.fecha,
      hora_inicio: datos.hora_inicio,
      hora_fin: datos.hora_fin
    }).subscribe({
      next: (res: any) => {
        callback(res.disponible);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al verificar disponibilidad' });
        callback(false);
      }
    });
  }


  onSubmit() {
    if (this.Formulario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Llena todos los campos requeridos' });
      return;
    }

    const datosForm = this.Formulario.getRawValue();

    const estado = `${this.Formulario.get('estado')?.value}` || 'pendiente';
    const precio = Number(this.Formulario.get('precio')?.value || 0);

    const datos = {
      ...datosForm,
      estado,
      precio,
      fecha: this.formatearFecha(datosForm.fecha),
      hora_inicio: this.formatearHora(datosForm.hora_inicio),
      hora_fin: this.formatearHora(datosForm.hora_fin),
    };

    if (this.ID !== '0') {
      this.api.updateItem('reservas', this.ID, datos).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Reserva actualizada', detail: 'Se modifico correctamente' });
          setTimeout(() => this.router.navigate(['/reservas']), 3000);
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la reserva' });
        }
      });
    } else {
      this.verificarDisponibilidad(datos, (disponible: boolean) => {
        if (!disponible) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Espacio no disponible',
            detail: 'Ya existe una reserva en ese horario'
          });
          return;
        }

        this.api.postItem('reservas', datos).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Reserva registrada',
              detail: 'Se creó correctamente'
            });
            setTimeout(() => this.router.navigate(['/reservas']), 3000);
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo registrar la reserva'
            });
          }
        });
      });
    }
  }


}
