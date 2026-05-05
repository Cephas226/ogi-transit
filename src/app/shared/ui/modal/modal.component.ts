import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        (click)="onBackdropClick()"
        aria-hidden="true"
      ></div>

      <!-- Panel -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title"
      >
        <div
          class="relative flex flex-col bg-surface shadow-modal rounded-2xl w-full overflow-hidden"
          [class]="sizeClass"
          style="max-height: 90vh"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          @if (title) {
            <div class="flex items-start justify-between px-6 py-4 border-b border-black/[0.07] shrink-0">
              <div>
                <h2 class="text-md font-bold text-ink">{{ title }}</h2>
                @if (subtitle) {
                  <p class="text-xs text-ink-muted mt-0.5">{{ subtitle }}</p>
                }
              </div>
              <button
                type="button"
                (click)="close()"
                class="text-ink-muted hover:text-ink transition-colors ml-4 shrink-0 mt-0.5"
                aria-label="Fermer"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          }

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <ng-content />
          </div>

          <!-- Footer -->
          <ng-content select="[footer]" />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  get sizeClass(): string {
    const map: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };
    return map[this.size];
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
