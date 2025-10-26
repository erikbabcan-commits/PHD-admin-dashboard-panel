
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { SalonService } from '../../../core/models';
import { ServiceModalComponent } from '../service-modal/service-modal.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ServiceModalComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  services = this.salonDataService.services;

  isModalOpen = signal(false);
  editingService = signal<SalonService | null>(null);

  openModal(service: SalonService | null = null) {
    this.editingService.set(service);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingService.set(null);
  }

  handleSave(serviceData: SalonService) {
    if (this.editingService()) {
      this.salonDataService.updateService({ ...this.editingService()!, ...serviceData });
      this.notificationService.show('Služba bola úspešne upravená.', 'success');
    } else {
      this.salonDataService.addService(serviceData);
      this.notificationService.show('Služba bola úspešne pridaná.', 'success');
    }
    this.closeModal();
  }

  handleDelete(service: SalonService) {
    if (confirm(`Naozaj chcete vymazať službu "${service.name}"?`)) {
      this.salonDataService.deleteService(service.id);
      this.notificationService.show('Služba bola vymazaná.', 'info');
    }
  }
}
