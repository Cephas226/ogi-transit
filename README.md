# OGI Transit — Angular 21 Frontend

Système de gestion logistique et financière pour OGI Transit.

## Stack

- **Angular 21** — Standalone components + Signals + Zoneless
- **Tailwind CSS 3** — Utility-first styling
- **RxJS 7** — Minimal (Signals first)
- **HttpClient** — API REST Django
- **TypeScript strict** — Zero `any`

## Architecture

```
src/app/
├── core/                        # Singleton services, guards, interceptors
│   ├── auth/
│   │   ├── guards/              # authGuard, roleGuard, guestGuard
│   │   ├── interceptors/        # jwtInterceptor, errorInterceptor
│   │   ├── models/              # User, AuthState, UserRole types
│   │   ├── services/            # AuthService (signals-based)
│   │   └── directives/          # *hasRole, *hasMinRole
│   ├── layout/
│   │   └── components/
│   │       ├── shell/           # Main app shell (sidebar + topbar + outlet)
│   │       └── sidebar/         # Navigation sidebar
│   └── services/
│       └── notification.service.ts
│
├── shared/                      # Reusable UI components
│   ├── components/
│   │   ├── button/
│   │   ├── badge/
│   │   ├── table/
│   │   └── card/
│   ├── directives/
│   └── pipes/
│
├── features/                    # Domain feature modules
│   ├── auth/                    # Login page
│   ├── dashboard/               # KPIs + Caisses + Balances
│   ├── conteneurs/              # Container management + LCL workflow
│   ├── clients/                 # Client management + payments
│   ├── factures/                # Invoice lifecycle
│   ├── caisses/                 # Multi-currency treasury
│   ├── fournisseurs/            # Supplier management
│   ├── decaissements/           # Disbursement workflow
│   ├── notes-de-frais/          # Expense reports
│   └── rapports/                # Balance cargo + truth table
│
├── infrastructure/
│   ├── api/
│   │   ├── services/            # BaseApiService
│   │   └── interceptors/        # (jwt, error — in core/auth)
│   └── mock-data/               # Realistic mock data per module
│
└── environments/
    ├── environment.ts           # dev (mockData: true)
    ├── environment.prod.ts      # prod (apiUrl: real)
    └── environment.staging.ts  # staging
```

## Rôles & permissions

| Rôle       | Accès                                              |
|------------|---------------------------------------------------|
| ADMIN      | Tout                                               |
| PDG        | Tout + Balances Cargo visibles                    |
| GERANT     | Tout + Balances Cargo visibles                    |
| FINANCE    | Factures, Caisses, Décaissements, Rapports        |
| LOGISTIQUE | Conteneurs, Fournisseurs                          |
| OPERATEUR  | Conteneurs (lecture), Notes de frais              |

## Patterns utilisés

### Signal Store
```typescript
// Chaque feature a son Store
@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly _state = signal<DashboardState>({ ... });
  readonly data = computed(() => this._state().data);
  setData(data: DashboardData): void { ... }
}
```

### Facade Pattern
```typescript
// La page n'accède qu'à la Facade
@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  readonly kpis = this.store.kpis;
  loadDashboard(): void { ... }
}
```

### Mock → Real API switch
```typescript
// Dans chaque service
if (environment.features.mockData) {
  return of(MOCK_DATA).pipe(delay(300));
}
return this.get<T>('/endpoint/');
```

## Démarrage

```bash
npm install
npm start
# → http://localhost:4200

# Comptes démo
admin@ogi.com / password     → Gérant
finance@ogi.com / password   → Finance
logistique@ogi.com / password → Logistique
pdg@ogi.com / password       → PDG
```

## Connexion au backend Django

1. Changer `environment.ts` : `mockData: false`
2. Changer `apiUrl` : `http://localhost:8000/api/v1`
3. S'assurer que Django expose :
   - `POST /api/v1/auth/login/`
   - `POST /api/v1/auth/refresh/`
   - `GET /api/v1/dashboard/`
   - etc.
