import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { UserProfile } from '../../../core/models';
import { ClientModalComponent } from '../client-modal/client-modal.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ClientModalComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  clients = this.salonDataService.users;

  isModalOpen = signal(false);
  editingClient = signal<UserProfile | null>(null);

  openModal(client: UserProfile | null = null) {
    this.editingClient.set(client);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingClient.set(null);
  }

  handleSave(clientData: UserProfile) {
    if (this.editingClient()) {
      this.salonDataService.updateUser({ ...this.editingClient()!, ...clientData });
      this.notificationService.show('Klient bol úspešne upravený.', 'success');
    } else {
      this.salonDataService.addUser(clientData);
      this.notificationService.show('Klient bol úspešne pridaný.', 'success');
    }
    this.closeModal();
  }

  handleDelete(client: UserProfile) {
    if (confirm(`Naozaj chcete vymazať klienta "${client.name}"?`)) {
      this.salonDataService.deleteUser(client.uid);
      this.notificationService.show('Klient bol vymazaný.', 'info');
    }
  }
}
