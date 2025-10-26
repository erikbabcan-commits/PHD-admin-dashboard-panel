import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Appointment, SalonService, Stylist, UserProfile } from '../../../core/models';
import { SalonDataService } from '../../../core/data';
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { NotificationService } from '../../../core/services';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe, AppointmentModalComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  stylists = this.salonDataService.stylists;
  services = this.salonDataService.services;
  users = this.salonDataService.users;
  allAppointments = this.salonDataService.appointments;
  
  selectedDate = signal(new Date());
  
  isModalOpen = signal(false);
  modalInitialData = signal<{ date: Date; hour: number; stylistId: string } | null>(null);
  isSavingAppointment = signal(false); // New signal for saving state

  hours = Array.from({ length: 12 }, (_, i) => 9 + i); // 9 AM to 8 PM

  appointmentsByStylistAndHour = computed(() => {
    const appointmentsMap = new Map<string, Appointment>();
    const date = this.selectedDate();
    
    this.allAppointments()
      .filter(a => {
        const apptDate = a.startTime;
        return apptDate.getDate() === date.getDate() &&
               apptDate.getMonth() === date.getMonth() &&
               apptDate.getFullYear() === date.getFullYear();
      })
      .forEach(appt => {
        const startHour = appt.startTime.getHours();
        // Calculate duration in 1-hour slots, rounding up.
        const durationInHours = Math.ceil((appt.endTime.getTime() - appt.startTime.getTime()) / (1000 * 60 * 60));

        for (let i = 0; i < durationInHours; i++) {
          const hour = startHour + i;
          const key = `${appt.stylistId}-${hour}`;
          if (!appointmentsMap.has(key)) {
            appointmentsMap.set(key, appt);
          }
        }
      });
    return appointmentsMap;
  });
  
  getAppointmentFor(stylistId: string, hour: number): Appointment | undefined {
    return this.appointmentsByStylistAndHour().get(`${stylistId}-${hour}`);
  }

  getServiceName(serviceId: string): string {
    return this.services().find(s => s.id === serviceId)?.name || 'Neznáma služba';
  }

  getUserName(userId: string): string {
    return this.users().find(u => u.uid === userId)?.name || 'Neznámy klient';
  }

  changeDate(days: number) {
    this.selectedDate.update(d => {
      const newDate = new Date(d);
      newDate.setDate(d.getDate() + days);
      return newDate;
    });
  }
  
  goToToday() {
    this.selectedDate.set(new Date());
  }

  openAddModal(hour: number, stylistId: string) {
    this.modalInitialData.set({ date: this.selectedDate(), hour: hour, stylistId: stylistId });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.modalInitialData.set(null);
  }

  handleSaveAppointment(appointmentData: Omit<Appointment, 'id'>) {
    this.isSavingAppointment.set(true);
    this.salonDataService.createAppointment(appointmentData).pipe(
      finalize(() => this.isSavingAppointment.set(false))
    ).subscribe({
      next: () => {
        this.notificationService.show('Termín bol úspešne vytvorený.', 'success');
        this.closeModal();
      },
      error: (err) => {
        this.notificationService.show(err.message || 'Nepodarilo sa vytvoriť termín.', 'error');
      }
    });
  }
}