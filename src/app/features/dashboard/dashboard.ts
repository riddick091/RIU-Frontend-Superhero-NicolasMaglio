import { Component, effect, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast/toast';
import { AuthService } from '../../core/services/auth/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [],
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

