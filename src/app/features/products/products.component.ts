


import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalonDataService } from '../../core/data';
import { FooterComponent, ClientHeaderComponent, SpinnerComponent } from '../../shared/components'; // Updated import paths
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgOptimizedImage, RouterLink, FooterComponent, ClientHeaderComponent, SpinnerComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private salonDataService = inject(SalonDataService);

  // Use a reactive approach for loading data and showing spinner
  isLoading = signal(true);
  private _products$ = of(this.salonDataService.products()).pipe(
    delay(400), // Simulate network latency
    switchMap(items => {
      this.isLoading.set(false);
      return of(items);
    }),
    startWith([])
  );
  products = toSignal(this._products$, { initialValue: [] });
}