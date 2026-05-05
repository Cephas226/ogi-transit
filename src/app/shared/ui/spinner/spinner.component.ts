import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClass">
      <svg
        [class]="svgClass"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Chargement..."
        role="status"
      >
        <circle
          class="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      @if (label) {
        <span class="text-sm text-ink-muted">{{ label }}</span>
      }
    </div>
  `,
})
export class SpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() label = '';
  @Input() centered = true;

  get wrapperClass(): string {
    return [
      'flex items-center gap-2',
      this.centered ? 'justify-center' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get svgClass(): string {
    const sizeMap: Record<SpinnerSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-7 h-7',
    };
    return `animate-spin text-ink-muted ${sizeMap[this.size]}`;
  }
}
