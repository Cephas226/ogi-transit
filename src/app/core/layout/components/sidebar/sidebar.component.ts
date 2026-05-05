import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/services/auth.service';
import { ROLE_LABELS } from '@core/auth/models/auth.models';

interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="w-[200px] bg-[#1a1e2e] flex flex-col h-full flex-shrink-0">
      <!-- Brand -->
      <div class="px-3.5 py-4 border-b border-white/8 flex items-center gap-2">
        <div class="w-7 h-7 bg-[#e85d2f] rounded-[6px] flex items-center justify-center
                    text-white font-bold text-[11px] flex-shrink-0">
          OT
        </div>
        <div>
          <div class="text-white text-[13px] font-semibold leading-tight">OGI Transit</div>
          <div class="text-white/35 text-[9px] tracking-widest uppercase">Logistics Command</div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-2 overflow-y-auto">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-[#e85d2f] !text-white"
            class="flex items-center gap-2 px-3.5 py-[7px] text-white/55
                   text-[12px] hover:bg-white/6 hover:text-white/85
                   transition-colors duration-150 cursor-pointer"
          >
            <span class="w-[14px] text-center text-[12px] flex-shrink-0"
                  [innerHTML]="item.icon"></span>
            {{ item.label }}
            @if (item.badge) {
              <span class="ml-auto text-[9px] px-1.5 py-0.5 bg-red-500
                           text-white rounded-full">
                {{ item.badge }}
              </span>
            }
          </a>
        }
      </nav>

      <!-- User footer -->
      <div class="px-3.5 py-2.5 border-t border-white/8 flex items-center gap-2">
        <div class="w-7 h-7 rounded-full bg-[#e85d2f] flex items-center justify-center
                    text-white text-[10px] font-semibold flex-shrink-0">
          {{ user()?.initials ?? '??' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-white text-[11px] font-medium truncate">
            {{ user()?.firstName }} {{ user()?.lastName }}
          </div>
          <div class="text-white/40 text-[10px]">
            {{ roleLabel() }}
          </div>
        </div>
        <button
          (click)="logout()"
          title="Déconnexion"
          class="text-white/30 hover:text-white/70 transition-colors ml-auto"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7
                     a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;

  readonly roleLabel = () => {
    const role = this.authService.currentRole();
    return role ? ROLE_LABELS[role] : '';
  };

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', route: '/dashboard', icon: '⊞' },
    { label: 'Conteneurs', route: '/conteneurs', icon: '◫' },
    { label: 'Clients', route: '/clients', icon: '◎' },
    { label: 'Factures Client', route: '/factures', icon: '≡' },
    { label: 'Fournisseurs', route: '/fournisseurs', icon: '◉' },
    { label: 'Caisses & Trésorerie', route: '/caisses', icon: '⬡' },
    { label: 'Factures Fournisseur', route: '/decaissements', icon: '↗' },
    { label: 'Notes de frais', route: '/notes-de-frais', icon: '✎' },
    { label: 'Rapports', route: '/rapports', icon: '◈' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
