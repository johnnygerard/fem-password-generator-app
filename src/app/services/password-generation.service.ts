import { Injectable, computed } from '@angular/core';
import { PasswordConfigService } from './password-config.service';
import { CryptographyService } from './cryptography.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordGenerationService {
  readonly includedCharsets = computed(
    () => this._pwdConfig.pwdCharsets
      .filter(charset => charset.isIncluded())
      .map(charset => charset.value)
  );

  readonly pwdCharset = computed(
    () => this._pwdConfig.pwdCharsets.reduce(
      (acc, charset) => charset.isIncluded() ? acc + charset.value : acc, ''
    )
  );

  constructor(
    private readonly _crypto: CryptographyService,
    private readonly _pwdConfig: PasswordConfigService,
  ) { }

  makePassword(): string {
    const pwdCharset = this.pwdCharset();
    const pwdLength = this._pwdConfig.pwdLength();
    const includedCharsets = this.includedCharsets();
    const includedCharsetsCount = includedCharsets.length;
    let password = '';

    if (pwdLength === 0 || includedCharsetsCount === 0)
      return '';

    if (pwdLength < includedCharsetsCount) {
      password = this.#getRandomString(pwdCharset, pwdLength);
    } else {
      // Ensure that at least one character from each selected character set is included
      password = this.#getRandomString(pwdCharset, pwdLength - includedCharsetsCount);

      for (const charset of includedCharsets)
        password = this.#insertRandomChar(charset, password);
    }

    return password;
  }

  #getRandomChar(charset: string): string {
    return charset[this._crypto.getRandomIndex(charset.length)];
  }

  #getRandomString(charset: string, length: number): string {
    let randomString = '';

    for (let i = 0; i < length; i++)
      randomString += this.#getRandomChar(charset);

    return randomString;
  }

  #insertRandomChar(charset: string, password: string): string {
    const randomChar = this.#getRandomChar(charset);

    if (password.length === 0)
      return randomChar;

    const randomPwdIndex = this._crypto.getRandomIndex(password.length);

    return password.slice(0, randomPwdIndex) + randomChar + password.slice(randomPwdIndex);
  }
}
