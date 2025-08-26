import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { HeroForm } from './hero-form';
import { HeroService } from '../../../core/services/hero/hero';
import { ToastService } from '../../../core/services/toast/toast';

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;

  const mockHeroService = {
    loading$: of(false),
    getHeroById: () => of(null),
    registerHero: () => of(null),
    updateHero: () => of(null)
  }

  const mockToastService = {
    showToast: () => {}
  }

  const mockRouter = {
    navigate: () => {}
  }

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => null
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroForm,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: ToastService, useValue: mockToastService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize form with initial values', () => {

    expect(component.heroForm.get('name')).toBeTruthy();
    expect(component.heroForm.get('imageUrl')).toBeTruthy();
    expect(component.heroForm.get('powers')).toBeTruthy();
  
    const nameValue = component.heroForm.get('name')?.value
    const imageValue = component.heroForm.get('imageUrl')?.value
    const powersValue = component.heroForm.get('powers')?.value
    
    expect(nameValue === '' || nameValue === null).toBeTruthy()
    expect(imageValue === '' || imageValue === null).toBeTruthy()
    expect(Array.isArray(powersValue)).toBeTruthy();
    expect(powersValue.length).toBe(0);
  });


  it('should show correct button text for create mode', () => {
    expect(component.isEditMode()).toBeFalsy()
    expect(component.buttonText()).toBe('Guardar')
    expect(component.title()).toBe('Crear héroe')
  })

  it('should have invalid form initially', () => {
    expect(component.heroForm.valid).toBeFalsy()
    expect(component.heroForm.get('name')?.hasError('required')).toBeTruthy()
    expect(component.heroForm.get('powers')?.hasError('required')).toBeTruthy()
  })
});