


import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent, ClientHeaderComponent, SpinnerComponent } from '../../shared/components'; // Updated import paths
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, ClientHeaderComponent, SpinnerComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  // Simulate loading for consistency
  isLoading = signal(true);
  private _dataLoaded$ = of(true).pipe(
    delay(400), // Simulate network latency
    switchMap(loaded => {
      this.isLoading.set(false);
      return of(loaded);
    }),
    startWith(false)
  );
  dataLoaded = toSignal(this._dataLoaded$, { initialValue: false });
}