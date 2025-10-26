
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { Stylist } from '../../../core/models';
import { StylistModalComponent } from '../stylist-modal/stylist-modal.component';

@Component({
  selector: 'app-stylists',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, StylistModalComponent],
  templateUrl: './stylists.component.html',
  styleUrls: ['./stylists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylistsComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  stylists = this.salonDataService.stylists;
  services = this.salonDataService.services;

  isModalOpen = signal(false);
  editingStylist = signal<Stylist | null>(null);

  openModal(stylist: Stylist | null = null) {
    this.editingStylist.set(stylist);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingStylist.set(null);
  }

  handleSave(stylistData: Stylist) {
    if (this.editingStylist()) {
      this.salonDataService.updateStylist({ ...this.editingStylist()!, ...stylistData });
      this.notificationService.show('Stylista bol úspešne upravený.', 'success');
    } else {
      this.salonDataService.addStylist(stylistData);
      this.notificationService.show('Stylista bol úspešne pridaný.', 'success');
    }
    this.closeModal();
  }

  handleDelete(stylist: Stylist) {
    if (confirm(`Naozaj chcete vymazať stylistu "${stylist.name}"?`)) {
      this.salonDataService.deleteStylist(stylist.id);
      this.notificationService.show('Stylista bol vymazaný.', 'info');
    }
  }
}
