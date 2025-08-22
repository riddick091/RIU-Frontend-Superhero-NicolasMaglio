import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast/toast';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './core/services/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RIU-Frontend-Superhero-NicolasMaglio');
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
    this.toastService.showToast('Bienvenido');
  }
}



