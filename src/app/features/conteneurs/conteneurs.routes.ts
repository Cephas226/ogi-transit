import { Routes } from '@angular/router';

export const conteneursRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/conteneurs-page.component').then(
        (m) => m.ConteneursPageComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/conteneurs-page.component').then(
        (m) => m.ConteneursPageComponent,
      ),
  },
];
