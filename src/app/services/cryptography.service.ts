import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptographyService {
  readonly MAX_BYTE = 255;
  readonly BUFFER_SIZE = 256;
  readonly #buffer = new Uint8Array(this.BUFFER_SIZE);
  #bufferIndex = 0;

  getRandomIndex(length: number): number {
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

  #fillBuffer(): void {
    window.crypto.getRandomValues(this.#buffer);
  }

  /**
   * @returns A random unsigned 8-bit integer
   */
  #getRandomByte(): number {
    if (this.#bufferIndex === this.#buffer.length) {
      this.#bufferIndex = 0;
      this.#fillBuffer();
    }
    return this.#buffer[this.#bufferIndex++];
  }
}
