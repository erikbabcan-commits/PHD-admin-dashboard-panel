import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { GalleryItem } from '../../../core/models';
import { GalleryItemModalComponent } from '../gallery-item-modal/gallery-item-modal.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith, finalize, map } from 'rxjs';

@Component({
  selector: 'app-gallery-admin',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, GalleryItemModalComponent, SpinnerComponent],
  templateUrl: './gallery-admin.component.html',
  styleUrls: ['./gallery-admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryAdminComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  isLoading = signal(true);
  private _galleryItems$ = of(this.salonDataService.galleryItems()).pipe(
    delay(400), // Simulate network latency
    switchMap(items => {
      this.isLoading.set(false);
      return of(items);
    }),
    startWith([])
  );
  galleryItems = toSignal(this._galleryItems$, { initialValue: [] });

  isModalOpen = signal(false);
  editingItem = signal<GalleryItem | null>(null);
  isSaving = signal(false); // New signal for saving state within modal operation
  isDeleting = signal(false); // New signal for deleting state

  openModal(item: GalleryItem | null = null) {
    this.editingItem.set(item);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingItem.set(null);
  }

  handleSave(itemData: GalleryItem) {
    this.isSaving.set(true);
    const operation$ = this.editingItem() 
      ? this.salonDataService.updateGalleryItem(itemData).pipe(map(() => ({ message: 'Položka v galérii bola upravená.', type: 'success' as const })))
      : this.salonDataService.addGalleryItem(itemData).pipe(map(() => ({ message: 'Položka bola pridaná do galérie.', type: 'success' as const })));

    operation$.pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (result) => {
        this.notificationService.show(result.message, result.type);
        this.closeModal(); // Close modal only after successful save
      },
      error: (err) => {
        this.notificationService.show(err.message || 'Nepodarilo sa uložiť položku galérie.', 'error');
      }
    });
  }

  handleDelete(item: GalleryItem) {
    if (confirm(`Naozaj chcete vymazať položku "${item.title}" z galérie?`)) {
      this.isDeleting.set(true);
      this.salonDataService.deleteGalleryItem(item.id).pipe(
        finalize(() => this.isDeleting.set(false))
      ).subscribe({
        next: () => {
          this.notificationService.show('Položka bola vymazaná z galérie.', 'info');
        },
        error: (err) => {
          this.notificationService.show(err.message || 'Nepodarilo sa vymazať položku galérie.', 'error');
        }
      });
    }
  }
}