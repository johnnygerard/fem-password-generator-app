import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, model } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly value = model(false);
  onChange = (_value: boolean) => { };
  onTouched = () => { };

  onBlur(): void {
    this.onTouched();
  }

  onValueChange(): void {
    this.onChange(this.value());
  }

  writeValue(value: boolean): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
