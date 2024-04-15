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

  copyPassword(): void {
    window.clearTimeout(this.timeoutId);
    window.navigator.clipboard.writeText(this.password())
      .then(() => {
        this.isCopied = true;
        this.timeoutId = window.setTimeout(() => {
          this.isCopied = false;
        }, 2000);
      });
  }
}
