

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalonDataService } from '../../core/data';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ClientHeaderComponent } from '../../shared/components/client-header/client-header.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
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