import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { PasswordStrengthService } from '../services/password-strength.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-strength-meter',
  standalone: true,
  imports: [NgFor],
  templateUrl: './strength-meter.component.html',
  styleUrl: './strength-meter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrengthMeterComponent {
  readonly #strengthService = inject(PasswordStrengthService);
  readonly ariaValueText = computed(() =>
    this.passwordStrength() === 0 ? 'No password' : this.strengthMeterLabel(),
  );
  readonly passwordStrength = this.#strengthService.passwordStrength;
  readonly strengthMeterLabel = computed(
    () => this.strengthMeterLabels[this.passwordStrength()],
  );
  readonly strengthMeterLabels = ['', 'too weak!', 'weak', 'medium', 'strong'];
}
