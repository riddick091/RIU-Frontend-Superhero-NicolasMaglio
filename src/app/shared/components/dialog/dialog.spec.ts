import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { Dialog } from './dialog';

describe('Dialog', () => {
  let component: Dialog;
  let fixture: ComponentFixture<Dialog>;
  let mockDialogRef: any;

  beforeEach(async () => {
 
    mockDialogRef = {
      close: jest.fn() 
    };

    await TestBed.configureTestingModule({
      imports: [
        Dialog,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test message' } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message from data', () => {
    expect(component.data.message).toBe('Test message');
  });

  it('should close dialog with true on confirm', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});