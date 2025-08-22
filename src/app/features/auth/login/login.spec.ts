import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth/auth';

describe('Login', () => {
  
  let loginComponent: Login;
  let fixture: ComponentFixture<Login>;
  let authService: any;
  let router: any;

  beforeEach(async () => {
    const authMock = {
      login: jest.fn(),
      getIsLoading: jest.fn()
    };
    const routerMock = {
      navigateByUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        Login,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    loginComponent = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should login successfully and navigate to dashboard', async () => {
    loginComponent.form.patchValue({
      email: 'user@test.com',
      password: 'user123'
    });
    
    authService.login.mockResolvedValue(true);
    
    await loginComponent.submit();
    
    expect(authService.login).toHaveBeenCalledWith('user@test.com', 'user123');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    expect(loginComponent.formError()).toBeNull();
  });

  it('should show error message on login failure', async () => {
    loginComponent.form.patchValue({
      email: 'wrong@test.com',
      password: 'wrong123'
    });
    
    authService.login.mockResolvedValue(false);
    
    await loginComponent.submit();
    
    expect(authService.login).toHaveBeenCalledWith('wrong@test.com', 'wrong123');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(loginComponent.formError()).toBe('Credenciales incorrectas. Verifique su email y contraseña.');
  });
});
