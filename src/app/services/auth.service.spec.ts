import { beforeEach, describe, vi, it, expect, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    pictureUrl: 'https://example.com/avatar.png',
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: {
            navigateByUrl: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should start logged out when there is no user in storage', () => {
    expect(service.user()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should load user from localStorage on service creation', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));

    const freshService = TestBed.runInInjectionContext(() => new AuthService());

    expect(freshService.user()).toEqual(mockUser);
    expect(freshService.isLoggedIn()).toBe(true);
  });

  it('should persist user to localStorage via effect when service starts with stored user', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    TestBed.runInInjectionContext(() => new AuthService());
    TestBed.tick();

    expect(setItemSpy).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    setItemSpy.mockRestore();
  });

  it('should login by posting credentials and storing authenticated user', async () => {
    const loginPromise = service.login('test@example.com', 'secret');

    const req = httpTestingController.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      password: 'secret',
    });

    req.flush(mockUser);

    const result = await loginPromise;

    TestBed.tick();

    expect(result).toEqual(mockUser);
    expect(service.user()).toEqual(mockUser);
    expect(service.isLoggedIn()).toBe(true);
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
  });

  it('should logout and navigate to login', async () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const freshService = TestBed.runInInjectionContext(() => new AuthService());

    await freshService.logout();

    expect(localStorage.getItem('user')).toBeNull();
    expect(freshService.user()).toBeNull();
    expect(freshService.isLoggedIn()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});