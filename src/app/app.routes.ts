import { Routes } from '@angular/router';
import { LoginComponent } from './public/login/login.component';
import { RegistroComponent } from './public/registro/registro.component';
import { NavbarComponent } from './private/navbar/navbar.component';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { guardGuard } from './shared/guard/guard.guard';
import { ListaComponent } from './private/espacios/lista/lista.component';
import { AgregarComponentR } from './private/reservas/agregar/agregar.component';
import { VerComponent } from './private/reservas/ver/ver.component';
import { ListadoComponent } from './private/usuarios/listado/listado.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./public/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./public/registro/registro.component').then(c => c.RegistroComponent)
  },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [guardGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./private/dashboard/dashboard.component').then(c => c.DashboardComponent),
        data: {
          roles: [0, 1]
        }
       },


      { path: 'usuarios', component: ListadoComponent,
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
       },
      { path: 'usuarios/editar/:id', loadComponent: () => import('./private/usuarios/agregar/agregar.component').then(c => c.AgregarComponentU),
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
       },
      { path: 'usuarios/agregar', loadComponent: () => import('./private/usuarios/agregar/agregar.component').then(c => c.AgregarComponentU),
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
       },

      { path: 'espacios', component: ListaComponent ,
        canActivate: [guardGuard],
        data: {
          roles: [0, 1]
        }
      },
      { path: 'espacios/editar/:id', loadComponent: () => import('./private/espacios/agregar/agregar.component').then(c => c.AgregarComponentE),
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
       },
      { path: 'espacios/agregar', loadComponent: () => import('./private/espacios/agregar/agregar.component').then(c => c.AgregarComponentE),
        canActivate: [guardGuard],
        data: {
          roles: [1]
        }
       },
      { path: 'reservas', component: VerComponent,
        canActivate: [guardGuard],
        data: {
          roles: [0, 1]
        }
       },
      { path: 'agregar/reserva', loadComponent: () => import('./private/reservas/agregar/agregar.component').then(c => c.AgregarComponentR),
        canActivate: [guardGuard],
        data: {
          roles: [0, 1]
        }
       },
      { path: 'editarReserva/:id', loadComponent: () => import('./private/reservas/agregar/agregar.component').then(c => c.AgregarComponentR),
        canActivate: [guardGuard],
        data: {
          roles: [0, 1]
        }
       },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
