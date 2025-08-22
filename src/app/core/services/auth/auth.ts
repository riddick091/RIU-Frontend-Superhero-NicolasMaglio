import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

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

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  constructor(private router: Router) {
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
          this.setAuthenticatedUser(user);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  setAuthenticatedUser(user: User) {
    this._currentUser.set(user);
    this._isAuthenticated.set(true);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  }

  logout(): void {
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }

  checkUserAuthenticated(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('user');

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
