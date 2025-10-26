import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { SalonService } from '../../../core/models';
import { ServiceModalComponent } from '../service-modal/service-modal.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith, finalize, map } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ServiceModalComponent, SpinnerComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  isLoading = signal(true);
  private _services$ = of(this.salonDataService.services()).pipe(
    delay(400), // Simulate network latency
    switchMap(items => {
      this.isLoading.set(false);
      return of(items);
    }),
    startWith([])
  );
  services = toSignal(this._services$, { initialValue: [] });

  isModalOpen = signal(false);
  editingService = signal<SalonService | null>(null);
  isSaving = signal(false); // New signal for saving state within modal operation
  isDeleting = signal(false); // New signal for deleting state

  openModal(service: SalonService | null = null) {
    this.editingService.set(service);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingService.set(null);
  }

  handleSave(serviceData: SalonService) {
    this.isSaving.set(true);
    const operation$ = this.editingService() 
      ? this.salonDataService.updateService(serviceData).pipe(map(() => ({ message: 'Služba bola úspešne upravená.', type: 'success' as const })))
      : this.salonDataService.addService(serviceData).pipe(map(() => ({ message: 'Služba bola úspešne pridaná.', type: 'success' as const })));

    operation$.pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (result) => {
        this.notificationService.show(result.message, result.type);
        this.closeModal(); // Close modal only after successful save
      },
      error: (err) => {
        this.notificationService.show(err.message || 'Nepodarilo sa uložiť službu.', 'error');
      }
    });
  }

  handleDelete(service: SalonService) {
    if (confirm(`Naozaj chcete vymazať službu "${service.name}"?`)) {
      this.isDeleting.set(true);
      this.salonDataService.deleteService(service.id).pipe(
        finalize(() => this.isDeleting.set(false))
      ).subscribe({
        next: () => {
          this.notificationService.show('Služba bola vymazaná.', 'info');
        },
        error: (err) => {
          this.notificationService.show(err.message || 'Nepodarilo sa vymazať službu.', 'error');
        }
      });
    }
  }
}