import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { ConteneursService } from '../../services/conteneurs.service';
import { ConteneursFacade } from '../../services/conteneurs.facade';
import type {
  Lot,
  ConteneurOrigine,
  ConteneurType,
  ServiceType,
} from '../../models/conteneur.models';

type Step = 1 | 2;

@Component({
  selector: 'app-nouveau-conteneur',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-modal
      [isOpen]="isOpen"
      title="Nouveau conteneur"
      size="md"
      (closed)="onClose()"
    >
      <!-- Stepper indicator -->
      <div class="flex items-center mb-6">
        @for (step of steps; track step.num; let last = $last) {
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold shrink-0 transition-colors"
              [class]="stepIndicatorClass(step.num)"
            >
              @if (currentStep() > step.num) {
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"/>
                </svg>
              } @else {
                {{ step.num }}
              }
            </div>
            <span class="text-xs font-medium" [class]="currentStep() === step.num ? 'text-primary' : 'text-ink-muted'">
              {{ step.label }}
            </span>
          </div>
          @if (!last) {
            <div class="flex-1 h-px mx-3" [class]="currentStep() > step.num ? 'bg-primary' : 'bg-black/10'"></div>
          }
        }
      </div>

      <!-- ── STEP 1: Lot ─────────────────────────────────────────── -->
      @if (currentStep() === 1) {
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="field-label">Lot de rattachement</label>
            <span class="badge badge-danger text-2xs">Requis</span>
          </div>

          <!-- Search input -->
          <div class="relative mb-3">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              class="field-input pl-9"
              [placeholder]="'LOT-0' + nextLotNum()"
              [(ngModel)]="lotSearch"
              (ngModelChange)="onLotSearch($event)"
            />
          </div>

          <!-- Lot suggestions -->
          <div class="space-y-1.5">
            @for (lot of filteredLots(); track lot.id) {
              <button
                type="button"
                (click)="selectLot(lot)"
                class="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors"
                [class]="selectedLotId() === lot.id
                  ? 'border-primary bg-primary-light'
                  : 'border-black/[0.07] hover:bg-surface-subtle'"
              >
                <div class="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-ink">{{ lot.nom }}</p>
                  <p class="text-2xs text-ink-muted">
                    {{ lot.nbConteneurs }} conteneurs · {{ origineLabel(lot.origine) }}
                  </p>
                </div>
                <span class="text-2xs text-ink-muted shrink-0">{{ formatDate(lot.createdAt) }}</span>
              </button>
            }
          </div>

          <!-- Create new lot hint -->
          <div class="mt-3 p-3 bg-info-light rounded-xl">
            <p class="text-xs text-info-dark">
              Tapez le numéro du lot (ex: <strong>LOT-0{{ nextLotNum() }}</strong>). Sélectionnez s'il existe, ou appuyez Entrée pour le créer.
            </p>
          </div>
        </div>
      }

      <!-- ── STEP 2: Conteneur ───────────────────────────────────── -->
      @if (currentStep() === 2) {
        <div class="space-y-4">

          <!-- Lot sélectionné (résumé) -->
          <div class="flex items-center gap-3 p-3 bg-surface-subtle rounded-xl border border-black/[0.06]">
            <svg class="w-4 h-4 text-ink-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
            </svg>
            <div>
              <p class="text-2xs text-ink-muted uppercase tracking-wider">Lot sélectionné</p>
              <p class="text-sm font-semibold text-ink">{{ selectedLotNom() }}</p>
            </div>
          </div>

          <!-- Type de service -->
          <div>
            <label class="field-label mb-2">Type de service</label>
            <div class="space-y-2">
              @for (svc of serviceTypes; track svc.value) {
                <button
                  type="button"
                  (click)="form.serviceType = svc.value"
                  class="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors"
                  [class]="form.serviceType === svc.value
                    ? 'border-primary bg-primary-light'
                    : 'border-black/[0.07] hover:bg-surface-subtle'"
                >
                  <div class="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center shrink-0">
                    <span class="text-base">{{ svc.icon }}</span>
                  </div>
                  <span class="text-sm font-medium text-ink">{{ svc.label }}</span>
                  @if (form.serviceType === svc.value) {
                    <svg class="w-4 h-4 text-primary ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clip-rule="evenodd"/>
                    </svg>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Informations conteneur -->
          <div>
            <p class="field-label mb-3">Informations conteneur</p>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="field-label">N° Conteneur</label>
                  <span class="badge badge-danger text-2xs">Requis</span>
                </div>
                <input type="text" class="field-input" placeholder="MSCU5498201-2" [(ngModel)]="form.reference" />
              </div>
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="field-label">N° Connaissement</label>
                  <span class="badge badge-danger text-2xs">Requis</span>
                </div>
                <input type="text" class="field-input" placeholder="BL-MSC2024088" [(ngModel)]="form.bl" />
              </div>
              <div class="col-span-2">
                <div class="flex items-center justify-between mb-1.5">
                  <label class="field-label">Label du conteneur</label>
                  <span class="badge badge-neutral text-2xs">Optionnel</span>
                </div>
                <input type="text" class="field-input" placeholder="2026, Lot Ramadan..." [(ngModel)]="form.label" />
              </div>
            </div>
          </div>

          <!-- Origine + Type -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="field-label mb-2">Origine</label>
              <div class="flex gap-2">
                @for (o of origines; track o.value) {
                  <button
                    type="button"
                    (click)="form.origine = o.value"
                    class="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors"
                    [class]="form.origine === o.value
                      ? 'bg-ink text-white border-ink'
                      : 'bg-surface text-ink-secondary border-black/10 hover:bg-surface-subtle'"
                  >
                    {{ o.label }}
                  </button>
                }
              </div>
            </div>
            <div>
              <label class="field-label mb-2">Type conteneur</label>
              <div class="flex gap-2">
                @for (t of types; track t.value) {
                  <button
                    type="button"
                    (click)="form.type = t.value"
                    class="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors"
                    [class]="form.type === t.value
                      ? 'bg-ink text-white border-ink'
                      : 'bg-surface text-ink-secondary border-black/10 hover:bg-surface-subtle'"
                  >
                    {{ t.label }}
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div>
            <label class="field-label mb-2">Dates</label>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="field-label">Arrivée prévue <span class="text-danger ml-0.5">*</span></label>
                <input type="date" class="field-input" [(ngModel)]="form.dateArriveePrevu" />
              </div>
              <div>
                <label class="field-label">Arrivée réelle</label>
                <input type="date" class="field-input" [(ngModel)]="form.dateArriveeReelle" />
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Footer -->
      <div footer class="flex items-center justify-between gap-3 px-6 py-4 border-t border-black/[0.06]">
        @if (currentStep() === 1) {
          <ui-button variant="secondary" size="md" (clicked)="onClose()">Annuler</ui-button>
          <ui-button
            variant="primary"
            size="md"
            [disabled]="!selectedLotId()"
            (clicked)="goToStep(2)"
          >
            Suivant →
          </ui-button>
        } @else {
          <ui-button variant="secondary" size="md" (clicked)="goToStep(1)">← Retour</ui-button>
          <ui-button
            variant="primary"
            size="md"
            [disabled]="!canCreate"
            [loading]="facade.isSaving()"
            (clicked)="onCreate()"
          >
            Créer le conteneur
          </ui-button>
        }
      </div>
    </ui-modal>
  `,
})
export class NouveauConteneurComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(ConteneursService);
  readonly facade = inject(ConteneursFacade);

  readonly currentStep  = signal<Step>(1);
  readonly selectedLotId  = signal<string | null>(null);
  readonly selectedLotNom = signal<string>('');
  readonly lots           = signal<Lot[]>([]);

  lotSearch = '';

  form: {
    reference: string;
    bl: string;
    label: string;
    serviceType: ServiceType;
    origine: ConteneurOrigine;
    type: ConteneurType;
    dateArriveePrevu: string;
    dateArriveeReelle: string;
  } = {
    reference: '',
    bl: '',
    label: '',
    serviceType: 'FCL_HOME',
    origine: 'CHINE',
    type: 'FCL_40',
    dateArriveePrevu: '',
    dateArriveeReelle: '',
  };

  readonly steps = [
    { num: 1 as Step, label: 'Lot' },
    { num: 2 as Step, label: 'Conteneur' },
  ];

  readonly serviceTypes: { value: ServiceType; label: string; icon: string }[] = [
    { value: 'FCL_AWAYE', label: 'FCL + Awaye', icon: '🚛' },
    { value: 'FCL_HOME',  label: 'FCL + Home',  icon: '🏠' },
    { value: 'LCL_HOME',  label: 'LCL + Home',  icon: '🏠' },
  ];

  readonly origines: { value: ConteneurOrigine; label: string }[] = [
    { value: 'CHINE', label: 'Chine' },
    { value: 'DUBAI', label: 'Dubaï' },
  ];

  readonly types: { value: ConteneurType; label: string }[] = [
    { value: 'FCL_20', label: "20'" },
    { value: 'FCL_40', label: "40'" },
  ];

  readonly filteredLots = computed(() => {
    const q = this.lotSearch.toLowerCase();
    if (!q) return this.lots();
    return this.lots().filter((l) =>
      l.nom.toLowerCase().includes(q),
    );
  });

  readonly nextLotNum = computed(() => {
    const nums = this.lots().map((l) => parseInt(l.nom.replace('LOT-', ''), 10)).filter(Boolean);
    return (Math.max(0, ...nums) + 1).toString().padStart(3, '0');
  });

  ngOnInit(): void {
    this.service.getLots().subscribe((lots) => this.lots.set(lots));
  }

  get canCreate(): boolean {
    return !!this.form.reference && !!this.form.bl && !!this.form.dateArriveePrevu;
  }

  goToStep(step: Step): void {
    this.currentStep.set(step);
  }

  selectLot(lot: Lot): void {
    this.selectedLotId.set(lot.id);
    this.selectedLotNom.set(lot.nom);
  }

  onLotSearch(q: string): void {
    if (!q) { this.selectedLotId.set(null); this.selectedLotNom.set(''); }
  }

  onCreate(): void {
    // TODO: dispatch create action via facade
  }

  onClose(): void {
    this.currentStep.set(1);
    this.selectedLotId.set(null);
    this.selectedLotNom.set('');
    this.lotSearch = '';
    this.closed.emit();
  }

  stepIndicatorClass(step: Step): string {
    if (this.currentStep() > step) return 'bg-success text-white';
    if (this.currentStep() === step) return 'bg-primary text-white';
    return 'bg-black/10 text-ink-muted';
  }

  origineLabel(o: ConteneurOrigine): string {
    return o === 'CHINE' ? 'Chine' : 'Dubaï';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  }
}
