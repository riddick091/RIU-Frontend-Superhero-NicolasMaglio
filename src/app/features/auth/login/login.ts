import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    MatProgressSpinnerModule,
    MatDividerModule, MatCard,
    MatCardTitle, MatCardContent,
    MatFormField, MatInputModule,
    MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private readonly _formError = signal<string | null>(null);

  readonly formError = this._formError.asReadonly();

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async submit(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.clearErrors();
    if (this.form.valid) {
      try {
        const { email, password } = this.form.value;
        const success = await this.authService.login(
          email,
          password
        );

        if (success) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.setFormError('Credenciales incorrectas. Verifique su email y contraseña.');
        }
      } catch (error) {
        this.setFormError('Error al iniciar sesión. Inténtalo de nuevo.');
      } finally {
        this.authService.getIsLoading()
      }

    }
  }

  private setFormError(message: string): void {
    this._formError.set(message);
    this.form.setErrors({ serverError: true });
  }

  private   clearErrors(): void {
    this._formError.set(null);
    this.form.setErrors(null);
  }
}