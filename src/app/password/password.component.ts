import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect } from '@angular/core';
import { PasswordService } from '../services/password.service';
import { SvgCopyIconComponent } from '../svg/svg-copy-icon/svg-copy-icon.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    NgIf,
    SvgCopyIconComponent,
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordComponent {
  readonly #PLACEHOLDER = 'P4$5W0rD!';
  readonly #TIMEOUT = 2000;
  readonly isCopyDisabled = computed(() => this.isPlaceholder());
  readonly isPlaceholder = computed(() => this._password.value() === '');
  readonly password = computed(() => {
    const value = this._password.value();
    return value === '' ? this.#PLACEHOLDER : value;
  });
  #isCopied = false;
  timeoutId = 0;

  constructor(
    private readonly _password: PasswordService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {
    effect(() => {
      window.clearTimeout(this.timeoutId);
      this.password(); // Detect password changes
      this.isCopied = false;
    });
  }

  get isCopied(): boolean {
    return this.#isCopied;
  }

  set isCopied(value: boolean) {
    this.#isCopied = value;
    this._changeDetectorRef.markForCheck();
  }

  async copyPassword(): Promise<void> {
    window.clearTimeout(this.timeoutId);

    try {
      await window.navigator.clipboard.writeText(this.password());
      this.isCopied = true;
      this.timeoutId = window.setTimeout(() => {
        this.isCopied = false;
      }, this.#TIMEOUT);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError')
        throw new Error('Clipboard write permission denied', { cause: error });

      throw new Error('Unexpected error', { cause: error });
    }
  }
}
