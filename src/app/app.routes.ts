import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/components/shell/shell.component').then(
        (m) => m.ShellComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'conteneurs',
        loadChildren: () =>
          import('./features/conteneurs/conteneurs.routes').then(
            (m) => m.conteneursRoutes,
          ),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./features/clients/clients.routes').then(
            (m) => m.clientsRoutes,
          ),
      },
      {
        path: 'factures',
        loadChildren: () =>
          import('./features/factures/factures.routes').then(
            (m) => m.facturesRoutes,
          ),
      },
      {
        path: 'fournisseurs',
        loadChildren: () =>
          import('./features/fournisseurs/fournisseurs.routes').then(
            (m) => m.fournisseursRoutes,
          ),
      },
      {
        path: 'caisses',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'PDG', 'GERANT', 'FINANCE'] },
        loadChildren: () =>
          import('./features/caisses/caisses.routes').then(
            (m) => m.caissesRoutes,
          ),
      },
      {
        path: 'decaissements',
        loadChildren: () =>
          import('./features/decaissements/decaissements.routes').then(
            (m) => m.decaissementsRoutes,
          ),
      },
      {
        path: 'notes-de-frais',
        loadChildren: () =>
          import('./features/notes-de-frais/notes-de-frais.routes').then(
            (m) => m.notesDefraisRoutes,
          ),
      },
      {
        path: 'rapports',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'PDG', 'GERANT', 'FINANCE'] },
        loadChildren: () =>
          import('./features/rapports/rapports.routes').then(
            (m) => m.rapportsRoutes,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
