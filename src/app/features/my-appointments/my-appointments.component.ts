
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { AuthService, NotificationService } from '../../core/services';
import { SalonDataService } from '../../core/data';
import { Appointment } from '../../core/models';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, FooterComponent],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAppointmentsComponent {
  private authService = inject(AuthService);
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);
  
  private appointments$ = this.authService.currentUser.pipe(
    switchMap(user => {
      if (!user) return of([]);
      return this.salonDataService.getUserAppointments(user.uid);
    })
  );
  private appointments = toSignal(this.appointments$, { initialValue: [] });
  
  upcomingAppointments = computed(() => 
    this.appointments()
      .filter(a => a.status === 'upcoming' && a.startTime >= new Date())
      .sort((a,b) => a.startTime.getTime() - b.startTime.getTime())
  );
  
  pastAppointments = computed(() => 
    this.appointments()
      .filter(a => a.status !== 'upcoming' || a.startTime < new Date())
  );

  getAppointmentDetails(appointment: Appointment) {
    const stylist = this.salonDataService.stylists().find(s => s.id === appointment.stylistId);
    const service = this.salonDataService.services().find(s => s.id === appointment.serviceId);
    return {
      stylistName: stylist?.name ?? 'Neznámy',
      serviceName: service?.name ?? 'Neznáma služba',
      stylistImageUrl: stylist?.imageUrl ?? ''
    };
  }

  cancelAppointment(appointmentId: string) {
    if(confirm('Naozaj si želáte zrušiť tento termín?')) {
      this.salonDataService.cancelAppointment(appointmentId);
      this.notificationService.show('Termín bol úspešne zrušený.', 'success');
    }
  }

  getStatusInfo(status: Appointment['status']): { text: string; color: string } {
    switch (status) {
      case 'completed': return { text: 'Uskutočnený', color: 'text-green-400' };
      case 'cancelled': return { text: 'Zrušený', color: 'text-red-400' };
      case 'no-show': return { text: 'Neúčasť', color: 'text-yellow-400' };
      default: return { text: 'Nadchádzajúci', color: 'text-blue-400' };
    }
  }
}
