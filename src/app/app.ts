import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast/toast';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './core/services/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.css'
})
export class App {
}




