import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PasswordComponent } from './password/password.component';
import { SliderComponent } from './slider/slider.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { StrengthMeterComponent } from './strength-meter/strength-meter.component';
import { PasswordGenerationService } from './services/password-generation.service';
import { PasswordService } from './services/password.service';
import { PasswordConfigService } from './services/password-config.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { SvgRightArrowComponent } from './svg/svg-right-arrow.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    PasswordComponent,
    SliderComponent,
    CheckboxComponent,
    StrengthMeterComponent,
    SvgRightArrowComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly PASSWORD_LENGTH_INPUT = 'password-length-input';

  constructor(
    readonly config: PasswordConfigService,
    private readonly _generator: PasswordGenerationService,
    private readonly _password: PasswordService,
  ) { }

  generatePassword(): void {
    this._password.value.set(this._generator.makePassword());
  }
}
