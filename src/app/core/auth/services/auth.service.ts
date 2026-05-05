import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, delay, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  AuthCredentials,
  AuthState,
  AuthTokens,
  LoginResponse,
  User,
  UserRole,
  ROLE_HIERARCHY,
} from '../models/auth.models';
import { environment } from '../../../../environments/environment';
import { MOCK_CREDENTIALS, MOCK_USERS } from '../../../infrastructure/mock-data/auth.mock';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ogi_access_token',
  REFRESH_TOKEN: 'ogi_refresh_token',
  USER: 'ogi_user',
} as const;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _state = signal<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  readonly state = this._state.asReadonly();
  readonly user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly currentRole = computed(() => this._state().user?.role ?? null);

  constructor() {
    this.restoreSession();
  }

  login(credentials: AuthCredentials): Observable<LoginResponse> {
    this._state.update((s) => ({ ...s, isLoading: true, error: null }));

    if (environment.features.mockData) {
      return this.mockLogin(credentials);
    }

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login/`, credentials)
      .pipe(
        tap((res) => this.handleLoginSuccess(res)),
        catchError((err: { error?: { detail?: string } }) => {
          this._state.update((s) => ({
            ...s,
            isLoading: false,
            error: err.error?.detail ?? 'Erreur de connexion',
          }));
          return throwError(() => err);
        }),
      );
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/auth/login']);
  }

  hasRole(requiredRoles: UserRole[]): boolean {
    const role = this.currentRole();
    if (!role) return false;
    return requiredRoles.includes(role);
  }

  hasMinimumRole(minimumRole: UserRole): boolean {
    const role = this.currentRole();
    if (!role) return false;
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimumRole];
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }
    return this.http
      .post<AuthTokens>(`${environment.apiUrl}/auth/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((tokens) => {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        }),
      );
  }

  private mockLogin(credentials: AuthCredentials): Observable<LoginResponse> {
    const expectedPassword = MOCK_CREDENTIALS[credentials.email];
    if (!expectedPassword || expectedPassword !== credentials.password) {
      this._state.update((s) => ({
        ...s,
        isLoading: false,
        error: 'Email ou mot de passe incorrect.',
      }));
      return throwError(() => new Error('Invalid credentials'));
    }

    const user = MOCK_USERS.find((u) => u.email === credentials.email);
    if (!user) {
      return throwError(() => new Error('User not found'));
    }

    const response: LoginResponse = {
      user,
      tokens: {
        accessToken: `mock_access_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
        expiresIn: 3600,
      },
    };

    return of(response).pipe(
      delay(600),
      tap((res) => this.handleLoginSuccess(res)),
    );
  }

  private handleLoginSuccess(res: LoginResponse): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));

    this._state.set({
      user: res.user,
      tokens: res.tokens,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }

  private restoreSession(): void {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this._state.update((s) => ({
          ...s,
          user,
          isAuthenticated: true,
          tokens: {
            accessToken: token,
            refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ?? '',
            expiresIn: 3600,
          },
        }));
      } catch {
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    this._state.set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
}
