import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { LoadingIndicatorComponent } from './loading.component';
import { LoadingService } from './loading.service';

describe('LoadingIndicatorComponent', () => {
  const loadingSignal = signal(false);

  const loadingServiceMock = {
    loading: loadingSignal.asReadonly(),
  };

  beforeEach(async () => {
    loadingSignal.set(false);

    await TestBed.configureTestingModule({
      imports: [LoadingIndicatorComponent],
      providers: [
        {
          provide: LoadingService,
          useValue: loadingServiceMock,
        },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LoadingIndicatorComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should not render spinner when loading is false', () => {
    const fixture = TestBed.createComponent(LoadingIndicatorComponent);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeNull();
  });

  it('should render spinner when loading is true', () => {
    const fixture = TestBed.createComponent(LoadingIndicatorComponent);

    loadingSignal.set(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).not.toBeNull();
  });
});