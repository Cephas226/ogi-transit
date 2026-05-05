import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label) {
        <label class="field-label">
          {{ label }}
          @if (required) { <span class="text-danger ml-0.5">*</span> }
          @if (optional) { <span class="text-ink-disabled font-normal normal-case ml-1">(optionnel)</span> }
        </label>
      }

      <div class="relative">
        @if (prefixIcon) {
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
            <ng-content select="[prefix]" />
          </span>
        }

        <input
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="isDisabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class]="inputClass"
        />

        @if (suffixIcon) {
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
            <ng-content select="[suffix]" />
          </span>
        }
      </div>

      @if (error) {
        <p class="text-2xs text-danger flex items-center gap-1">
          <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ error }}
        </p>
      } @else if (hint) {
        <p class="text-2xs text-ink-muted">{{ hint }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'date' = 'text';
  @Input() error = '';
  @Input() hint = '';
  @Input() required = false;
  @Input() optional = false;
  @Input() prefixIcon = false;
  @Input() suffixIcon = false;
  @Input() set value(val: string) { this._value = val; }
  get value(): string { return this._value; }

  private _value = '';
  isDisabled = false;

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  get inputClass(): string {
    return [
      'field-input',
      this.prefixIcon ? 'pl-9' : '',
      this.suffixIcon ? 'pr-9' : '',
      this.error ? 'field-input-error' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this._value = val;
    this.onChange(val);
  }

  writeValue(val: string): void     { this._value = val ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void          { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void        { this.isDisabled = disabled; }
}
