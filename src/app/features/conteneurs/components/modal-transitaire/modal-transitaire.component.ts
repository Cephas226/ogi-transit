import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type {
  Conteneur,
  Transitaire,
  AffectationRequest,
} from '../../models/conteneur.models';
import { STATUT_LABELS, TYPE_LABELS, ORIGINE_LABELS } from '../../models/conteneur.models';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-modal-transitaire',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ButtonComponent,
    BadgeComponent,
    InputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-modal
      [isOpen]="isOpen"
      title="Affecter un transitaire"
      [subtitle]="modalSubtitle"
      size="md"
      (closed)="closed.emit()"
    >
      @if (conteneur) {

        <!-- Context badges -->
        <div class="flex items-center gap-2 mb-5">
          <span class="badge badge-neutral">{{ typeLabel(conteneur.type) }}</span>
          @if (conteneur.label) {
            <span class="badge badge-neutral">{{ conteneur.label }}</span>
          }
          <span class="badge badge-neutral">{{ origineLabel(conteneur.origine) }}</span>
          <ui-badge [variant]="statutBadgeVariant" [dot]="true">
            {{ statutLabel(conteneur.statut) }}
          </ui-badge>
        </div>

        <!-- Section: Choix transitaire -->
        <div class="mb-5">
          <p class="field-label mb-3">Sélection du transitaire</p>

          <ui-input
            placeholder="Rechercher un transitaire..."
            [value]="searchTransitaire()"
            (input)="searchTransitaire.set($any($event).target.value)"
          />

          <div class="mt-2 space-y-1.5">
            @for (t of filteredTransitaires(); track t.id) {
              <button
                type="button"
                (click)="selectTransitaire(t)"
                class="w-full flex items-center justify-between p-3 rounded-xl border transition-colors text-left"
                [class]="selectedTransitaireId() === t.id
                  ? 'border-primary bg-primary-light'
                  : 'border-black/[0.07] hover:bg-surface-subtle'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-ink">{{ t.nom }}</p>
                    @if (t.certifie && t.rating) {
                      <p class="text-2xs text-ink-muted">
                        Partenaire Certifié · {{ t.rating }}★
                      </p>
                    }
                  </div>
                </div>
                @if (selectedTransitaireId() === t.id) {
                  <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clip-rule="evenodd"/>
                  </svg>
                }
              </button>
            }
          </div>
        </div>

        <!-- Section: Tarification -->
        @if (selectedTransitaireId()) {
          <div class="space-y-3 mb-5">
            <p class="field-label">Tarification & Coûts</p>

            <div class="grid grid-cols-2 gap-3">
              <!-- Coût transitaire -->
              <div class="relative">
                <label class="field-label">Coût transitaire GNF</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                  </svg>
                  <input
                    type="number"
                    [(ngModel)]="coutTransitaire"
                    class="field-input pl-9"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Prix de vente -->
              <div>
                <label class="field-label">Prix de vente service GNF</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                  </svg>
                  <input
                    type="number"
                    [(ngModel)]="prixVente"
                    class="field-input pl-9"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <!-- Marge estimée -->
            @if (margeEstimee > 0) {
              <div class="flex items-center justify-between p-3 bg-surface-subtle rounded-xl border border-black/[0.06]">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/>
                  </svg>
                  <span class="text-xs font-medium text-ink-secondary">
                    Marge brute estimée : {{ margeEstimee | number:'1.0-0' }} GNF · {{ margePct }}%
                  </span>
                </div>
                <span class="badge badge-neutral text-2xs">ESTIMÉE</span>
              </div>
            }
          </div>

          <!-- État affectation -->
          <div class="mb-5">
            <p class="field-label mb-2">État de l'affectation</p>
            <div class="flex gap-2">
              <button
                type="button"
                (click)="affectationStatut = 'AFFECTE'"
                class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors border"
                [class]="affectationStatut === 'AFFECTE'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-surface text-ink-secondary border-black/10 hover:bg-surface-subtle'"
              >
                Affecté
              </button>
              <button
                type="button"
                (click)="affectationStatut = 'EN_COURS'"
                class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors border"
                [class]="affectationStatut === 'EN_COURS'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-surface text-ink-secondary border-black/10 hover:bg-surface-subtle'"
              >
                En cours
              </button>
            </div>
          </div>

          <!-- Confidentialité note -->
          <p class="text-2xs text-ink-muted mb-5">
            Le coût transitaire ne sera jamais visible par les clients.
          </p>
        }
      }

      <!-- Footer -->
      <div footer class="flex items-center justify-between gap-3 px-6 py-4 border-t border-black/[0.06]">
        <ui-button variant="secondary" size="md" (clicked)="closed.emit()">
          Annuler
        </ui-button>
        <ui-button
          variant="primary"
          size="md"
          [disabled]="!canConfirm"
          [loading]="false"
          (clicked)="onConfirm()"
        >
          Affecter le transitaire
        </ui-button>
      </div>
    </ui-modal>
  `,
})
export class ModalTransitaireComponent {
  @Input() isOpen = false;
  @Input() conteneur: Conteneur | null = null;
  @Input() transitaires: Transitaire[] = [];

  @Output() closed    = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<AffectationRequest>();

  readonly searchTransitaire    = signal('');
  readonly selectedTransitaireId = signal<string | null>(null);

  coutTransitaire = 0;
  prixVente       = 0;
  affectationStatut: 'AFFECTE' | 'EN_COURS' = 'AFFECTE';

  readonly filteredTransitaires = computed(() => {
    const q = this.searchTransitaire().toLowerCase();
    if (!q) return this.transitaires;
    return this.transitaires.filter((t) =>
      t.nom.toLowerCase().includes(q),
    );
  });

  get margeEstimee(): number {
    return Math.max(0, this.prixVente - this.coutTransitaire);
  }

  get margePct(): number {
    if (!this.prixVente) return 0;
    return Math.round((this.margeEstimee / this.prixVente) * 100);
  }

  get canConfirm(): boolean {
    return !!this.selectedTransitaireId() && this.coutTransitaire > 0 && this.prixVente > 0;
  }

  get modalSubtitle(): string {
    if (!this.conteneur) return '';
    return `${this.conteneur.reference} · ${TYPE_LABELS[this.conteneur.type] ?? this.conteneur.type} · ${ORIGINE_LABELS[this.conteneur.origine] ?? this.conteneur.origine}`;
  }

  get statutBadgeVariant(): 'success' | 'warning' | 'info' | 'neutral' {
    if (!this.conteneur) return 'neutral';
    const map: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
      ARRIVE: 'info', PRET_A_SORTIR: 'warning', SORTI: 'neutral',
      CREE: 'neutral', EN_TRANSIT: 'info',
    };
    return map[this.conteneur.statut] ?? 'neutral';
  }

  selectTransitaire(t: Transitaire): void {
    this.selectedTransitaireId.set(t.id);
  }

  onConfirm(): void {
    if (!this.conteneur || !this.selectedTransitaireId()) return;

    this.confirmed.emit({
      conteneurId:          this.conteneur.id,
      transitaireId:        this.selectedTransitaireId()!,
      coutTransitaireGnf:   this.coutTransitaire,
      prixVenteGnf:         this.prixVente,
      statut:               this.affectationStatut,
    });
  }

  statutLabel(s: string): string  { return STATUT_LABELS[s as keyof typeof STATUT_LABELS] ?? s; }
  typeLabel(t: string): string    { return TYPE_LABELS[t as keyof typeof TYPE_LABELS] ?? t; }
  origineLabel(o: string): string { return ORIGINE_LABELS[o as keyof typeof ORIGINE_LABELS] ?? o; }
}
