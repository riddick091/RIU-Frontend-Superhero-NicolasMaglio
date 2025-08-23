import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,
    RouterModule],
  template: `
    <mat-toolbar>
      <span>Super Heroes</span>
      <nav>
          <button mat-button routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>home</mat-icon>
              Home
          </button>
          <button mat-button routerLink="/heros" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              Heroes
          </button>
      </nav>
      <div class="spacer"></div>
      <div class="user-menu">
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
              <button mat-menu-item (click)="logout()">
                  <mat-icon>logout</mat-icon>
                  <span>Cerrar Sesión</span>
              </button>
          </mat-menu>
      </div>
  </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    nav {
      display: flex;
      gap: 16px;
    }
    .user-menu {
      margin-left: 16px;
    }
  `]
})
export class Navbar {

  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
