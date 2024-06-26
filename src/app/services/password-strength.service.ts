import { Injectable, computed, inject } from '@angular/core';
import { PasswordStrength } from '../types/password-strength.enum';
import { PasswordEntropyService } from './password-entropy.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordStrengthService {
  readonly #entropy = inject(PasswordEntropyService);

  /**
   * Compute password strength level from bits of entropy.
   * @link https://nordvpn.com/blog/what-is-password-entropy/
   */
  public passwordStrength = computed(() => {
    const entropy = this.#entropy.passwordEntropy();

    if (entropy === 0) return PasswordStrength.LEVEL_0;
    if (entropy < 36) return PasswordStrength.LEVEL_1;
    if (entropy < 60) return PasswordStrength.LEVEL_2;
    if (entropy < 90) return PasswordStrength.LEVEL_3;
    return PasswordStrength.LEVEL_4;
  });
}
