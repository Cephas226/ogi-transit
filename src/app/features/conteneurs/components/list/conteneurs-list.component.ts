import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConteneursFacade } from '../../services/conteneurs.facade';
import { ConteneursService } from '../../services/conteneurs.service';
import {
  STATUT_LABELS,
  TYPE_LABELS,
  ORIGINE_LABELS,
  type Conteneur,
  type ConteneurStatut,
  type Transitaire,
} from '../../models/conteneur.models';
import {
  ButtonComponent,
  BadgeComponent,
  SearchBarComponent,
  EmptyStateComponent,
  SpinnerComponent,
} from '../../../../shared/ui/index';
import { ModalTransitaireComponent } from '../modal-transitaire/modal-transitaire.component';
import { NouveauConteneurComponent } from '../form/nouveau-conteneur.component';

@Component({
  selector: 'app-conteneurs-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    BadgeComponent,
    SearchBarComponent,
    EmptyStateComponent,
    SpinnerComponent,
    ModalTransitaireComponent,
    NouveauConteneurComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Stats row ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-4 gap-3 mb-5">
      @for (stat of statsCards; track stat.label) {
        <div class="card p-4">
          <p class="text-2xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
            {{ stat.label }}
          </p>
          <p class="text-4xl font-bold leading-none" [class]="stat.colorClass">
            {{ stat.value }}
          </p>
        </div>
      }
    </div>

    <!-- ── Main table card ────────────────────────────────────────── -->
    <div class="card" [class.p-0]="true">

      <!-- Toolbar -->
      <div class="flex items-center gap-3 px-5 py-3.5 border-b border-black/[0.06]">
        <div class="flex-1 max-w-sm">
          <ui-search-bar
            placeholder="Rechercher par N° conteneur, B/L, Client..."
            (search)="onSearch($event)"
          />
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <ui-button variant="secondary" size="sm" (clicked)="onExport()">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
            Exporter
          </ui-button>

          <ui-button variant="primary" size="sm" (clicked)="showNewModal.set(true)">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Nouveau conteneur
          </ui-button>
        </div>
      </div>

      <!-- Loading state -->
      @if (facade.isLoading()) {
        <div class="py-16">
          <ui-spinner size="md" label="Chargement des conteneurs..." [centered]="true" />
        </div>
      }

      <!-- Error state -->
      @else if (facade.error()) {
        <div class="p-5">
          <div class="flex items-center gap-3 p-4 bg-danger-light border border-danger/20 rounded-xl text-danger-dark text-sm">
            <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
            </svg>
            {{ facade.error() }}
          </div>
        </div>
      }

      <!-- Empty state -->
      @else if (facade.items().length === 0) {
        <ui-empty-state
          title="Aucun conteneur trouvé"
          description="Essayez de modifier vos filtres ou créez un nouveau conteneur."
          actionLabel="Nouveau conteneur"
          iconPath="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      }

      <!-- Data table -->
      @else {
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Conteneur / B/L</th>
                <th>Type</th>
                <th>Origine</th>
                <th>Statut</th>
                <th>Client(s)</th>
                <th>Transitaire</th>
              </tr>
            </thead>
            <tbody>
              @for (c of facade.items(); track c.id) {
                <tr
                  class="cursor-pointer"
                  (click)="onRowClick(c)"
                >
                  <!-- Reference / BL -->
                  <td>
                    <p class="text-sm font-semibold text-ink">{{ c.reference }}</p>
                    <p class="text-2xs text-ink-muted mt-0.5">{{ c.bl }}</p>
                  </td>

                  <!-- Type badge -->
                  <td>
                    <span class="badge badge-neutral">{{ typeLabel(c.type) }}</span>
                  </td>

                  <!-- Origine with dot -->
                  <td>
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-ink-muted shrink-0" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                      </svg>
                      <span class="text-sm text-ink-secondary">{{ origineLabel(c.origine) }}</span>
                    </div>
                  </td>

                  <!-- Statut -->
                  <td>
                    <ui-badge [variant]="statutVariant(c.statut)" [dot]="true">
                      {{ statutLabel(c.statut) }}
                    </ui-badge>
                  </td>

                  <!-- Clients -->
                  <td>
                    <p class="text-sm font-medium text-ink">{{ c.clients[0]?.clientNom ?? '—' }}</p>
                    @if (c.clients.length > 1) {
                      <p class="text-2xs text-ink-muted mt-0.5">
                        + {{ c.clients.length - 1 }} autre{{ c.clients.length > 2 ? 's' : '' }}
                      </p>
                    }
                  </td>

                  <!-- Transitaire -->
                  <td (click)="$event.stopPropagation()">
                    @if (c.transitaireStatut === 'AFFECTE' || c.transitaireStatut === 'EN_COURS') {
                      <div>
                        <ui-badge variant="success">AFFECTÉ</ui-badge>
                        <p class="text-2xs text-ink-muted mt-1">{{ c.transitaireNom }}</p>
                      </div>
                    } @else {
                      <div class="flex flex-col gap-1">
                        <ui-badge variant="danger">NON AFFECTÉ</ui-badge>
                        <button
                          class="text-2xs font-medium text-primary hover:text-primary-hover transition-colors text-left"
                          (click)="openAffectation(c)"
                        >
                          Affecter →
                        </button>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 py-3 border-t border-black/[0.06]">
          <p class="text-xs text-ink-muted">
            Affichage de {{ paginationStart }}-{{ paginationEnd }} sur {{ facade.total() }} conteneurs actifs
          </p>
          <div class="flex items-center gap-1">
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md text-xs text-ink-secondary hover:bg-surface-subtle transition-colors disabled:opacity-40"
              [disabled]="facade.page() === 1"
              (click)="facade.setPage(facade.page() - 1)"
            >
              ‹
            </button>
            @for (p of pages(); track p) {
              <button
                class="w-7 h-7 flex items-center justify-center rounded-md text-xs transition-colors"
                [class]="p === facade.page()
                  ? 'bg-primary text-white font-semibold'
                  : 'text-ink-secondary hover:bg-surface-subtle'"
                (click)="facade.setPage(p)"
              >
                {{ p }}
              </button>
            }
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md text-xs text-ink-secondary hover:bg-surface-subtle transition-colors disabled:opacity-40"
              [disabled]="facade.page() === totalPages()"
              (click)="facade.setPage(facade.page() + 1)"
            >
              ›
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Affectation Modal -->
    <app-modal-transitaire
      [isOpen]="showAffectationModal()"
      [conteneur]="selectedForAffectation()"
      [transitaires]="transitaires()"
      (closed)="showAffectationModal.set(false)"
      (confirmed)="onAffectationConfirmed($event)"
    />

    <!-- Nouveau conteneur modal -->
    <app-nouveau-conteneur
      [isOpen]="showNewModal()"
      (closed)="showNewModal.set(false)"
    />
  `,
})
export class ConteneursListComponent implements OnInit {
  readonly facade  = inject(ConteneursFacade);
  private readonly service = inject(ConteneursService);

  readonly showAffectationModal  = signal(false);
  readonly showNewModal          = signal(false);
  readonly selectedForAffectation = signal<Conteneur | null>(null);
  readonly transitaires          = signal<Transitaire[]>([]);

  readonly statsCards = computed(() => {
    const s = this.facade.stats();
    return [
      { label: 'Total actifs', value: s.total,   colorClass: 'text-ink' },
      { label: 'Arrivés',      value: s.arrives,  colorClass: 'text-success' },
      { label: 'En cours',     value: s.enCours,  colorClass: 'text-warning' },
      { label: 'Sortis',       value: s.sortis,   colorClass: 'text-ink-muted' },
    ];
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.facade.total() / 10),
  );

  readonly paginationStart = computed(() =>
    (this.facade.page() - 1) * 10 + 1,
  );

  readonly paginationEnd = computed(() =>
    Math.min(this.facade.page() * 10, this.facade.total()),
  );

  pages(): number[] {
    const total = this.totalPages();
    return Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.facade.loadAll();
    this.loadTransitaires();
  }

  private loadTransitaires(): void {
    this.service.getTransitaires().subscribe((t) => this.transitaires.set(t));
  }

  onSearch(query: string): void {
    this.facade.setFilters({ search: query });
  }

  onExport(): void {
    // TODO: implement export
  }

  onRowClick(c: Conteneur): void {
    // Navigate to detail
  }

  openAffectation(c: Conteneur): void {
    this.selectedForAffectation.set(c);
    this.showAffectationModal.set(true);
  }

  onAffectationConfirmed(req: AffectationRequest): void {
    this.facade.affecterTransitaire(req);
    this.showAffectationModal.set(false);
  }

  statutLabel(s: ConteneurStatut): string   { return STATUT_LABELS[s] ?? s; }
  typeLabel(t: string): string              { return TYPE_LABELS[t as keyof typeof TYPE_LABELS] ?? t; }
  origineLabel(o: string): string           { return ORIGINE_LABELS[o as keyof typeof ORIGINE_LABELS] ?? o; }

  statutVariant(s: ConteneurStatut): 'success' | 'warning' | 'info' | 'neutral' | 'danger' {
    const map: Record<ConteneurStatut, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
      CREE:          'neutral',
      EN_TRANSIT:    'info',
      ARRIVE:        'info',
      PRET_A_SORTIR: 'warning',
      SORTI:         'neutral',
    };
    return map[s] ?? 'neutral';
  }
}

// Local type alias to avoid import issues
type AffectationRequest = import('../../models/conteneur.models').AffectationRequest;
