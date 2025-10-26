
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { Stylist } from '../../../core/models';
import { StylistModalComponent } from '../stylist-modal/stylist-modal.component';
import { SpinnerComponent } from '../../../shared/components'; // Updated import path
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith, finalize, map } from 'rxjs';

@Component({
  selector: 'app-stylists',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, StylistModalComponent, SpinnerComponent],
  templateUrl: './stylists.component.html',
  styleUrls: ['./stylists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylistsComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  isLoading = signal(true);
  private _stylists$ = of(this.salonDataService.stylists()).pipe(
    delay(400), // Simulate network latency
    switchMap(items => {
      this.isLoading.set(false);
      return of(items);
    }),
    startWith([])
  );
  stylists = toSignal(this._stylists$, { initialValue: [] });
  services = this.salonDataService.services; // Services are typically loaded quickly or cached

  isModalOpen = signal(false);
  editingStylist = signal<Stylist | null>(null);
  isSaving = signal(false); // New signal for saving state within modal operation
  isDeleting = signal(false); // New signal for deleting state

  openModal(stylist: Stylist | null = null) {
    this.editingStylist.set(stylist);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingStylist.set(null);
  }

  handleSave(stylistData: Stylist) {
    this.isSaving.set(true);
    const operation$ = this.editingStylist() 
      ? this.salonDataService.updateStylist(stylistData).pipe(map(() => ({ message: 'Stylista bol úspešne upravený.', type: 'success' as const })))
      : this.salonDataService.addStylist(stylistData).pipe(map(() => ({ message: 'Stylista bol úspešne pridaný.', type: 'success' as const })));

    operation$.pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (result) => {
        this.notificationService.show(result.message, result.type);
        this.closeModal(); // Close modal only after successful save
      },
      error: (err) => {
        this.notificationService.show(err.message || 'Nepodarilo sa uložiť stylistu.', 'error');
      }
    });
  }

  handleDelete(stylist: Stylist) {
    if (confirm(`Naozaj chcete vymazať stylistu "${stylist.name}"?`)) {
      this.isDeleting.set(true);
      this.salonDataService.deleteStylist(stylist.id).pipe(
        finalize(() => this.isDeleting.set(false))
      ).subscribe({
        next: () => {
          this.notificationService.show('Stylista bol vymazaný.', 'info');
        },
        error: (err) => {
          this.notificationService.show(err.message || 'Nepodarilo sa vymazať stylistu.', 'error');
        }
      });
    }
  }
}