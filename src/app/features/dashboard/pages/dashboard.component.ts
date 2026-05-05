import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFacade } from '../services/dashboard.facade';
import { ConteneurStatut } from '../models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (facade.isLoading()) {
      <div class="flex items-center justify-center h-48">
        <div class="text-sm text-gray-400">Chargement...</div>
      </div>
    }

    @if (facade.error()) {
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ facade.error() }}
      </div>
    }

    @if (!facade.isLoading() && !facade.error()) {
      <!-- Caisses -->
      <div class="grid grid-cols-4 gap-2.5 mb-4">
        @for (caisse of facade.caisses(); track caisse.id) {
          <div
            class="rounded-xl border p-3"
            [class]="caisse.id === 'usd-cn'
              ? 'bg-[#1a1e2e] border-[#1a1e2e]'
              : 'bg-white border-black/8'"
          >
            <div class="text-[10px] uppercase tracking-wider mb-1"
                 [class]="caisse.id === 'usd-cn' ? 'text-white/45' : 'text-gray-400'">
              {{ caisse.label }}
            </div>
            <div class="text-xl font-semibold leading-tight"
                 [class]="caisse.id === 'usd-cn' ? 'text-white' : 'text-[#1a1e2e]'">
              {{ formatAmount(caisse.available, caisse.currency) }}
            </div>
            <div class="text-[10px] mt-1"
                 [class]="caisse.id === 'usd-cn' ? 'text-[#e85d2f]' : 'text-gray-400'">
              {{ caisse.currency }} disponible
              @if (caisse.trend) {
                <span class="text-green-500 ml-1">+{{ caisse.trend }}%</span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Cargo Balances -->
      <div class="flex items-center justify-between mb-2.5">
        <h2 class="text-[13px] font-semibold text-[#1a1e2e]">Balances Cargo</h2>
        <span class="text-[10px] text-gray-400">● Visible Gérant / PDG</span>
      </div>
      <div class="grid grid-cols-2 gap-2.5 mb-4">
        @for (balance of facade.cargoBalances(); track balance.id) {
          <div class="bg-white rounded-xl border border-black/8 p-3.5">
            <span class="inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded mb-2"
                  [class]="balance.region === 'CHINE'
                    ? 'bg-[#e8f5ee] text-[#166534]'
                    : 'bg-[#fef3c7] text-[#92400e]'">
              {{ balance.region }}
            </span>
            <div class="text-[12px] font-semibold text-[#1a1e2e] mb-2">
              {{ balance.label }}
              <span class="text-[9px] text-gray-400 ml-1">ID: {{ balance.id }}</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 mb-2">
              <div>
                <div class="text-[9px] text-gray-400">ENCAISSÉ</div>
                <div class="text-[14px] font-semibold">{{ balance.encaisse | number:'1.0-0' }} USD</div>
              </div>
              <div>
                <div class="text-[9px] text-gray-400">ENVOYÉ</div>
                <div class="text-[14px] font-semibold">{{ balance.envoye | number:'1.0-0' }} USD</div>
              </div>
              <div>
                <div class="text-[9px] text-gray-400">EN TRANSIT</div>
                <div class="text-[12px] font-medium text-amber-500">{{ balance.enTransit | number:'1.0-0' }} USD</div>
              </div>
              <div>
                <div class="text-[9px] text-gray-400">DISPONIBLE</div>
                <div class="text-[12px] font-semibold text-green-600">{{ balance.disponible | number:'1.0-0' }} USD</div>
              </div>
            </div>
            <div class="text-[10px] text-gray-400">
              Total Facturé: {{ balance.totalFacture | number:'1.0-0' }} USD ·
              Créances: {{ balance.creances | number:'1.0-0' }} USD
            </div>
          </div>
        }
      </div>

      <!-- KPIs -->
      @if (facade.kpis(); as kpis) {
        <div class="grid grid-cols-4 gap-2.5 mb-4">
          <div class="bg-white rounded-xl border border-black/8 p-3">
            <div class="text-[22px] font-bold text-blue-500">{{ kpis.conteneursActifs }}</div>
            <div class="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">Conteneurs actifs</div>
            <div class="text-[10px] text-gray-400 mt-1.5">
              ● Prêt à sortir: {{ kpis.pretASortir }}
              &nbsp;● Arrivé: {{ kpis.cargoArrive }}
              &nbsp;● Créés: {{ kpis.crees }}
            </div>
          </div>
          <div class="bg-white rounded-xl border border-black/8 p-3">
            <div class="text-[22px] font-bold text-red-500">{{ kpis.creancesOuvertes }}</div>
            <div class="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">Créances ouvertes</div>
            <div class="text-[10px] text-gray-400 mt-1.5">
              {{ kpis.creancesClients | number:'1.0-0' }} USD<br>
              <span class="text-red-500">⚠ 3 en retard &gt;30 jours</span>
            </div>
          </div>
          <div class="bg-white rounded-xl border border-black/8 p-3">
            <div class="text-[22px] font-bold text-green-500">48 M</div>
            <div class="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">Marge brute GNF</div>
            <div class="text-[10px] text-gray-400 mt-1.5">Marge moy. {{ kpis.margePct }}%</div>
          </div>
          <div class="bg-white rounded-xl border border-black/8 p-3">
            <div class="text-[22px] font-bold text-amber-500">{{ kpis.transitairesNonSoldes }}</div>
            <div class="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">Transitaires non soldés</div>
            <div class="text-[10px] text-red-500 mt-1.5">
              {{ kpis.transitaireDus | number:'1.0-0' }} GNF dus
            </div>
          </div>
        </div>
      }

      <!-- Recent containers table -->
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-[13px] font-semibold text-[#1a1e2e]">Conteneurs récents</h2>
      </div>
      <div class="bg-white rounded-xl border border-black/8 overflow-hidden">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-[#f0ede8]">
              <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-medium border-b border-black/8">Conteneur / B/L</th>
              <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-medium border-b border-black/8">Type</th>
              <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-medium border-b border-black/8">Origine</th>
              <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-medium border-b border-black/8">Statut</th>
              <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-medium border-b border-black/8">Client(s)</th>
              <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-medium border-b border-black/8">Fret USD</th>
            </tr>
          </thead>
          <tbody>
            @for (c of facade.recentConteneurs(); track c.id; let last = $last) {
              <tr class="hover:bg-black/[0.015] transition-colors"
                  [class.border-b]="!last" [class.border-black/8]="!last">
                <td class="px-3 py-2">
                  <div class="text-[12px] font-medium">{{ c.reference }}</div>
                  <div class="text-[10px] text-gray-400">BL: {{ c.bl }}</div>
                </td>
                <td class="px-3 py-2 text-[11px]">{{ c.type }}</td>
                <td class="px-3 py-2 text-[11px]">{{ c.origine }}</td>
                <td class="px-3 py-2">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        [class]="statutClass(c.statut)">
                    {{ statutLabel(c.statut) }}
                  </span>
                </td>
                <td class="px-3 py-2 text-[11px]">{{ c.clients[0] }}</td>
                <td class="px-3 py-2">
                  <div class="text-[11px]">{{ c.fretUsd | number:'1.0-0' }}</div>
                  @if (c.solde) {
                    <div class="text-[9px] text-green-600 font-medium">SOLDÉ</div>
                  } @else if (c.reste) {
                    <div class="text-[9px] text-red-500">RESTE: {{ c.reste | number:'1.0-0' }}</div>
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

  ngOnInit(): void {
    this.facade.loadDashboard();
  }

  formatAmount(value: number, currency: 'USD' | 'GNF'): string {
    if (currency === 'GNF') {
      return (value / 1000000).toFixed(0) + ' 000 000';
    }
    const parts = value.toString().split('');
    return value.toLocaleString('fr-FR').replace(/,/g, ' ') + ' ' + currency;
  }

  statutLabel(statut: ConteneurStatut): string {
    const map: Record<ConteneurStatut, string> = {
      CREE: 'Créé',
      EN_TRANSIT: 'En transit',
      ARRIVE: 'Arrivé',
      PRET_A_SORTIR: 'Prêt à sortir',
      SORTI: 'Sorti',
    };
    return map[statut] ?? statut;
  }

  statutClass(statut: ConteneurStatut): string {
    const map: Record<ConteneurStatut, string> = {
      CREE: 'bg-indigo-100 text-indigo-700',
      EN_TRANSIT: 'bg-blue-100 text-blue-700',
      ARRIVE: 'bg-green-100 text-green-700',
      PRET_A_SORTIR: 'bg-yellow-100 text-yellow-700',
      SORTI: 'bg-gray-100 text-gray-600',
    };
    return map[statut] ?? 'bg-gray-100 text-gray-600';
  }
}
