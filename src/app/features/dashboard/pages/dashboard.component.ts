import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DashboardFacade } from '../services/dashboard.facade';
import type { ConteneurStatut } from '../models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (facade.isLoading()) {
      <div class="flex items-center justify-center h-48">
        <svg class="animate-spin w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    } @else if (facade.error()) {
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{{ facade.error() }}</div>
    } @else {

      <!-- ═══════════════════════════════════════════════════
           SECTION : Caisses & Flux
      ════════════════════════════════════════════════════ -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-[17px] font-bold text-[#1a1e2e]">Caisses & Flux</h2>
        <span class="text-[11px] text-[#9ca3af]">Dernière mise à jour : il y a 12 min</span>
      </div>

      <div class="grid grid-cols-4 gap-3 mb-6">

        <!-- Caisse USD Chine — carte foncée avec fond dégradé orange -->
        <div class="rounded-xl p-4 relative overflow-hidden"
             style="background: linear-gradient(135deg, #1a1e2e 60%, #2a2030 100%); border: 1px solid #1a1e2e;">
          <!-- Cercles décoratifs -->
          <div class="absolute top-2 right-2 w-16 h-16 rounded-full opacity-20"
               style="background: #e85d2f;"></div>
          <div class="absolute top-6 right-6 w-10 h-10 rounded-full opacity-15"
               style="background: #e85d2f;"></div>

          <div class="relative z-10">
            <div class="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2">
              CAISSE USD CHINE
            </div>
            <div class="flex items-baseline gap-1.5 mb-1">
              <span class="text-[28px] font-bold text-white leading-none">84 320</span>
              <span class="text-[13px] font-medium text-white/70">USD</span>
            </div>
            <div class="text-[11px] text-white/50 mb-3">USD disponible</div>
            <div class="border-t border-white/10 pt-2">
              <span class="text-[11px] text-white/40">Cargo Chine doit : </span>
              <span class="text-[11px] font-semibold text-[#e85d2f]">142 500 USD</span>
            </div>
          </div>
        </div>

        <!-- Caisse GNF Chine -->
        <div class="bg-white rounded-xl border border-black/[0.07] p-4">
          <div class="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] mb-2">
            CAISSE GNF CHINE
          </div>
          <div class="flex items-baseline gap-1.5 mb-1">
            <span class="text-[22px] font-bold text-[#1a1e2e] leading-none">286 000 000</span>
          </div>
          <div class="text-[11px] text-[#9ca3af]">GNF disponible</div>
        </div>

        <!-- Caisse USD Dubaï -->
        <div class="bg-white rounded-xl border border-black/[0.07] p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">
              CAISSE USD DUBAÏ
            </div>
            <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style="background: #dcfce7; color: #166534;">↑ +8%</span>
          </div>
          <div class="flex items-baseline gap-1.5 mb-1">
            <span class="text-[22px] font-bold text-[#1a1e2e] leading-none">31 080</span>
            <span class="text-[13px] font-medium text-[#9ca3af]">USD</span>
          </div>
          <div class="text-[11px] text-[#9ca3af]">USD disponible</div>
        </div>

        <!-- Caisse GNF Dubaï -->
        <div class="bg-white rounded-xl border border-black/[0.07] p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">
              CAISSE GNF DUBAÏ
            </div>
            <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style="background: #f3f4f6; color: #6b7280;">→ stable</span>
          </div>
          <div class="flex items-baseline gap-1.5 mb-1">
            <span class="text-[22px] font-bold text-[#1a1e2e] leading-none">194 000 000</span>
          </div>
          <div class="text-[11px] text-[#9ca3af]">GNF disponible</div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════
           SECTION : Balances Cargo
      ════════════════════════════════════════════════════ -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-[17px] font-bold text-[#1a1e2e]">Balances Cargo</h2>
        <span class="flex items-center gap-1 text-[11px] text-[#9ca3af]">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Visible Gérant / PDG
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">

        <!-- Balance Cargo Chine -->
        <div class="bg-white rounded-xl border border-black/[0.07] p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded"
                    style="background: #dbeafe; color: #1d4ed8;">CHINE</span>
              <span class="text-[14px] font-bold text-[#1a1e2e]">Balance Cargo Chine</span>
            </div>
            <span class="text-[10px] text-[#9ca3af]">ID: BLC-CN-2024</span>
          </div>

          <div class="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">ENCAISSÉ</div>
              <div class="text-[18px] font-bold text-[#1a1e2e]">284 000 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></div>
            </div>
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">ENVOYÉ</div>
              <div class="text-[18px] font-bold text-[#e85d2f]">196 000 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></div>
            </div>
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">EN TRANSIT</div>
              <div class="text-[16px] font-semibold text-[#1a1e2e]">48 000 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></div>
            </div>
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">DISPONIBLE</div>
              <div class="rounded-lg px-3 py-1.5 inline-block" style="background: #f8f7f5;">
                <span class="text-[16px] font-bold text-[#1a1e2e]">84 320 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-black/[0.06] mb-3">
            <span class="text-[12px] text-[#6b7280]">Total Facturé: 312 000 USD</span>
            <span class="text-[12px] font-semibold text-[#e85d2f]">Créances: 28 000 USD</span>
          </div>

          <button class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-medium text-[#6b7280] transition-colors hover:bg-gray-100"
                  style="background: #f0edf8; color: #5b21b6;">
            Enregistrer un confié
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </button>
        </div>

        <!-- Balance Cargo Dubaï -->
        <div class="bg-white rounded-xl border border-black/[0.07] p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded"
                    style="background: #1a1e2e; color: #ffffff;">DUBAÏ</span>
              <span class="text-[14px] font-bold text-[#1a1e2e]">Balance Cargo Dubaï</span>
            </div>
            <span class="text-[10px] text-[#9ca3af]">ID: BLC-DXB-2024</span>
          </div>

          <div class="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">ENCAISSÉ</div>
              <div class="text-[18px] font-bold text-[#1a1e2e]">89 200 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></div>
            </div>
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">ENVOYÉ</div>
              <div class="text-[18px] font-bold text-[#9ca3af]">52 000 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></div>
            </div>
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">EN TRANSIT</div>
              <div class="text-[16px] font-semibold text-[#1a1e2e]">6 120 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></div>
            </div>
            <div>
              <div class="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af] mb-0.5">DISPONIBLE</div>
              <div class="rounded-lg px-3 py-1.5 inline-block" style="background: #f8f7f5;">
                <span class="text-[16px] font-bold text-[#1a1e2e]">31 080 <span class="text-[12px] font-normal text-[#9ca3af]">USD</span></span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-black/[0.06] mb-3">
            <span class="text-[12px] text-[#6b7280]">Total Facturé: 94 400 USD</span>
            <span class="text-[12px] font-semibold text-[#e85d2f]">Créances: 5 200 USD</span>
          </div>

          <button class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-gray-100"
                  style="background: #f0edf8; color: #5b21b6;">
            Enregistrer un confié
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════
           SECTION : KPI Cards
      ════════════════════════════════════════════════════ -->
      @if (facade.kpis(); as kpis) {
        <div class="grid grid-cols-4 gap-4 mb-6">

          <!-- Conteneurs actifs -->
          <div class="bg-white rounded-xl border border-black/[0.07] p-4">
            <div class="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] mb-2">
              CONTENEURS ACTIFS
            </div>
            <div class="text-[36px] font-bold text-[#1a1e2e] leading-none mb-3">{{ kpis.conteneursActifs }}</div>
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" style="background: #f59e0b;"></span>
                  <span class="text-[11px] text-[#6b7280]">Prêt à sortir</span>
                </div>
                <span class="text-[11px] font-semibold text-[#1a1e2e]">{{ kpis.pretASortir }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" style="background: #3b82f6;"></span>
                  <span class="text-[11px] text-[#6b7280]">Cargo arrivé</span>
                </div>
                <span class="text-[11px] font-semibold text-[#1a1e2e]">{{ kpis.cargoArrive }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" style="background: #d1d5db;"></span>
                  <span class="text-[11px] text-[#6b7280]">Créés</span>
                </div>
                <span class="text-[11px] font-semibold text-[#1a1e2e]">{{ kpis.crees }}</span>
              </div>
            </div>
          </div>

          <!-- Créances ouvertes -->
          <div class="bg-white rounded-xl border border-black/[0.07] p-4">
            <div class="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] mb-2">
              CRÉANCES OUVERTES
            </div>
            <div class="text-[36px] font-bold leading-none mb-1" style="color: #e85d2f;">
              {{ kpis.creancesOuvertes }} <span class="text-[16px] font-semibold">clients</span>
            </div>
            <div class="text-[12px] text-[#6b7280] mb-1">{{ kpis.creancesClients | number:'1.0-0' }} USD</div>
            <div class="text-[12px] text-[#6b7280] mb-3">195 000 000 GNF</div>
            <div class="flex items-center gap-1.5 px-2 py-1.5 rounded-md" style="background: #fef2f2;">
              <span class="text-[#ef4444] text-[11px]">!</span>
              <span class="text-[11px] font-medium text-[#ef4444]">3 en retard &gt; 30 jours</span>
            </div>
          </div>

          <!-- Marge brute GNF -->
          <div class="bg-white rounded-xl border border-black/[0.07] p-4">
            <div class="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] mb-2">
              MARGE BRUTE GNF
            </div>
            <div class="text-[30px] font-bold text-[#1a1e2e] leading-none mb-1">
              48 <span class="text-[18px]">000</span> <span class="text-[18px]">000</span>
            </div>
            <div class="text-[11px] text-[#6b7280] mb-3">Cumul mensuel estimé</div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-[#6b7280]">Marge moy. : 31%</span>
              <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background: #e5e7eb;">
                <div class="h-full rounded-full" style="width: 31%; background: #3b82f6;"></div>
              </div>
            </div>
          </div>

          <!-- Transitaires non soldés -->
          <div class="bg-white rounded-xl border border-black/[0.07] p-4">
            <div class="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] mb-2">
              TRANSITAIRES NON SOLDÉS
            </div>
            <div class="text-[36px] font-bold leading-none mb-2" style="color: #f59e0b;">
              {{ kpis.transitairesNonSoldes }}
            </div>
            <div class="text-[13px] font-semibold text-[#1a1e2e] mb-1">38 500 000 GNF dus</div>
            <div class="text-[11px] text-[#9ca3af]">À régler avant fin de semaine</div>
          </div>
        </div>
      }

      <!-- ═══════════════════════════════════════════════════
           SECTION : Conteneurs Récents
      ════════════════════════════════════════════════════ -->
      <div class="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div class="px-5 py-4 border-b border-black/[0.06]">
          <h2 class="text-[15px] font-bold text-[#1a1e2e]">Conteneurs Récents</h2>
        </div>
        <table class="w-full border-collapse">
          <thead>
            <tr style="background: #fafaf9;">
              <th class="text-left px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-black/[0.06]">CONTENEUR / B/L</th>
              <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-black/[0.06]">TYPE</th>
              <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-black/[0.06]">ORIGINE</th>
              <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-black/[0.06]">STATUT</th>
              <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-black/[0.06]">CLIENT(S)</th>
              <th class="text-right px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-black/[0.06]">FRET USD</th>
            </tr>
          </thead>
          <tbody>
            @for (c of facade.recentConteneurs(); track c.id; let last = $last) {
              <tr class="hover:bg-[#fafaf9] transition-colors" [class.border-b]="!last"
                  style="border-color: rgba(0,0,0,0.05);">
                <!-- Conteneur / BL -->
                <td class="px-5 py-3">
                  <div class="text-[13px] font-semibold text-[#1a1e2e]">{{ c.reference }}</div>
                  <div class="text-[11px] text-[#9ca3af]">BL: {{ c.bl }}</div>
                </td>
                <!-- Type -->
                <td class="px-4 py-3">
                  <span class="text-[11px] font-medium px-2.5 py-1 rounded"
                        style="background: #f3f4f6; color: #374151;">{{ c.type }}</span>
                </td>
                <!-- Origine -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                    <span class="text-[12px] text-[#374151]">{{ c.origine }}</span>
                  </div>
                </td>
                <!-- Statut -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full flex-shrink-0" [class]="statutDotClass(c.statut)"></span>
                    <span class="text-[12px]" [class]="statutTextClass(c.statut)">{{ statutLabel(c.statut) }}</span>
                  </div>
                </td>
                <!-- Client -->
                <td class="px-4 py-3">
                  <div class="text-[12px] font-medium text-[#1a1e2e]">{{ c.clients[0] }}</div>
                  @if (c.clients.length > 1) {
                    <div class="text-[10px] text-[#9ca3af]">{{ c.clients[1] }}</div>
                  }
                </td>
                <!-- Fret USD -->
                <td class="px-5 py-3 text-right">
                  <div class="text-[13px] font-bold text-[#1a1e2e]">{{ c.fretUsd | number:'1.0-0' }}</div>
                  @if (c.solde) {
                    <div class="text-[10px] font-bold" style="color: #e85d2f;">SOLDÉ</div>
                  } @else if (c.reste) {
                    <div class="text-[10px] font-bold text-[#ef4444]">RESTE: {{ c.reste | number:'1.0-0' }}</div>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  readonly facade = inject(DashboardFacade);

  ngOnInit(): void { this.facade.loadDashboard(); }

  statutLabel(s: ConteneurStatut): string {
    const m: Record<ConteneurStatut, string> = {
      CREE: 'Créé', EN_TRANSIT: 'En transit',
      ARRIVE: 'Arrivé', PRET_A_SORTIR: 'Prêt à sortir', SORTI: 'Sorti',
    };
    return m[s] ?? s;
  }

  statutDotClass(s: ConteneurStatut): string {
    const m: Record<ConteneurStatut, string> = {
      CREE: 'bg-gray-300',
      EN_TRANSIT: 'bg-blue-400',
      ARRIVE: 'bg-blue-500',
      PRET_A_SORTIR: 'bg-amber-400',
      SORTI: 'bg-amber-500',
    };
    return m[s] ?? 'bg-gray-300';
  }

  statutTextClass(s: ConteneurStatut): string {
    const m: Record<ConteneurStatut, string> = {
      CREE: 'text-gray-400',
      EN_TRANSIT: 'text-blue-500',
      ARRIVE: 'text-blue-600',
      PRET_A_SORTIR: 'text-amber-500',
      SORTI: 'text-amber-600',
    };
    return m[s] ?? 'text-gray-400';
  }
}
