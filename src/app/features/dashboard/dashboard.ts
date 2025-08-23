import { MatIconModule } from '@angular/material/icon';
import { Component, effect, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth/auth';
import { ToastService } from '../../core/services/toast/toast';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private toast = inject(MatSnackBar);

  constructor() {
    effect(() => {
      const message = this.toastService.toastMessage();
      if (message) {
        this.toast.open(message, 'Cerrar', { ...this.toastService.defaultPosition });
      }
    });

    if (!this.authService.checkUserAuthenticated()) {
      this.authService.logout();
    }

    const user = this.authService.currentUser();
    this.toastService.showToast(`Bienvenido ${user?.name}`);

  }
}

