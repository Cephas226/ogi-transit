import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatCardColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'ui-stat-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 flex flex-col gap-1.5">
      @if (label) {
        <p class="text-2xs font-semibold uppercase tracking-wider text-ink-muted">
          {{ label }}
        </p>
      }

      <div class="flex items-baseline gap-1.5">
        <span class="text-4xl font-bold leading-none" [class]="valueColorClass">
          {{ value }}
        </span>
        @if (unit) {
          <span class="text-md font-semibold text-ink-secondary">{{ unit }}</span>
        }
      </div>

      @if (subLabel) {
        <p class="text-xs text-ink-muted">{{ subLabel }}</p>
      }

      <ng-content />
    </div>
  `,
})
export class StatCardComponent {
  @Input({ required: true }) value!: string | number;
  @Input() label = '';
  @Input() unit = '';
  @Input() subLabel = '';
  @Input() color: StatCardColor = 'default';

  get valueColorClass(): string {
    const map: Record<StatCardColor, string> = {
      default: 'text-ink',
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      danger:  'text-danger',
      info:    'text-info',
    };
    return map[this.color];
  }
}
