import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule, MatButtonModule, MatIconModule, LoadingSpinner],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {

  @Input() currentImageUrl: string | null = null;
  @Input() isUploading: boolean = false;
  @Output() imageSelected = new EventEmitter<string>();
  @Output() uploadingChange = new EventEmitter<boolean>();


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede ser mayor a 5MB');
      return;
    }

    this.uploadImage(file);
  }

  private uploadImage(file: File): void {
    this.uploadingChange.emit(true);
    const reader = new FileReader();
    reader.onload = () => {

      this.imageSelected.emit(reader.result as string);
      this.uploadingChange.emit(false);

    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageSelected.emit('');
  }
}
