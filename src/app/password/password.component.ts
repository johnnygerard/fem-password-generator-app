import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject } from '@angular/core';
import { PasswordService } from '../services/password.service';
import { SvgCopyIconComponent } from '../svg/svg-copy-icon/svg-copy-icon.component';
import { NgIf } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease', style({ opacity: 1 })),
      ]),
    ]),
  ],
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
  readonly #password = inject(PasswordService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #PLACEHOLDER = 'P4$5W0rD!';
  readonly isCopyDisabled = computed(() => this.isPlaceholder());
  readonly isPlaceholder = computed(() => this.#password.value() === '');
  readonly password = computed(() => {
    const value = this.#password.value();
    return value === '' ? this.#PLACEHOLDER : value;
  });
  isCopied = false;

  constructor() {
    effect(() => {
      this.password(); // Detect password changes
      this.isCopied = false;
      this.#changeDetectorRef.markForCheck();
    });
  }

  async copyPassword(): Promise<void> {
    try {
      await window.navigator.clipboard.writeText(this.password());
      this.isCopied = true;
      this.#changeDetectorRef.markForCheck();
    } catch (error) {
      let message = 'Unexpected error';

      if (error instanceof DOMException && error.name === 'NotAllowedError')
        message = 'Clipboard write permission denied';

      alert(message); // Notify user
      throw new Error(message, { cause: error });
    }
  }
}
