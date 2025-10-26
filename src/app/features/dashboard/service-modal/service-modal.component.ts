import { Component, ChangeDetectionStrategy, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalonService } from '../../../core/models';

@Component({
  selector: 'app-service-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  service = input<SalonService | null>();
  isSaving = input(false); // New input for saving state

  save = output<SalonService>();
  close = output<void>();

  serviceForm!: FormGroup;
  
  isEditMode = false;

  categories: SalonService['category'][] = ['Dámske', 'Pánske', 'Farbenie', 'Ostatné'];

  ngOnInit() {
    const s = this.service();
    this.isEditMode = !!s;

    this.serviceForm = this.fb.group({
      name: [s?.name || '', Validators.required],
      duration: [s?.duration || 30, [Validators.required, Validators.min(15)]],
      price: [s?.price || 0, [Validators.required, Validators.min(0.01)]],
      category: [s?.category || 'Ostatné', Validators.required],
    });
  }

  onSave() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }
    const serviceData: SalonService = {
      id: this.service()?.id || `service-${Date.now()}`,
      ...this.serviceForm.value
    };
    this.save.emit(serviceData);
  }

  onClose() {
    this.close.emit();
  }
}