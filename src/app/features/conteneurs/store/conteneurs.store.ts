import { Injectable, computed, signal } from '@angular/core';
import type {
  Conteneur,
  ConteneurFilters,
  ConteneurStats,
  ConteneurStatut,
} from '../models/conteneur.models';

interface ConteneursState {
  readonly items: Conteneur[];
  readonly selected: Conteneur | null;
  readonly filters: ConteneurFilters;
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly error: string | null;
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

const DEFAULT_FILTERS: ConteneurFilters = {
  search: '',
  statut: '',
  origine: '',
  type: '',
  transitaireStatut: '',
};

@Injectable({ providedIn: 'root' })
export class ConteneursStore {
  private readonly _state = signal<ConteneursState>({
    items: [],
    selected: null,
    filters: DEFAULT_FILTERS,
    isLoading: false,
    isSaving: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // ── Selectors ───────────────────────────────────────────────────────────
  readonly items     = computed(() => this._state().items);
  readonly selected  = computed(() => this._state().selected);
  readonly filters   = computed(() => this._state().filters);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly isSaving  = computed(() => this._state().isSaving);
  readonly error     = computed(() => this._state().error);
  readonly page      = computed(() => this._state().page);
  readonly pageSize  = computed(() => this._state().pageSize);
  readonly total     = computed(() => this._state().total);

  readonly stats = computed((): ConteneurStats => {
    const items = this._state().items;
    return {
      total:    this._state().total,
      arrives:  items.filter((c) => c.statut === 'ARRIVE').length,
      enCours:  items.filter((c) => c.statut === 'EN_TRANSIT' || c.statut === 'PRET_A_SORTIR').length,
      sortis:   items.filter((c) => c.statut === 'SORTI').length,
    };
  });

  readonly filteredItems = computed(() => {
    const { items, filters } = this._state();
    return items.filter((c) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          c.reference.toLowerCase().includes(q) ||
          c.bl.toLowerCase().includes(q) ||
          c.clients.some((cl) => cl.clientNom.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (filters.statut  && c.statut  !== filters.statut)  return false;
      if (filters.origine && c.origine !== filters.origine)  return false;
      if (filters.type    && c.type    !== filters.type)     return false;
      if (filters.transitaireStatut && c.transitaireStatut !== filters.transitaireStatut) return false;
      return true;
    });
  });

  // ── Mutators ────────────────────────────────────────────────────────────
  setLoading(isLoading: boolean): void {
    this._state.update((s) => ({ ...s, isLoading }));
  }

  setSaving(isSaving: boolean): void {
    this._state.update((s) => ({ ...s, isSaving }));
  }

  setItems(items: Conteneur[], total: number): void {
    this._state.update((s) => ({
      ...s, items, total, isLoading: false, error: null,
    }));
  }

  setSelected(conteneur: Conteneur | null): void {
    this._state.update((s) => ({ ...s, selected: conteneur }));
  }

  setError(error: string): void {
    this._state.update((s) => ({ ...s, error, isLoading: false, isSaving: false }));
  }

  setFilters(filters: Partial<ConteneurFilters>): void {
    this._state.update((s) => ({
      ...s,
      filters: { ...s.filters, ...filters },
      page: 1,
    }));
  }

  resetFilters(): void {
    this._state.update((s) => ({ ...s, filters: DEFAULT_FILTERS, page: 1 }));
  }

  setPage(page: number): void {
    this._state.update((s) => ({ ...s, page }));
  }

  upsertItem(conteneur: Conteneur): void {
    this._state.update((s) => {
      const exists = s.items.some((c) => c.id === conteneur.id);
      const items  = exists
        ? s.items.map((c) => (c.id === conteneur.id ? conteneur : c))
        : [...s.items, conteneur];
      return { ...s, items, isSaving: false };
    });
  }
}
