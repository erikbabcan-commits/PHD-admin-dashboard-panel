import { Component, ChangeDetectionStrategy, input, output, OnInit, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfile, SalonService, Stylist, Appointment } from '../../../core/models';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  initialData = input<{ date: Date; hour: number; stylistId: string } | null>();
  users = input.required<UserProfile[]>();
  services = input.required<SalonService[]>();
  stylists = input.required<Stylist[]>();

  // Outputs
  save = output<Omit<Appointment, 'id'>>();
  close = output<void>();

  appointmentForm!: FormGroup;

  initialStylist = computed(() => {
    const data = this.initialData();
    if (!data?.stylistId) return null;
    return this.stylists().find(s => s.id === data.stylistId) ?? null;
  });

  ngOnInit() {
    const data = this.initialData();
    const initialDate = data ? data.date.toISOString().split('T')[0] : '';
    const initialTime = data ? `${data.hour.toString().padStart(2, '0')}:00` : '';
    const initialStylistId = data ? data.stylistId : '';

    this.appointmentForm = this.fb.group({
      userId: ['', Validators.required],
      serviceId: ['', Validators.required],
      stylistId: [initialStylistId, Validators.required],
      date: [initialDate, Validators.required],
      time: [initialTime, Validators.required],
    });
  }

  onSave() {
    if (this.appointmentForm.invalid) {
      // Mark all fields as touched to show errors
      this.appointmentForm.markAllAsTouched();
      return;
    }
    const formValue = this.appointmentForm.value;
    const service = this.services().find(s => s.id === formValue.serviceId);
    if (!service) return;

    const startTime = new Date(`${formValue.date}T${formValue.time}`);
    const endTime = new Date(startTime.getTime() + service.duration * 60000);

    const newAppointment: Omit<Appointment, 'id'> = {
      userId: formValue.userId,
      stylistId: formValue.stylistId,
      serviceId: formValue.serviceId,
      startTime,
      endTime,
      status: 'upcoming',
    };
    
    this.save.emit(newAppointment);
  }

  onClose() {
    this.close.emit();
  }
}
