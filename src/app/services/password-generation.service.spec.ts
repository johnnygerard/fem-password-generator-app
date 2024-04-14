import { TestBed } from '@angular/core/testing';
import { PasswordGenerationService } from './password-generation.service';
import { PasswordConfigService } from './password-config.service';
import { Charset } from '../types/charset.enum';

const PWD_MIN_LENGTH = 0;
const PWD_MAX_LENGTH = 255; // Max UInt8 value

// This test suite is an integration test for the PasswordGenerationService and its dependency.
describe('PasswordGenerationService', () => {
  let configService: PasswordConfigService;
  let service: PasswordGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PasswordConfigService,
        PasswordGenerationService,
      ],
    });
    configService = TestBed.inject(PasswordConfigService);
    service = TestBed.inject(PasswordGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a password', () => {
    const password = service.makePassword();
    expect(password).toBeInstanceOf(String);
  });

  it('should generate an empty password when using default settings', () => {
    const password = service.makePassword();
    expect(password).toBe('');
  });

  it('should generate a password with the correct length', () => {
    // Include at least one character set
    configService.pwdCharsets[0].isIncluded.set(true);

    for (let length = PWD_MIN_LENGTH; length < PWD_MAX_LENGTH; length++) {
      configService.pwdLength.set(length);

      const password = service.makePassword();
      expect(password.length).toBe(length);
    }
  });

  it('should generate a password with the correct charset', () => {
    // Test all charset combinations for all valid lengths
    for (let flags = 1; flags < 16; flags++) {
      for (let pwdLength = PWD_MIN_LENGTH; pwdLength < PWD_MAX_LENGTH; pwdLength++) {
        configService.pwdLength.set(pwdLength);
        const config = configureCharsets(configService, flags);
        const { charset, charsets } = config;
        const password = service.makePassword();
        const pwdChars = password.split('');

        for (const char of password) {
          expect(charset).toContain(char);
        }

        // Check that the password contains at least one character from each charset
        if (pwdLength >= charsets.length) {
          for (const charset of charsets) {
            expect(pwdChars.some(char => charset.includes(char))).toBeTrue();
          }
        }
      }
    }
  });
});

function configureCharsets(
  service: PasswordConfigService,
  flags: number,
): {
  charset: string,
  charsets: Charset[],
} {
  for (let i = 0; i < 4; i++) {
    const flag = flags & (1 << i);
    service.pwdCharsets[i].isIncluded.set(Boolean(flag));
  }

  const includedCharsets = service.pwdCharsets
    .filter(charset => charset.isIncluded());

  // Return the full charset and the component charsets
  return {
    charset: includedCharsets.reduce((acc, charset) => acc + charset.value, ''),
    charsets: includedCharsets.map(charset => charset.value),
  };
}
