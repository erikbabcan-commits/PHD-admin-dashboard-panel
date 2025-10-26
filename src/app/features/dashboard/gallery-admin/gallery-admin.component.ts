
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SalonDataService } from '../../../core/data';
import { NotificationService } from '../../../core/services';
import { GalleryItem } from '../../../core/models';
import { GalleryItemModalComponent } from '../gallery-item-modal/gallery-item-modal.component';

@Component({
  selector: 'app-gallery-admin',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, GalleryItemModalComponent],
  templateUrl: './gallery-admin.component.html',
  styleUrls: ['./gallery-admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryAdminComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  galleryItems = this.salonDataService.galleryItems;

  isModalOpen = signal(false);
  editingItem = signal<GalleryItem | null>(null);

  openModal(item: GalleryItem | null = null) {
    this.editingItem.set(item);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingItem.set(null);
  }

  handleSave(itemData: GalleryItem) {
    if (this.editingItem()) {
      this.salonDataService.updateGalleryItem({ ...this.editingItem()!, ...itemData });
      this.notificationService.show('Položka v galérii bola upravená.', 'success');
    } else {
      this.salonDataService.addGalleryItem(itemData);
      this.notificationService.show('Položka bola pridaná do galérie.', 'success');
    }
    this.closeModal();
  }

  handleDelete(item: GalleryItem) {
    if (confirm(`Naozaj chcete vymazať položku "${item.title}" z galérie?`)) {
      this.salonDataService.deleteGalleryItem(item.id);
      this.notificationService.show('Položka bola vymazaná z galérie.', 'info');
    }
  }
}
