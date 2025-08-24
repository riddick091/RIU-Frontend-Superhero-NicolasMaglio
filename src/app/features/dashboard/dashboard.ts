import { MatIconModule } from '@angular/material/icon';
import { Component, effect, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth/auth';
import { ToastService } from '../../core/services/toast/toast';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { HeroService } from '../../core/services/hero/hero';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule, KpiCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private heroService = inject(HeroService);
  private toast = inject(MatSnackBar);

  totalHeroes = this.heroService.totalHeroes;

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

    if (this.authService.isWelcomeMessage()) {
      const user = this.authService.currentUser();
      this.toastService.showToast(`Bienvenido ${user?.name}`);
    }

  }
}

