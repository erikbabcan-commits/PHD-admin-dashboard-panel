import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { Appointment } from '../../../core/models';
import { NotificationService } from '../../../core/services';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  // Data signals from the service
  private allAppointments = this.salonDataService.appointments;
  private users = this.salonDataService.users;
  private stylists = this.salonDataService.stylists;
  private services = this.salonDataService.services;

  isCancelling = signal(false); // New signal for cancellation state

  // Computed stats
  upcomingAppointmentsCount = computed(() => 
    this.allAppointments().filter(a => a.status === 'upcoming' && a.startTime > new Date()).length
  );
  clientCount = computed(() => this.users().length);
  stylistCount = computed(() => this.stylists().length);
  
  todaysAppointments = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return this.allAppointments()
      .filter(a => a.startTime >= today && a.startTime < tomorrow && a.status === 'upcoming')
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  });

  getAppointmentDetails(appointment: Appointment) {
    const stylist = this.stylists().find(s => s.id === appointment.stylistId);
    const service = this.services().find(s => s.id === appointment.serviceId);
    const user = this.users().find(u => u.uid === appointment.userId);
    return {
      stylistName: stylist?.name || 'Neznámy',
      serviceName: service?.name || 'Neznáma služba',
      userName: user?.name || 'Neznámy klient',
    };
  }

  cancelAppointment(appointment: Appointment) {
    if (confirm(`Naozaj chcete zrušiť termín pre klienta ${this.getAppointmentDetails(appointment).userName}?`)) {
      this.isCancelling.set(true);
      this.salonDataService.cancelAppointment(appointment.id).pipe(
        finalize(() => this.isCancelling.set(false))
      ).subscribe({
        next: () => {
          this.notificationService.show('Termín bol úspešne zrušený.', 'success');
        },
        error: (err) => {
          this.notificationService.show(err.message || 'Nepodarilo sa zrušiť termín.', 'error');
        }
      });
    }
  }
}