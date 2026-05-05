import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="computedClass">
      @if (dot) {
        <span class="status-dot" [class]="dotColorClass"></span>
      }
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() dot = false;

  get computedClass(): string {
    return ['badge', this.variantClass].join(' ');
  }

  private get variantClass(): string {
    const map: Record<BadgeVariant, string> = {
      success: 'badge-success',
      warning: 'badge-warning',
      danger:  'badge-danger',
      info:    'badge-info',
      neutral: 'badge-neutral',
      primary: 'badge-primary',
    };
    return map[this.variant];
  }

  get dotColorClass(): string {
    const map: Record<BadgeVariant, string> = {
      success: 'bg-success',
      warning: 'bg-warning',
      danger:  'bg-danger',
      info:    'bg-info',
      neutral: 'bg-ink-disabled',
      primary: 'bg-primary',
    };
    return map[this.variant];
  }
}
