import { Injectable, model } from '@angular/core';
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
}
