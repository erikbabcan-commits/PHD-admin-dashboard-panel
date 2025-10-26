
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SalonDataService } from '../../core/data';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ClientHeaderComponent } from '../../shared/components/client-header/client-header.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, RouterLinkActive, FooterComponent, ClientHeaderComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private salonDataService = inject(SalonDataService);

  galleryItems = this.salonDataService.galleryItems;
  
  selectedCategory = signal('Všetky');

  categories = computed(() => {
    const allCategories = this.galleryItems().map(item => item.category);
    return ['Všetky', ...new Set(allCategories)];
  });

  filteredItems = computed(() => {
    const category = this.selectedCategory();
    if (category === 'Všetky') {
      return this.galleryItems();
    }
    return this.galleryItems().filter(item => item.category === category);
  });

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}