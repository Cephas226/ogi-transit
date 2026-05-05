import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'dark' | 'muted';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padded = true;
  @Input() extraClass = '';

  get computedClass(): string {
    return [
      'rounded-2xl border shadow-card',
      this.variantClass,
      this.padded ? 'p-5' : '',
      this.extraClass,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private get variantClass(): string {
    const map: Record<CardVariant, string> = {
      default: 'bg-surface border-black/[0.07]',
      dark:    'bg-sidebar border-sidebar text-white',
      muted:   'bg-surface-muted border-black/[0.07]',
    };
    return map[this.variant];
  }
}
