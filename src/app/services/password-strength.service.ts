import { Injectable, computed } from '@angular/core';
import { PasswordConfigService } from './password-config.service';
import { PasswordStrength } from '../types/password-strength.enum';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {
  /**
   * Compute password strength level from bits of entropy.
   * @link https://nordvpn.com/blog/what-is-password-entropy/
   */
  public passwordStrength = computed(() => {
    const entropy = this.#passwordEntropy();

    if (entropy < 36) return PasswordStrength.LEVEL_1;
    if (entropy < 60) return PasswordStrength.LEVEL_2;
    if (entropy < 90) return PasswordStrength.LEVEL_3;
    return PasswordStrength.LEVEL_4;
  });

  #passwordEntropy = computed(() => {
    const pwdLength = this._config.pwdLength();
    const charsetSize = Object.values(this._config.pwdCharsets)
      .filter(charset => charset.isIncluded())
      .reduce((acc, charset) => acc + charset.value.length, 0);

    if (charsetSize === 0 || pwdLength === 0) return 0;
    return Math.log2(charsetSize ** pwdLength);
  });

  constructor(
    private readonly _config: PasswordConfigService,
  ) { }
}
