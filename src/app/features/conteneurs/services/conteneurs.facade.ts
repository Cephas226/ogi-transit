import { Injectable, inject } from '@angular/core';
import { ConteneursStore } from '../store/conteneurs.store';
import { ConteneursService } from './conteneurs.service';
import { NotificationService } from '../../../core/services/notification.service';
import type {
  ConteneurFilters,
  AffectationRequest,
} from '../models/conteneur.models';

@Injectable({ providedIn: 'root' })
export class ConteneursFacade {
  private readonly store       = inject(ConteneursStore);
  private readonly service     = inject(ConteneursService);
  private readonly notifs      = inject(NotificationService);

  // ── Public signals ──────────────────────────────────────────────────────
  readonly items          = this.store.filteredItems;
  readonly allItems       = this.store.items;
  readonly selected       = this.store.selected;
  readonly filters        = this.store.filters;
  readonly stats          = this.store.stats;
  readonly isLoading      = this.store.isLoading;
  readonly isSaving       = this.store.isSaving;
  readonly error          = this.store.error;
  readonly page           = this.store.page;
  readonly total          = this.store.total;

  // ── Actions ─────────────────────────────────────────────────────────────
  loadAll(): void {
    this.store.setLoading(true);
    this.service.getAll().subscribe({
      next:  ({ items, total }) => this.store.setItems(items, total),
      error: (err: { message?: string }) => {
        this.store.setError(err.message ?? 'Erreur chargement');
        this.notifs.error('Impossible de charger les conteneurs.');
      },
    });
  }

  loadById(id: string): void {
    this.store.setLoading(true);
    this.service.getById(id).subscribe({
      next:  (item) => { this.store.setSelected(item); this.store.setLoading(false); },
      error: (err: { message?: string }) => this.store.setError(err.message ?? 'Erreur'),
    });
  }

  selectItem(id: string): void {
    const found = this.store.items().find((c) => c.id === id) ?? null;
    this.store.setSelected(found);
  }

  clearSelection(): void {
    this.store.setSelected(null);
  }

  setFilters(filters: Partial<ConteneurFilters>): void {
    this.store.setFilters(filters);
  }

  resetFilters(): void {
    this.store.resetFilters();
  }

  setPage(page: number): void {
    this.store.setPage(page);
  }

  affecterTransitaire(req: AffectationRequest): void {
    this.store.setSaving(true);
    this.service.affecterTransitaire(req).subscribe({
      next: (updated) => {
        this.store.upsertItem(updated);
        this.notifs.success('Transitaire affecté avec succès.');
      },
      error: (err: { message?: string }) => {
        this.store.setError(err.message ?? 'Erreur affectation');
        this.notifs.error("Erreur lors de l'affectation du transitaire.");
      },
    });
  }
}
