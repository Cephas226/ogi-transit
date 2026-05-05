import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen overflow-hidden bg-[#f0ede8]">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="h-12 bg-white border-b border-black/8 flex items-center px-4 gap-3 flex-shrink-0">
          <span class="text-[13px] text-[#6b7280]">{{ pageTitle() }}</span>
          <div class="flex-1"></div>
          @if (topbarAction()) {
            <button class="px-3 py-1.5 bg-[#e85d2f] text-white rounded-md text-[11px] font-medium hover:bg-[#d44e22] transition-colors">
              {{ topbarAction() }}
            </button>
          }
        </header>
        <main class="flex-1 overflow-y-auto p-4"><router-outlet /></main>
      </div>

      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 pointer-events-none">
        @for (n of notifications(); track n.id) {
          <div class="flex items-start gap-2.5 p-3 rounded-lg border text-sm pointer-events-auto" [class]="notifClass(n.type)">
            <span class="text-base flex-shrink-0">{{ notifIcon(n.type) }}</span>
            <span class="text-[12px] flex-1">{{ n.message }}</span>
            <button (click)="dismiss(n.id)" class="text-current opacity-50 hover:opacity-100 flex-shrink-0">×</button>
          </div>
        }
      </div>
    </div>
  `,
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationService.notifications;

  private readonly navEnd = toSignal(
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)),
  );

  readonly pageTitle = computed(() => {
    this.navEnd();
    const titles: Record<string, string> = {
      '/dashboard': 'Tableau de bord', '/conteneurs': 'Conteneurs',
      '/clients': 'Clients', '/factures': 'Factures Client',
      '/fournisseurs': 'Fournisseurs', '/caisses': 'Caisses & Trésorerie',
      '/decaissements': 'Décaissements', '/notes-de-frais': 'Notes de frais',
      '/rapports': 'Rapports',
    };
    const base = '/' + this.router.url.split('/')[1];
    return titles[base] ?? 'OGI Transit';
  });

  readonly topbarAction = computed(() => {
    this.navEnd();
    const actions: Record<string, string> = {
      '/dashboard': '+ Nouveau conteneur', '/conteneurs': '+ Nouveau conteneur',
      '/clients': '+ Nouveau client', '/factures': '+ Nouvelle facture',
      '/fournisseurs': '+ Nouveau fournisseur', '/caisses': '+ Enregistrer un confié',
      '/decaissements': '+ Nouvelle facture fournisseur',
    };
    const base = '/' + this.router.url.split('/')[1];
    return actions[base] ?? null;
  });

  dismiss(id: string): void { this.notificationService.dismiss(id); }

  notifClass(type: string): string {
    const m: Record<string, string> = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error:   'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info:    'bg-blue-50 border-blue-200 text-blue-800',
    };
    return m[type] ?? m['info'];
  }

  notifIcon(type: string): string {
    const m: Record<string, string> = { success: '✓', error: '⚠', warning: '⚡', info: 'ℹ' };
    return m[type] ?? 'ℹ';
  }
}
