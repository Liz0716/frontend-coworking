import { Routes } from '@angular/router';
import { LoginComponent } from './public/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'

  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    loadComponent: () => import('./public/registro/registro.component').then(c => c.RegistroComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./private/dashboard/dashboard.component').then(c => c.DashboardComponent)
  }
];
