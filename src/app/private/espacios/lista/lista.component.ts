import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Espacios } from '../../../shared/interface/espacios.interface';
import { ApiService } from '../../../shared/services/Api.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-lista',
  imports: [TableModule,ButtonModule,RouterOutlet,ConfirmDialogModule,ToastModule,FormsModule, CommonModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  espacios: Espacios[] = [];
  value: string[] = [];

  filtroCapacidad: number | null = null;
  filtroPrecio: number | null = null;



  constructor(private api: ApiService,private router: Router, private route: ActivatedRoute,private messageService: MessageService, private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    this.api.postItem('espacios/index', {}).subscribe((response: any) => {
      this.espacios = response.data;
    });
  }

  editarEspacio(espacio: Espacios) {
    const id = espacio.id;
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  eliminarEspacio(espacio: Espacios) {
    this.confirmationService.confirm({
      message: `¿Estas seguro que deseas eliminar el espacio "${espacio.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.api.deleteItem('espacios', espacio.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Espacio eliminado correctamente'
            });
            this.api.postItem('espacios/index', {}).subscribe((response: any) => {
              this.espacios = response.data;
            });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el espacio' });
          }
        });
      }
    });
  }

  filtrarEspacios() {
    this.api.postItem('espacios/index', {
      capacidad: this.filtroCapacidad,
      precio: this.filtroPrecio
    }).subscribe((response: any) => {
      this.espacios = response.data;
    });
  }


}
