
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalonDataService } from '../../core/data';

@Component({
  selector: 'app-stylists',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './stylists.component.html',
  styleUrls: ['./stylists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylistsComponent {
  private salonDataService = inject(SalonDataService);
  stylists = this.salonDataService.stylists;
}
