import { Injectable } from '@angular/core';
import { PasswordConfigService } from './password-config.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordGenerationService {
  readonly BUFFER_SIZE = 256;
  readonly MAX_BYTE = 255;

  readonly #buffer = new Uint8Array(this.BUFFER_SIZE);
  #bufferIndex = 0;

  constructor(
    private readonly _pwdConfig: PasswordConfigService,
  ) { }

  makePassword(): string {
    const pwdCharset = this._pwdConfig.pwdCharset();
    const pwdLength = this._pwdConfig.pwdLength();
    const includedCharsets = this._pwdConfig.includedCharsets();
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

  /**
   * Return a random unsigned 8-bit integer
   */
  #getRandomByte(): number {
    if (this.#bufferIndex === this.#buffer.length) {
      this.#bufferIndex = 0;
      this.#fillBuffer();
    }
    return this.#buffer[this.#bufferIndex++];
  }

  #getRandomChar(charset: string): string {
    return charset[this.#getRandomIndex(charset.length)];
  }

  #getRandomString(charset: string, length: number): string {
    let randomString = '';

    for (let i = 0; i < length; i++)
      randomString += this.#getRandomChar(charset);

    return randomString;
  }

  #getRandomIndex(length: number): number {
    if (length > this.MAX_BYTE)
      throw new Error(`Invalid input: length must not exceed ${this.MAX_BYTE}`);

    // Greatest byte value that is a multiple of the specified length
    const upperBound = this.MAX_BYTE - (this.MAX_BYTE % length);
    let sampledByte: number;

    // Rejection sampling is used to prevent modulo bias
    // Source: https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
    do {
      sampledByte = this.#getRandomByte();
    } while (sampledByte > upperBound);

    return sampledByte % length;
  }

  #insertRandomChar(charset: string, password: string): string {
    const randomChar = this.#getRandomChar(charset);
    const randomPwdIndex = this.#getRandomIndex(password.length);

    return password.slice(0, randomPwdIndex) + randomChar + password.slice(randomPwdIndex);
  }

  #fillBuffer(): void {
    window.crypto.getRandomValues(this.#buffer);
  }
}
