import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-empty-state',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div class="w-12 h-12 rounded-2xl bg-surface-subtle flex items-center justify-center mb-4">
        <svg
          class="w-6 h-6 text-ink-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="iconPath" />
        </svg>
      </div>
      <p class="text-md font-semibold text-ink mb-1">{{ title }}</p>
      @if (description) {
        <p class="text-sm text-ink-muted max-w-xs">{{ description }}</p>
      }
      @if (actionLabel) {
        <button class="btn btn-primary btn-sm mt-4" (click)="onAction()">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'Aucun résultat';
  @Input() description = '';
  @Input() actionLabel = '';
  @Input() iconPath = 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4';

  onAction(): void {}
}
