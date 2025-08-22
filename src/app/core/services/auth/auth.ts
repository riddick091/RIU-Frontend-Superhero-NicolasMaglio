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

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  constructor(private router: Router) {
  }

  login(email: string): void {
    const user: User = { id: '1', email, name: 'Test User' };
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
    //this.router.navigate(['/dashboard']);
  }
  
  logout(): void {
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
  // his.router.navigate(['/login']);
  }

  checkUserAuthenticated(): boolean {
    const isAuthenticated = false
    const userData = null
    
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

}
