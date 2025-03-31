import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'registro',
    loadComponent: () => import('./public/registro/registro.component').then(c => c.RegistroComponent)
  }
];
