import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        {
          provide: Router,
          useValue: {},
        },
      ],
    });

    service = TestBed.inject(LoadingService);
  });

  it('should start with loading disabled', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading to true when loadingOn is called', () => {
    service.loadingOn();

    expect(service.loading()).toBe(true);
  });

  it('should set loading back to false when loadingOff is called', () => {
    service.loadingOn();
    service.loadingOff();

    expect(service.loading()).toBe(false);
  });
});