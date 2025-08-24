import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  defautlTimeout = 5000;
  private _defaultPosition = {
    duration: this.defautlTimeout,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition
  }
  private _toastMessage = signal<string | null>('');
  readonly toastMessage = this._toastMessage.asReadonly();

  showToast(message: string): void {

    if (!message) {
      return;
    }

    this.snackBar.open(message, 'Cerrar', this._defaultPosition);
  }

  get defaultPosition() {
    return this._defaultPosition;
  }

}
