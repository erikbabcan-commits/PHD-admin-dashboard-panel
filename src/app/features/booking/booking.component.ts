
import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SalonDataService } from '../../core/data';
import { SalonService, Stylist, Appointment } from '../../core/models';
import { NotificationService, AuthService } from '../../core/services';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { FooterComponent } from '../../shared/components/footer/footer.component';

type BookingStep = '1-service' | '2-stylist' | '3-time' | '4-confirm' | '5-booked';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink, SpinnerComponent, FooterComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- State Signals ---
  currentStep = signal<BookingStep>('1-service');
  selectedService = signal<SalonService | null>(null);
  selectedStylist = signal<Stylist | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<Date | null>(null);
  
  // --- Data Signals from Service ---
  services = this.salonDataService.services;
  currentUser = this.authService.currentUser;

  // --- Reactive Data Loading ---
  private stylistsForService$ = toObservable(this.selectedService).pipe(
    switchMap(service => 
      service ? this.salonDataService.getStylistsForService(service.id) : []
    )
  );
  stylistsForService = toSignal(this.stylistsForService$, { initialValue: [] });

  private timeSlotsTrigger = computed(() => ({
    stylist: this.selectedStylist(),
    date: this.selectedDate(),
    service: this.selectedService()
  }));

  private availableTimeSlots$ = toObservable(this.timeSlotsTrigger).pipe(
    switchMap(({ stylist, date, service }) => {
      if (!stylist || !date || !service) return [];
      return this.salonDataService.getAvailableTimeSlots(stylist.id, date, service.duration);
    })
  );
  availableTimeSlots = toSignal(this.availableTimeSlots$, { initialValue: [] });

  // --- UI Control ---
  weekdays = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
  calendarDays = signal<Date[]>([]);
  currentMonth = signal(new Date());

  constructor() {
    this.generateCalendar(new Date());
  }
  
  // --- Step Handlers ---
  selectService(service: SalonService) {
    this.selectedService.set(service);
    this.currentStep.set('2-stylist');
  }

  selectStylist(stylist: Stylist) {
    this.selectedStylist.set(stylist);
    this.currentStep.set('3-time');
  }

  selectTime(time: Date) {
    this.selectedTime.set(time);
    this.currentStep.set('4-confirm');
  }

  // --- Calendar Logic ---
  generateCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    // Fill initial empty days
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(new Date(0)); // Use a zero date as a placeholder
    }
    // Fill actual days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    this.calendarDays.set(days);
    this.currentMonth.set(date);
  }

  previousMonth() {
    this.generateCalendar(new Date(this.currentMonth().setMonth(this.currentMonth().getMonth() - 1)));
  }

  nextMonth() {
    this.generateCalendar(new Date(this.currentMonth().setMonth(this.currentMonth().getMonth() + 1)));
  }

  selectDate(day: Date) {
    if (this.isPastDate(day)) return;
    this.selectedDate.set(day);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }
  
  isSelectedDate(date: Date): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;
    return date.getDate() === selected.getDate() && date.getMonth() === selected.getMonth() && date.getFullYear() === selected.getFullYear();
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today;
  }

  // --- Confirmation & Booking ---
  confirmBooking() {
    const service = this.selectedService();
    const stylist = this.selectedStylist();
    const time = this.selectedTime();
    const user = this.currentUser();

    if (!service || !stylist || !time || !user) {
      this.notificationService.show('Chyba: Chýbajú údaje pre rezerváciu.', 'error');
      return;
    }
    
    const endTime = new Date(time.getTime() + service.duration * 60000);

    const newAppointment: Omit<Appointment, 'id'> = {
      userId: user.uid,
      stylistId: stylist.id,
      serviceId: service.id,
      startTime: time,
      endTime: endTime,
      status: 'upcoming'
    };

    this.salonDataService.createAppointment(newAppointment).subscribe(() => {
      this.notificationService.show('Váš termín bol úspešne rezervovaný!', 'success');
      this.currentStep.set('5-booked');
      setTimeout(() => this.router.navigate(['/my-appointments']), 2000);
    });
  }

  // --- Navigation ---
  goBack() {
    switch (this.currentStep()) {
      case '2-stylist': this.currentStep.set('1-service'); break;
      case '3-time': this.currentStep.set('2-stylist'); this.selectedDate.set(null); break;
      case '4-confirm': this.currentStep.set('3-time'); break;
    }
  }

  startOver() {
    this.currentStep.set('1-service');
    this.selectedService.set(null);
    this.selectedStylist.set(null);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
  }
}
