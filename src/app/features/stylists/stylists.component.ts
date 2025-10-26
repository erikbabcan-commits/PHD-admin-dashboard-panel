

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
// Add missing import for SalonDataService
import { SalonDataService } from '../../core/data';
import { FooterComponent, ClientHeaderComponent, SpinnerComponent } from '../../shared/components'; // Updated import paths
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith } from 'rxjs';

@Component({
  selector: 'app-stylists',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, FooterComponent, ClientHeaderComponent, SpinnerComponent],
  templateUrl: './stylists.component.html',
  styleUrls: ['./stylists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylistsComponent {
  private salonDataService = inject(SalonDataService);

  // Use a reactive approach for loading data and showing spinner
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
}