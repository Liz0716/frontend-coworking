import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';

@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet,RouterModule,MegaMenu, ButtonModule, CommonModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  items: MegaMenuItem[] | undefined;
  rol: number = 0;

  ngOnInit() {
    this.rol = Number(localStorage.getItem('rol'));

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard']
      },
      ...(this.rol === 1 ? [{
        label: 'Espacios',
        root: true,
        items: [
          [
            {
              items: [
                {
                  label: 'Lista de espacios',
                  icon: 'pi pi-list',
                  routerLink: ['/espacios'],
                  subtext: 'Ver todos los espacios disponibles'
                },
                {
                  label: 'Agregar espacio',
                  icon: 'pi pi-plus',
                  routerLink: ['/espacios/agregar'],
                  subtext: 'Registrar un nuevo espacio'
                }
              ]
            }
          ]
        ]
      }] : []),
      {
        label: 'Reservas',
        root: true,
        items: [
          [
            {
              items: [
                {
                  label: 'Lista de reservas',
                  icon: 'pi pi-calendar',
                  routerLink: ['/reservas'],
                  subtext: 'Ver todas las reservas'
                },
                {
                  label: 'Agregar reserva',
                  icon: 'pi pi-calendar-plus',
                  routerLink: ['/agregar/reserva'],
                  subtext: 'Crear una nueva reserva'
                }
              ]
            }
          ]
        ]
      },
      ...(this.rol === 1 ? [{
        label: 'Usuarios',
        root: true,
        items: [[{
          items: [
            {
              label: 'Lista de usuarios',
              icon: 'pi pi-user',
              routerLink: ['/usuarios'],
              subtext: 'Ver todos los usuarios'
            },
            {
              label: 'Agregar usuarios',
              icon: 'pi pi-user-plus',
              routerLink: ['/usuarios/agregar'],
              subtext: 'Crear un nuevo usuario' }
          ]
        }]]
      }] : [])

    ];
  }
}
