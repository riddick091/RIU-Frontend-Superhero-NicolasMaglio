import { ToastService } from './../../../core/services/toast/toast';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ROUTES } from '@angular/router';
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
import { firstValueFrom } from 'rxjs';
import { UppercaseDirective } from '../../../shared/directives/uppercase';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

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
    MatTableModule, ImageUpload, UppercaseDirective, LoadingSpinner],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.css'
})
export class HeroForm {
  private fb = inject(FormBuilder);
  private heroService = inject(HeroService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private currentHero = signal<Hero | null>(null);

  private selectedImage = signal<string | null>(null);
  imageUploading = signal<boolean>(false);

  private heroId = signal<number | null>(null);

  private isLoadingHero = signal<boolean>(false);
  private isSavingHero = signal<boolean>(false);

  isLoading = computed(() => this.isLoadingHero() || this.isSavingHero());
  isEditMode = computed(() => this.heroId() !== null);
  title = computed(() => this.isEditMode() ? 'Editar héroe' : 'Crear héroe');
  buttonText = computed(() => this.isEditMode() ? 'Actualizar' : 'Guardar');

  newPowerNameControl = this.fb.control('');
  newPowerDescControl = this.fb.control('');

  displayedColumns: string[] = ['powerName', 'powerDescription', 'powerActions'];

  private _powersTableData = signal<any[]>([]);
  powersTableData = this._powersTableData.asReadonly()

  loading = toSignal(this.heroService.loading$);

  constructor() {
    effect(() => {
      this.heroForm.reset();

      const id = this.route.snapshot.paramMap.get('id')
      if (id && id !== 'new') {
        this.heroId.set(parseInt(id, 10))
        this.loadHeroEdit()
      }
    })
  }

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

  private async loadHeroEdit(): Promise<void> {

    const id = this.heroId();
    if (!id) {
      this.router.navigate([MENU_ROUTES.HEROES]);
      return
    }

    try {
      this.isLoadingHero.set(true);
      const hero = await firstValueFrom(this.heroService.getHeroById(id));

      if (!hero) {
        this.router.navigate([MENU_ROUTES.HEROES]);
        return
      }

      this.currentHero.set(hero);
      this.loadHero(hero);
    } catch (error) {
      console.error('Error cargando héroe:', error);
    } finally {
      this.isLoadingHero.set(false);
    }

  }

  private loadHero(hero: Hero): void {
    this.heroForm.patchValue({
      name: hero.name,
      imageUrl: hero.imageUrl || ''
    });

    if (hero.imageUrl) {
      this.selectedImage.set(hero.imageUrl)
    }

    const powersArray = this.heroForm.get('powers') as FormArray;

    powersArray.clear()

    hero.powers.forEach(power => {
      powersArray.push(this.fb.control(power));
    });

    this._powersTableData.set(
      powersArray.controls.map((control, index) => ({
        ...control.value,
        index
      }))
    );

  }

  async onSubmit(): Promise<void> {

    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    
    this.isSavingHero.set(true);

    const formValue = this.heroForm.getRawValue();
    const heroData: Partial<Hero> = {
      name: formValue.name,
      powers: formValue.powers,
      imageUrl: formValue.imageUrl
    }

    try {
      if (this.isEditMode()) {
        const currentHero = this.currentHero();

        const updatedHero = {
          ...currentHero,
          name: heroData.name,
          powers: heroData.powers,
          imageUrl: heroData.imageUrl
        } as Hero;

        await firstValueFrom(this.heroService.updateHero(updatedHero));
      } else {
        await firstValueFrom(this.heroService.registerHero(heroData as Omit<Hero, 'id'>));
      }
    } catch (error) {
      this.toastService.showToast('Error inesperado al guardar el héroe');
    } finally {
      this.isSavingHero.set(false);
      this.router.navigate([MENU_ROUTES.HEROES]);
    }
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

  get currentImageUrl() {
    return this.selectedImage();
  }

}
