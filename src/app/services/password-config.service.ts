import { Injectable, computed, model } from '@angular/core';
import { Charset } from '../types/charset.enum';
import { PasswordCharset } from '../types/password-charset.class';

@Injectable({
  providedIn: 'root'
})
export class PasswordConfigService {
  readonly PWD_MAX_LENGTH = 20;
  readonly pwdLength = model(0);

  readonly pwdCharsets = {
    lowercase: new PasswordCharset(Charset.LOWERCASE),
    uppercase: new PasswordCharset(Charset.UPPERCASE),
    digits: new PasswordCharset(Charset.DIGITS),
    symbols: new PasswordCharset(Charset.SYMBOLS),
  } as const;

  readonly includedCharsets = computed(
    () => Object.values(this.pwdCharsets)
      .filter(charset => charset.isIncluded())
      .map(charset => charset.value)
  );

  readonly pwdCharset = computed(
    () => Object.values(this.pwdCharsets).reduce(
      (acc, charset) => charset.isIncluded() ? acc + charset.value : acc, ''
    )
  );
}
