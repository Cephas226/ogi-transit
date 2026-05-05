import { Injectable, inject } from '@angular/core';
import { DashboardStore } from '../store/dashboard.store';
import { DashboardService } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly store   = inject(DashboardStore);
  private readonly service = inject(DashboardService);

  readonly caisses          = this.store.caisses;
  readonly cargoBalances    = this.store.cargoBalances;
  readonly kpis             = this.store.kpis;
  readonly recentConteneurs = this.store.recentConteneurs;
  readonly isLoading        = this.store.isLoading;
  readonly error            = this.store.error;

  loadDashboard(): void {
    if (!this.store.isStale()) return;
    this.store.setLoading(true);
    this.service.getDashboardData().subscribe({
      next:  (data) => this.store.setData(data),
      error: (err: { message?: string }) => this.store.setError(err.message ?? 'Erreur chargement'),
    });
  }

  refresh(): void {
    this.store.setLoading(true);
    this.service.getDashboardData().subscribe({
      next:  (data) => this.store.setData(data),
      error: (err: { message?: string }) => this.store.setError(err.message ?? 'Erreur chargement'),
    });
  }
}
