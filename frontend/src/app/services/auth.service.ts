import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'ogs_token';
const USER_KEY = 'ogs_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  /** Reactive signal holding the currently logged-in user (or null). */
  currentUser = signal<AuthUser | null>(this.loadUser());

  /**
   * Loads the saved user from localStorage on app start.
   * Only the user info (id, name, email) is stored — never the password.
   */
  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /**
   * POST /api/auth/register
   * Sends name, email, password to the backend.
   * Backend hashes the password with bcrypt, creates the user in MongoDB,
   * and returns a JWT token + user info.
   */
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, { name, email, password })
      .pipe(tap(res => {
        if (res.success && res.token && res.user) {
          this.saveSession(res.token, res.user);
        }
      }));
  }

  /**
   * POST /api/auth/login
   * Sends email, password to the backend.
   * Backend compares with bcrypt hash, returns JWT token + user info.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => {
        if (res.success && res.token && res.user) {
          this.saveSession(res.token, res.user);
        }
      }));
  }

  /**
   * GET /api/auth/profile
   * Fetches the full user profile including address and phone.
   * Requires JWT token (handled by interceptor).
   */
  getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/profile`);
  }

  /**
   * PUT /api/auth/profile
   * Updates user details.
   */
  updateProfile(data: { name?: string; address?: string; phone?: string }): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/auth/profile`, data).pipe(
      tap(res => {
        if (res.success && res.user) {
          // Update the local signal and storage with the new name
          const currentUser = this.currentUser();
          if (currentUser) {
            const updatedUser = { ...currentUser, name: res.user.name };
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
            this.currentUser.set(updatedUser);
          }
        }
      })
    );
  }

  /**
   * Clears the JWT token and user info from localStorage.
   * Resets the currentUser signal to null.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  /**
   * Checks if the user is logged in by verifying a token exists.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Returns the stored JWT token (used by the interceptor).
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Saves the JWT token and user info to localStorage.
   * Updates the currentUser signal so the UI reacts immediately.
   */
  private saveSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }
}
