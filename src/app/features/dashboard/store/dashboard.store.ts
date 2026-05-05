import { Injectable, computed, signal } from '@angular/core';
import { DashboardData } from '../models/dashboard.models';

interface DashboardState {
  readonly data: DashboardData | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly lastFetched: number | null;
}

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly _state = signal<DashboardState>({
    data: null,
    isLoading: false,
    error: null,
    lastFetched: null,
  });

  readonly state = this._state.asReadonly();
  readonly data = computed(() => this._state().data);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly caisses = computed(() => this._state().data?.caisses ?? []);
  readonly cargoBalances = computed(() => this._state().data?.cargoBalances ?? []);
  readonly kpis = computed(() => this._state().data?.kpis ?? null);
  readonly recentConteneurs = computed(() => this._state().data?.recentConteneurs ?? []);

  readonly isStale = computed(() => {
    const lastFetched = this._state().lastFetched;
    if (!lastFetched) return true;
    return Date.now() - lastFetched > 5 * 60 * 1000;
  });

  setLoading(isLoading: boolean): void {
    this._state.update((s) => ({ ...s, isLoading }));
  }

  setData(data: DashboardData): void {
    this._state.update((s) => ({
      ...s,
      data,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }));
  }

  setError(error: string): void {
    this._state.update((s) => ({ ...s, error, isLoading: false }));
  }
}
