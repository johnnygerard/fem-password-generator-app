import { ChangeDetectionStrategy, Component, HostBinding, input, model, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-range-control',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './range-control.component.html',
  styleUrl: './range-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeControlComponent {
  min = input.required({ transform: numberAttribute });
  max = input.required({ transform: numberAttribute });
  value = model.required<number>();

  @HostBinding('style.--progress-percentage.%')
  get progressPercentage(): number {
    return this.value() / this.max() * 100;
  }
}
