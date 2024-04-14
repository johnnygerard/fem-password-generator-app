import { Injectable, model } from '@angular/core';
import { Charset } from '../types/charset.enum';
import { PasswordCharset } from '../types/password-charset.class';

@Injectable({
  providedIn: 'root'
})
export class PasswordConfigService {
  readonly PWD_MIN_LENGTH = 0;
  readonly PWD_MAX_LENGTH = 20;
  readonly pwdLength = model(0);

  readonly pwdCharsets = [
    new PasswordCharset('uppercase', Charset.UPPERCASE, 'Include Uppercase Letters'),
    new PasswordCharset('lowercase', Charset.LOWERCASE, 'Include Lowercase Letters'),
    new PasswordCharset('digits', Charset.DIGITS, 'Include Numbers'),
    new PasswordCharset('symbols', Charset.SYMBOLS, 'Include Symbols'),
  ] as const;
}
