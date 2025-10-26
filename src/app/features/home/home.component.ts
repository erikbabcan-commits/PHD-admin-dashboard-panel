


import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { SalonDataService } from '../../core/data';
import { FooterComponent, ClientHeaderComponent } from '../../shared/components'; // Updated import paths
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, NgOptimizedImage, FooterComponent, ClientHeaderComponent, AboutComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private salonDataService = inject(SalonDataService);

  stylists = this.salonDataService.stylists;
  products = this.salonDataService.products;
}