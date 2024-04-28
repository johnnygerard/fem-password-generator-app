import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SliderComponent,
      multi: true,
    },
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements ControlValueAccessor {
  labelId = input<string>();
  min = input.required({ transform: numberAttribute });
  max = input.required({ transform: numberAttribute });
  value = model<number | null>(null);
  onChange = (_value: number) => {};
  onTouched = () => {};

  @HostBinding('style.--progress-percentage.%')
  get progressPercentage(): number {
    const value = this.value();
    return value === null ? 0 : (value / this.max()) * 100;
  }

  onBlur(): void {
    this.onTouched();
  }

  onInput(): void {
    this.onChange(this.value()!);
  }

  writeValue(value: number): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
