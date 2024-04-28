import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  readonly value = signal('');
}
