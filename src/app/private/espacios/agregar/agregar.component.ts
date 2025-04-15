import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../shared/services/Api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Espacios } from '../../../shared/interface/espacios.interface';



@Component({
  selector: 'app-agregar',
  imports: [ReactiveFormsModule, InputTextModule, ToggleSwitchModule, PasswordModule, FloatLabelModule, ToastModule],
  providers: [MessageService],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponentE {
  Formuario: FormGroup;
  ID : any ='0';
  espacios: Espacios = {} as Espacios;



  constructor(public FormBuilder: FormBuilder,private messageService: MessageService, private api: ApiService, private router: Router,private activateRoute: ActivatedRoute ) {

    this.Formuario = this.FormBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      capacidad: [, Validators.required],
      precio_hora: [, Validators.required],
      disponibilidad: [, Validators.required],
    })
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      if (!params['id']) {
        return;
      }

      this.ID = params['id'];

      this.api.getItems('espacios', this.ID).subscribe({
        next: (data: any) => {
          this.espacios = data;

          if (!this.espacios || Object.keys(this.espacios).length === 0) {
            this.messageService.add({severity: 'warn', summary: 'Espacio no encontrado', detail: 'El espacio que buscas no existe o fue eliminado'});
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
            return;
          }

          this.espacios.disponibilidad = !!this.espacios.disponibilidad;

          this.Formuario.reset(this.espacios);
        },
        error: (error) => {
          console.error('Error al obtener espacio:', error);
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo cargar la informacion del espacio'});
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      });
    });
  }


  onSubmit(){
    if (this.Formuario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Por favor completa todos los campos' });
      return;
    }

    const data = this.Formuario.value;

    data.disponibilidad = data.disponibilidad ? 1 : 0;

    if(this.ID != '0'){
      this.api.updateItem('espacios', this.ID, data).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Espacio actualizado', detail: 'Los datos fueron modificados' });
          setTimeout(() => {
            this.router.navigate(['/espacios']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar espacio:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el espacio' });
        }
      });
    }else{
    this.api.postItem('espacios', data).subscribe({
      next: (response) => {
        console.log('Respuesta registro espacio:', response);
        this.messageService.add({ severity: 'success', summary: 'Espacio registrado exitoso', detail: response.mensaje });

        setTimeout(() => {
          this.router.navigate(['/espacios']);
        }, 5000);
      },
      error: (error) => {
        console.error('Error en registro de espacio:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el espacio' });
      }
    });
  }
  }



}
