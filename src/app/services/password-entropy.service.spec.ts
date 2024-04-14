import { TestBed } from '@angular/core/testing';
import { PasswordEntropyService } from './password-entropy.service';
import { PasswordConfigService } from './password-config.service';
import { Charset } from '../types/charset.enum';

// This test suite is an integration test for the PasswordEntropyService and its dependency.
// Expected entropy values computed from https://www.omnicalculator.com/other/password-entropy
describe('PasswordEntropyService', () => {
  let config: PasswordConfigService;
  let service: PasswordEntropyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PasswordConfigService,
        PasswordEntropyService,
      ],
    });
    config = TestBed.inject(PasswordConfigService);
    service = TestBed.inject(PasswordEntropyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a password entropy of 0 (minimum entropy)', () => {
    expect(service.passwordEntropy()).toBe(0);
  });

  it('should have a password entropy of 36.19 (level 2)', () => {
    config.pwdLength.set(7);
    includeCharsets(config, Charset.LOWERCASE, Charset.DIGITS);

    expect(service.passwordEntropy()).toBeCloseTo(36.19, 2);
  });

  it('should have a password entropy of 61.1 (level 3)', () => {
    config.pwdLength.set(13);
    includeCharsets(config, Charset.LOWERCASE);

    expect(service.passwordEntropy()).toBeCloseTo(61.1, 1);
  });

  it('should have a password entropy of 93.73 (level 4)', () => {
    config.pwdLength.set(16);
    includeCharsets(config, Charset.LOWERCASE, Charset.SYMBOLS);

    expect(service.passwordEntropy()).toBeCloseTo(93.73, 2);
  });

  it('should have a password entropy of 1671.4 (maximum entropy)', () => {
    config.pwdLength.set(255);
    includeCharsets(config, Charset.UPPERCASE, Charset.LOWERCASE, Charset.DIGITS, Charset.SYMBOLS);

    expect(service.passwordEntropy()).toBeCloseTo(1671.4, 1);
  });
});

function includeCharsets(config: PasswordConfigService, ...charsets: Charset[]) {
  for (const charset of charsets) {
    const pwdCharset = config.pwdCharsets.find(pwdCharset => pwdCharset.value === charset);

    if (pwdCharset === undefined) {
      throw new Error(`Charset ${charset} not found in config`);
    }

    pwdCharset.isIncluded.set(true);
  }
}
