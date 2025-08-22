import { Injectable, signal } from '@angular/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  defautlTimeout = 5000;
  private  _defaultPosition = {
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

    this._toastMessage.set(message);
    setTimeout(() => {
      this._toastMessage.set(null);
    }, this.defautlTimeout);
  }

  get defaultPosition() {
    return this._defaultPosition;
  }

}
