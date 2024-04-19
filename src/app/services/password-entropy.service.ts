import { Injectable, computed, inject } from '@angular/core';
import { PasswordConfigService } from './password-config.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordEntropyService {
  readonly #config = inject(PasswordConfigService);

  /**
   * Compute password entropy in bits.
   * @link https://nordvpn.com/blog/what-is-password-entropy/
   */
  public passwordEntropy = computed(() => {
    const pwdLength = this.#config.pwdLength();
    const charsetSize = this.#config.pwdCharsets
      .filter(charset => charset.isIncluded())
      .reduce((acc, charset) => acc + charset.value.length, 0);

    if (charsetSize === 0 || pwdLength === 0) return 0;
    return pwdLength * Math.log2(charsetSize);
  });
}
