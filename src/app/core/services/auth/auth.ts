import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_KEYS } from '../../constants/localStorageKeys';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal<boolean>(false);
  private _isWelcomeMessage = signal<boolean>(false);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isWelcomeMessage = this._isWelcomeMessage.asReadonly();

  constructor(private router: Router) {
    this.initializeWelcome();
  }

  private initializeWelcome(): void {
    const welcomeMesagge = sessionStorage.getItem(STORAGE_KEYS.WELCOME_KEY) === 'true';
    this._isWelcomeMessage.set(welcomeMesagge);
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      this._isLoading.set(true);
      setTimeout(() => {
        if (email === 'user@test.com' && password === 'user123') {
          const user: User = {
            id: '2',
            email,
            name: 'Usuario de test'
          };
          this.setAuthenticatedUser(user, true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  setAuthenticatedUser(user: User, firstLogin: boolean = false) {
    this._currentUser.set(user);
    this._isAuthenticated.set(true);

    if (firstLogin) {
      this._isWelcomeMessage.set(true);
      localStorage.setItem(STORAGE_KEYS.WELCOME_KEY, 'true');
    }

    localStorage.setItem(STORAGE_KEYS.USER_KEY, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_KEY, 'true');

  }

  logout(): void {
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    localStorage.removeItem(STORAGE_KEYS.USER_KEY);
    localStorage.removeItem(STORAGE_KEYS.AUTH_KEY);
    sessionStorage.removeItem(STORAGE_KEYS.WELCOME_KEY);
    this.router.navigate(['/login']);
  }

  checkUserAuthenticated(): boolean {
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH_KEY) === 'true';
    const userData = localStorage.getItem(STORAGE_KEYS.USER_KEY);

    try {
      if (isAuthenticated && userData) {
        this._isAuthenticated.set(true);
        this._currentUser.set(JSON.parse(userData));
        return true;
      } else {
        this._isAuthenticated.set(false);
        this._currentUser.set(null);
        return false;
      }
    } catch (error) {
      console.error('Error', error); // todo emitir un evento de error
      this._isAuthenticated.set(false);
      this._currentUser.set(null);
      return false;
    }
  }


  getIsLoading() {
    return this._isLoading.asReadonly();
  }
}
