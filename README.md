# OGI Transit — Angular 21 Frontend

## Stack
- Angular 21 (Standalone + Signals + Zoneless)
- Tailwind CSS 3
- TypeScript strict (zero `any`)
- HttpClient (mock -> real API switch)

## Demarrage rapide

```bash
npm install
npm start
# http://localhost:4200
```

## Comptes demo (mot de passe: password)
- admin@ogi.com        -> Gerant
- finance@ogi.com      -> Finance
- logistique@ogi.com   -> Logistique
- pdg@ogi.com          -> PDG

## Architecture

```
src/app/
  core/
    auth/
      guards/       authGuard, roleGuard, guestGuard
      interceptors/ jwt.interceptor, error.interceptor
      models/       User, AuthState, UserRole (6 roles)
      services/     AuthService (signals-based)
      directives/   *hasRole, *hasMinRole
    layout/
      components/
        shell/      App shell (sidebar + topbar + outlet)
        sidebar/    Navigation
    services/
      notification.service
  features/
    auth/login/     Page de connexion
    dashboard/      KPIs + Caisses + Balances + Table
  infrastructure/
    api/services/   BaseApiService
    mock-data/      auth.mock, dashboard.mock
  environments/
    environment.ts       dev  (mockData: true)
    environment.prod.ts  prod (mockData: false)
    environment.staging.ts
```

## Passer en mode API reelle

Dans `environment.ts`:
```ts
mockData: false,
apiUrl: 'http://localhost:8000/api/v1',
```

Endpoints Django attendus:
- POST /api/v1/auth/login/
- POST /api/v1/auth/refresh/
- GET  /api/v1/dashboard/

## Roles
| Role       | Acces                          |
|------------|-------------------------------|
| ADMIN      | Tout                          |
| PDG        | Tout + Balances Cargo         |
| GERANT     | Tout + Balances Cargo         |
| FINANCE    | Factures, Caisses, Rapports   |
| LOGISTIQUE | Conteneurs, Fournisseurs      |
| OPERATEUR  | Conteneurs (lecture)          |
