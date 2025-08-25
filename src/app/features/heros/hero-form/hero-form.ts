import { ToastService } from './../../../core/services/toast/toast';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ROUTES } from '@angular/router';
import { HeroService } from '../../../core/services/hero/hero';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { MENU_ROUTES } from '../../../core/constants/routes';
import { Hero } from '../../../models/hero.model';
import { Power } from '../../../models/power.model';
import { MatTableModule } from '@angular/material/table';
import { ImageUpload } from "../../../shared/components/image-upload/image-upload";

@Component({
  selector: 'app-hero-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule, ImageUpload],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.css'
})
export class HeroForm {
  private fb = inject(FormBuilder);
  private heroService = inject(HeroService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private selectedImage = signal<string | null>(null);
  imageUploading = signal<boolean>(false);

  private heroId = signal<number | null>(null);

  isEditMode = computed(() => this.heroId() !== null);
  title = computed(() => this.isEditMode() ? 'Editar héroe' : 'Crear héroe');
  buttonText = computed(() => this.isEditMode() ? 'Actualizar' : 'Guardar');

  newPowerNameControl = this.fb.control('');
  newPowerDescControl = this.fb.control('');

  displayedColumns: string[] = ['powerName', 'powerDescription', 'powerActions'];

  private _powersTableData = signal<any[]>([]);
  powersTableData = this._powersTableData.asReadonly();

  loading = toSignal(this.heroService.loading$);

  private customNameValidator = (control: any) => {
    const value = control.value;
    if (!value) return null;

    const errors: any = {};
    if (value.startsWith(' ')) {
      errors['startsEmpty'] = true;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/g.test(value)) {
      errors['specialChar'] = true;
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }

  heroForm: FormGroup = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
      this.customNameValidator
    ]],
    powers: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    imageUrl: [''],
  });

  async onSubmit(): Promise<void> {

    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    const formValue = this.heroForm.getRawValue();
    const heroData: Partial<Hero> = {
      name: formValue.name,
      powers: formValue.powers,
    };

    this.heroService.registerHero(heroData as Omit<Hero, 'id'>).subscribe({
      next: () => {
        this.router.navigate([MENU_ROUTES.HEROES]);
      },
      error: (error) => {
        this.toastService.showToast(this.getErrorMessage(error));
      }
    });
  }

  getHasError(name: string): boolean {
    const control = this.heroForm.get(name);
    return !!(control?.invalid && control?.touched);
  }

  getErrorMessage(name: string): string {
    const nameControl = this.heroForm.get(name);
    if (!nameControl?.errors || !nameControl.touched) return '';

    if (nameControl.errors['required']) return 'El nombre es requerido';
    if (nameControl.errors['minlength']) return `Mínimo ${nameControl.errors['minlength'].requiredLength} caracteres`;
    if (nameControl.errors['maxlength']) return `Máximo ${nameControl.errors['maxlength'].requiredLength} caracteres`;
    if (nameControl.errors['startsEmpty']) return 'El nombre no puede estar vacío';
    if (nameControl.errors['specialChar']) return 'El nombre no puede contener caracteres especiales';

    return '';
  }

  onCancel(): void {
    this.router.navigate([MENU_ROUTES.HEROES]);
  }

  onImageSelected(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
    this.heroForm.patchValue({ imageUrl });
  }

  onImageUploading(isUploading: boolean): void {
    this.imageUploading.set(isUploading);
  }

  addNewPower() {
    const name = this.newPowerNameControl.value?.trim();
    const description = this.newPowerDescControl.value?.trim();

    if (!name) {
      return;
    }

    const newPower = new Power(
      Math.random(),
      name,
      description || ''
    );

    const powersArray = this.heroForm.get('powers') as FormArray;
    const existingPower = powersArray.value.find((p: Power) =>
      p.name.toLowerCase() === name.toLowerCase()
    );

    if (existingPower) {
      this.toastService.showToast('El poder ya ha sido agregado');
      return;
    }

    powersArray.push(this.fb.control(newPower));

    this._powersTableData.set(
      powersArray.controls.map((control, index) => ({
        ...control.value,
        index
      }))
    );

    this.clearPowerForm();
  }

  clearPowerForm() {

    this.newPowerNameControl.reset();
    this.newPowerDescControl.reset();
  }

  removePower(index: number) {

    const powersArray = this.heroForm.get('powers') as FormArray;
    powersArray.removeAt(index);

    this._powersTableData.set(
      powersArray.controls.map((control, index) => ({
        ...control.value,
        index
      }))
    );
  }



}
