import { ChangeDetectionStrategy, Component, HostBinding, input, model, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent {
  min = input.required({ transform: numberAttribute });
  max = input.required({ transform: numberAttribute });
  value = model.required<number>();

  @HostBinding('style.--progress-percentage.%')
  get progressPercentage(): number {
    return this.value() / this.max() * 100;
  }
}
