

import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div role="status" class="flex flex-col justify-center items-center gap-4 py-8">
      <div class="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-gold"></div>
      @if (message()) {
        <p class="text-brand-light/70">{{ message() }}</p>
      }
      <span class="sr-only">Načítavam...</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  message = input<string>();
}