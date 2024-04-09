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
    const pwdMainLength = this._pwdConfig.pwdLength() - this._pwdConfig.pwdMinLength();
    let password = '';

    for (let i = 0; i < pwdMainLength; i++)
      password += this.#getRandomChar(this._pwdConfig.pwdCharset());

    // Ensure that at least one character from each selected character set is included
    Object.values(this._pwdConfig.pwdCharsets).forEach(charset => {
      if (charset.isIncluded())
        password = this.#insertRandomChar(charset.value, password);
    });

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
