import { Injectable, computed } from '@angular/core';
import { PasswordConfigService } from './password-config.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordEntropyService {
  /**
   * Compute password entropy in bits.
   * @link https://nordvpn.com/blog/what-is-password-entropy/
   */
  public passwordEntropy = computed(() => {
    const pwdLength = this._config.pwdLength();
    const charsetSize = this._config.pwdCharsets
      .filter(charset => charset.isIncluded())
      .reduce((acc, charset) => acc + charset.value.length, 0);

    if (charsetSize === 0 || pwdLength === 0) return 0;
    return pwdLength * Math.log2(charsetSize);
  });

  constructor(
    private readonly _config: PasswordConfigService,
  ) { }
}
