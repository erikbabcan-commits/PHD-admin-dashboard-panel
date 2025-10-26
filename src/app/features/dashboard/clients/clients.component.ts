import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { UserProfile } from '../../../core/models';
import { ClientModalComponent } from '../client-modal/client-modal.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith, finalize, map } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ClientModalComponent, SpinnerComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  isLoading = signal(true);
  private _clients$ = of(this.salonDataService.users()).pipe(
    delay(400), // Simulate network latency
    switchMap(items => {
      this.isLoading.set(false);
      return of(items);
    }),
    startWith([])
  );
  clients = toSignal(this._clients$, { initialValue: [] });

  isModalOpen = signal(false);
  editingClient = signal<UserProfile | null>(null);
  isSaving = signal(false); // New signal for saving state within modal operation
  isDeleting = signal(false); // New signal for deleting state

  openModal(client: UserProfile | null = null) {
    this.editingClient.set(client);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingClient.set(null);
  }

  handleSave(clientData: UserProfile) {
    this.isSaving.set(true);
    const operation$ = this.editingClient() 
      ? this.salonDataService.updateUser(clientData).pipe(map(() => ({ message: 'Klient bol úspešne upravený.', type: 'success' as const })))
      : this.salonDataService.addUser(clientData).pipe(map(() => ({ message: 'Klient bol úspešne pridaný.', type: 'success' as const })));

    operation$.pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (result) => {
        this.notificationService.show(result.message, result.type);
        this.closeModal(); // Close modal only after successful save
      },
      error: (err) => {
        this.notificationService.show(err.message || 'Nepodarilo sa uložiť klienta.', 'error');
      }
    });
  }

  handleDelete(client: UserProfile) {
    if (confirm(`Naozaj chcete vymazať klienta "${client.name}"?`)) {
      this.isDeleting.set(true);
      this.salonDataService.deleteUser(client.uid).pipe(
        finalize(() => this.isDeleting.set(false))
      ).subscribe({
        next: () => {
          this.notificationService.show('Klient bol vymazaný.', 'info');
        },
        error: (err) => {
          this.notificationService.show(err.message || 'Nepodarilo sa vymazať klienta.', 'error');
        }
      });
    }
  }
}