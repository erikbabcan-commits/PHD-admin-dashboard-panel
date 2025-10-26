

import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ClientHeaderComponent } from '../../shared/components/client-header/client-header.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, ClientHeaderComponent, SpinnerComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
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