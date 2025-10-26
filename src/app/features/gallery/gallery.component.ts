

import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SalonDataService } from '../../core/data';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ClientHeaderComponent } from '../../shared/components/client-header/client-header.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, delay, startWith } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, RouterLinkActive, FooterComponent, ClientHeaderComponent, SpinnerComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private salonDataService = inject(SalonDataService);

  // Use a reactive approach for loading data and showing spinner
  isLoading = signal(true);
  private _galleryItems$ = of(this.salonDataService.galleryItems()).pipe(
    delay(400), // Simulate network latency
    switchMap(items => {
      this.isLoading.set(false);
      return of(items);
    }),
    startWith([]) // Initial empty array for signal before data arrives
  );
  galleryItems = toSignal(this._galleryItems$, { initialValue: [] });
  
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