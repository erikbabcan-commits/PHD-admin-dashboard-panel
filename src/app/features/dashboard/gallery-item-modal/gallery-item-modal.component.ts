import { Component, ChangeDetectionStrategy, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GalleryItem } from '../../../core/models';

@Component({
  selector: 'app-gallery-item-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gallery-item-modal.component.html',
  styleUrls: ['./gallery-item-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryItemModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  item = input<GalleryItem | null>();
  isSaving = input(false); // New input for saving state

  save = output<GalleryItem>();
  close = output<void>();

  itemForm!: FormGroup;
  
  isEditMode = false;

  ngOnInit() {
    const i = this.item();
    this.isEditMode = !!i;

    this.itemForm = this.fb.group({
      title: [i?.title || '', Validators.required],
      category: [i?.category || '', Validators.required],
      imageUrl: [i?.imageUrl || '', Validators.required],
    });
  }

  onSave() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    const itemData: GalleryItem = {
      id: this.item()?.id || Date.now(),
      ...this.itemForm.value
    };
    this.save.emit(itemData);
  }

  onClose() {
    this.close.emit();
  }
}