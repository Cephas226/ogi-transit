import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="computedClass"
      (click)="clicked.emit($event)"
    >
      @if (loading) {
        <svg
          class="animate-spin shrink-0"
          [class]="iconSizeClass"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      } @else if (iconLeft) {
        <span class="shrink-0" [innerHTML]="iconLeft"></span>
      }

      @if (label) {
        <span>{{ label }}</span>
      } @else {
        <ng-content />
      }

      @if (iconRight && !loading) {
        <span class="shrink-0" [innerHTML]="iconRight"></span>
      }
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() label = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() iconLeft = '';
  @Input() iconRight = '';

  @Output() clicked = new EventEmitter<MouseEvent>();

  get computedClass(): string {
    return [
      'btn',
      this.sizeClass,
      this.variantClass,
      this.fullWidth ? 'w-full' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private get sizeClass(): string {
    const map: Record<ButtonSize, string> = {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    };
    return map[this.size];
  }

  private get variantClass(): string {
    const map: Record<ButtonVariant, string> = {
      primary:   'btn-primary',
      secondary: 'btn-secondary',
      ghost:     'btn-ghost',
      danger:    'btn-danger',
    };
    return map[this.variant];
  }

  get iconSizeClass(): string {
    const map: Record<ButtonSize, string> = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };
    return map[this.size];
  }
}
