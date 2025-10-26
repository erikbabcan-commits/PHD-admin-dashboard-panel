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

  get skillsControls() {
    return this.stylistForm.get('skills') as FormArray<FormControl<string>>;
  }

  ngOnInit() {
    const s = this.stylist();
    this.isEditMode = !!s;

    const initialServiceIds = s?.services || [];
    
    // Create FormArray of booleans for checkboxes
    const serviceChecks = this.allServices().map(service => 
      new FormControl(initialServiceIds.includes(service.id))
    );

    // Create FormArray of strings for skills
    const skillsFormArray = this.fb.array(
      (s?.skills || []).map(skill => this.fb.control(skill, Validators.required))
    );

    this.stylistForm = this.fb.group({
      name: [s?.name || '', Validators.required],
      title: [s?.title || '', Validators.required],
      description: [s?.description || '', Validators.required],
      imageUrl: [s?.imageUrl || '', Validators.required],
      skills: skillsFormArray, // Use FormArray for skills
      serviceChecks: this.fb.array(serviceChecks)
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
      skills: formValue.skills, // Skills are now directly from FormArray
      services: selectedServiceIds,
    };
    
    this.save.emit(stylistData);
  }

  onClose() {
    this.close.emit();
  }

  addSkill(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value && this.skillsControls.controls.every(control => control.value !== value)) {
      this.skillsControls.push(this.fb.control(value, Validators.required));
      input.value = ''; // Clear the input after adding
    }
    event.preventDefault(); // Prevent form submission
  }

  removeSkill(index: number) {
    this.skillsControls.removeAt(index);
  }
}