import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-spinner.html',
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }

    .loading-content {
      background: white;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 200px;
    }

    .loading-message {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      text-align: center;
    }
  `],
})
export class LoadingSpinner {
  @Input() message: string = '';
  @Input() isLoading: boolean = true;
  @Input() color = 'primary'

  getMessage(): string {
    return this.message || 'Cargando...';
  }
}
