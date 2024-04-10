import { TestBed } from '@angular/core/testing';
import { CryptographyService } from './cryptography.service';

describe('CryptographyService', () => {
  let service: CryptographyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptographyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a random index', () => {
    // Test all valid inputs
    for (let length = 1; length < 256; length++) {
      const index = service.getRandomIndex(length);

      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(length);
    }
  });

  it('should have a random distribution', () => {
    const SAMPLE_SIZE = 100_000;
    const LENGTH = 10;
    const indexCounts = new Array(LENGTH).fill(0);

    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const index = service.getRandomIndex(LENGTH);

      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(LENGTH);
      indexCounts[index]++;
    }

    const expectedCount = SAMPLE_SIZE / LENGTH;
    const TOLERANCE = 0.05;
    const lowerBound = expectedCount * (1 - TOLERANCE);
    const upperBound = expectedCount * (1 + TOLERANCE);

    indexCounts.forEach(count => {
      expect(count).toBeGreaterThan(lowerBound);
      expect(count).toBeLessThan(upperBound);
    });
  });
});
