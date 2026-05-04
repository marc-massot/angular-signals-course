import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpContext, HttpRequest } from '@angular/common/http';
import { of, throwError, firstValueFrom } from 'rxjs';

import { LoadingService } from '../loading/loading.service';
import { SkipLoading } from '../loading/skip-loading.component';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  const loadingServiceMock = {
    loadingOn: vi.fn(),
    loadingOff: vi.fn(),
  };

  beforeEach(() => {
    loadingServiceMock.loadingOn.mockReset();
    loadingServiceMock.loadingOff.mockReset();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoadingService,
          useValue: loadingServiceMock,
        },
      ],
    });
  });

  it('should skip loading toggling when SkipLoading context is true', async () => {
    const req = new HttpRequest('GET', '/api/courses', {
      context: new HttpContext().set(SkipLoading, true),
    });
    const next = vi.fn().mockReturnValue(of({ ok: true }));

    const response$ = TestBed.runInInjectionContext(() => loadingInterceptor(req, next));
    await firstValueFrom(response$);

    expect(next).toHaveBeenCalledOnce();
    expect(loadingServiceMock.loadingOn).not.toHaveBeenCalled();
    expect(loadingServiceMock.loadingOff).not.toHaveBeenCalled();
  });

  it('should toggle loading on success', async () => {
    const req = new HttpRequest('GET', '/api/courses');
    const next = vi.fn().mockReturnValue(of({ ok: true }));

    const response$ = TestBed.runInInjectionContext(() => loadingInterceptor(req, next));
    await firstValueFrom(response$);

    expect(next).toHaveBeenCalledOnce();
    expect(loadingServiceMock.loadingOn).toHaveBeenCalledOnce();
    expect(loadingServiceMock.loadingOff).toHaveBeenCalledOnce();
  });

  it('should toggle loading off when request fails', async () => {
    const req = new HttpRequest('GET', '/api/courses');
    const next = vi.fn().mockReturnValue(throwError(() => new Error('Request failed')));

    const response$ = TestBed.runInInjectionContext(() => loadingInterceptor(req, next));

    await expect(firstValueFrom(response$)).rejects.toThrow('Request failed');
    expect(loadingServiceMock.loadingOn).toHaveBeenCalledOnce();
    expect(loadingServiceMock.loadingOff).toHaveBeenCalledOnce();
  });
});