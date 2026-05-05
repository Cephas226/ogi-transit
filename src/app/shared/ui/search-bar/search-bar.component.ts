import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex items-center">
      <svg
        class="absolute left-3 w-3.5 h-3.5 text-ink-muted pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>

      <input
        type="text"
        [placeholder]="placeholder"
        [(ngModel)]="query"
        (ngModelChange)="onSearch($event)"
        class="field-input pl-9 pr-8"
        [class.pr-8]="query"
      />

      @if (query) {
        <button
          type="button"
          (click)="clear()"
          class="absolute right-3 text-ink-muted hover:text-ink transition-colors"
          aria-label="Effacer"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      }
    </div>
  `,
})
export class SearchBarComponent {
  @Input() placeholder = 'Rechercher...';
  @Input() set value(v: string) { this.query = v; }

  @Output() search = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  query = '';

  onSearch(value: string): void {
    this.search.emit(value);
  }

  clear(): void {
    this.query = '';
    this.search.emit('');
    this.cleared.emit();
  }
}
