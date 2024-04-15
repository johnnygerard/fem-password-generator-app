import { Injectable, effect, model } from '@angular/core';
import { Charset } from '../types/charset.enum';
import { PasswordCharset } from '../types/password-charset.class';

@Injectable({
  providedIn: 'root'
})
export class PasswordConfigService {
  readonly PWD_MIN_LENGTH = 0;
  readonly PWD_MAX_LENGTH = 64;
  readonly pwdLength = model(0);

  readonly pwdCharsets = [
    new PasswordCharset('uppercase', Charset.UPPERCASE, 'Include Uppercase Letters'),
    new PasswordCharset('lowercase', Charset.LOWERCASE, 'Include Lowercase Letters'),
    new PasswordCharset('digits', Charset.DIGITS, 'Include Numbers'),
    new PasswordCharset('symbols', Charset.SYMBOLS, 'Include Symbols'),
  ] as const;

  constructor() {
    const PWD_LENGTH_KEY = 'pwdLength';
    const storage = window.localStorage;

    if (storage === undefined) {
      console.error('Local storage API unavailable');
      return;
    }

    const pwdLength = storage.getItem(PWD_LENGTH_KEY);

    if (pwdLength !== null) {
      // Deserialize password length
      this.pwdLength.set(JSON.parse(pwdLength) as number);
    }

    effect(() => {
      // Serialize password length on change
      storage.setItem(
        PWD_LENGTH_KEY,
        JSON.stringify(this.pwdLength())
      );
    });

    for (const charset of this.pwdCharsets) {
      const charsetKey = charset.name;
      const isCharsetIncluded = storage.getItem(charsetKey);

      if (isCharsetIncluded !== null) {
        // Deserialize charset setting
        charset.isIncluded.set(JSON.parse(isCharsetIncluded) as boolean);
      }

      effect(() => {
        // Serialize charset setting on change
        storage.setItem(
          charsetKey,
          JSON.stringify(charset.isIncluded())
        );
      });
    }
  }
}
