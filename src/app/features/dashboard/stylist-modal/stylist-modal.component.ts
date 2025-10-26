
import { Component, ChangeDetectionStrategy, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { Stylist, SalonService } from '../../../core/models';

@Component({
  selector: 'app-stylist-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stylist-modal.component.html',
  styleUrls: ['./stylist-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylistModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  stylist = input<Stylist | null>();
  allServices = input.required<SalonService[]>();

  save = output<Stylist>();
  close = output<void>();

  stylistForm!: FormGroup;
  
  isEditMode = false;

  get serviceControls() {
    return this.stylistForm.get('serviceChecks') as FormArray;
  }

  ngOnInit() {
    const s = this.stylist();
    this.isEditMode = !!s;

    const initialServiceIds = s?.services || [];
    
    // Create FormArray of booleans for checkboxes
    const serviceChecks = this.allServices().map(service => 
      new FormControl(initialServiceIds.includes(service.id))
    );

    this.stylistForm = this.fb.group({
      name: [s?.name || '', Validators.required],
      title: [s?.title || '', Validators.required],
      description: [s?.description || '', Validators.required],
      imageUrl: [s?.imageUrl || '', Validators.required],
      skills: [s?.skills.join(', ') || ''],
      serviceChecks: this.fb.array(serviceChecks) // Separate FormArray for checks
    });
  }

  onSave() {
    if (this.stylistForm.invalid) {
      this.stylistForm.markAllAsTouched();
      return;
    }

    const formValue = this.stylistForm.value;
    
    // Calculate selected service IDs from FormArray
    const selectedServiceIds: string[] = this.allServices()
      .filter((service, index) => formValue.serviceChecks[index])
      .map(service => service.id);

    const stylistData: Stylist = {
      id: this.stylist()?.id || `stylist-${Date.now()}`,
      name: formValue.name,
      title: formValue.title,
      description: formValue.description,
      imageUrl: formValue.imageUrl,
      skills: formValue.skills.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill),
      services: selectedServiceIds, // Use the calculated array
    };
    
    this.save.emit(stylistData);
  }

  onClose() {
    this.close.emit();
  }
}
