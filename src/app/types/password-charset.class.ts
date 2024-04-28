import { model } from '@angular/core';
import { Charset } from './charset.enum';

export class PasswordCharset {
  isIncluded = model(false);

  constructor(
    public readonly name: string,
    public readonly value: Charset,
    public readonly label: string,
  ) {}
}
