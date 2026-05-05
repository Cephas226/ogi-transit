import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen overflow-hidden bg-[#f0ede8]">
      <app-sidebar />

      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <header class="h-12 bg-white border-b border-black/8 flex items-center
                       px-4 gap-3 flex-shrink-0">
          <span class="text-[13px] text-[#6b7280]">{{ pageTitle() }}</span>
          <div class="flex-1"></div>
          @if (topbarAction()) {
            <button
              class="px-3 py-1.5 bg-[#e85d2f] text-white rounded-md text-[11px]
                     font-medium hover:bg-[#d44e22] transition-colors"
            >
              {{ topbarAction() }}
            </button>
          }
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-4">
          <router-outlet />
        </main>
      </div>

      <!-- Notification toasts -->
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
        @for (notif of notifications(); track notif.id) {
          <div
            class="flex items-start gap-2.5 p-3 rounded-lg shadow-lg text-sm
                   border transition-all animate-in slide-in-from-right-2"
            [class]="notifClass(notif.type)"
          >
            <span class="text-base flex-shrink-0">{{ notifIcon(notif.type) }}</span>
            <span class="text-[12px] flex-1">{{ notif.message }}</span>
            <button
              (click)="dismissNotif(notif.id)"
              class="text-current opacity-50 hover:opacity-100 flex-shrink-0"
            >
              ×
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly notifications = this.notificationService.notifications;

  private readonly routerEvents = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
  );

  readonly pageTitle = computed(() => {
    this.routerEvents();
    return this.getPageTitle(this.router.url);
  });

  readonly topbarAction = computed(() => {
    this.routerEvents();
    return this.getTopbarAction(this.router.url);
  });

  dismissNotif(id: string): void {
    this.notificationService.dismiss(id);
  }

  notifClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
    return map[type] ?? map['info'];
  }

  notifIcon(type: string): string {
    const map: Record<string, string> = {
      success: '✓',
      error: '⚠',
      warning: '⚡',
      info: 'ℹ',
    };
    return map[type] ?? 'ℹ';
  }

  private getPageTitle(url: string): string {
    const titles: Record<string, string> = {
      '/dashboard': 'Tableau de bord',
      '/conteneurs': 'Conteneurs',
      '/clients': 'Clients',
      '/factures': 'Factures Client',
      '/fournisseurs': 'Fournisseurs',
      '/caisses': 'Caisses & Trésorerie',
      '/decaissements': 'Décaissements',
      '/notes-de-frais': 'Notes de frais',
      '/rapports': 'Rapports',
    };
    const base = '/' + url.split('/')[1];
    return titles[base] ?? 'OGI Transit';
  }

  private getTopbarAction(url: string): string | null {
    const actions: Record<string, string> = {
      '/dashboard': '+ Nouveau conteneur',
      '/conteneurs': '+ Nouveau conteneur',
      '/clients': '+ Nouveau client',
      '/factures': '+ Nouvelle facture',
      '/fournisseurs': '+ Nouveau fournisseur',
      '/caisses': '+ Enregistrer un confié',
      '/decaissements': '+ Nouvelle facture fournisseur',
    };
    const base = '/' + url.split('/')[1];
    return actions[base] ?? null;
  }
}
