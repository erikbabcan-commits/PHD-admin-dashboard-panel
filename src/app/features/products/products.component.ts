
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalonDataService } from '../../core/data';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ClientHeaderComponent } from '../../shared/components/client-header/client-header.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgOptimizedImage, RouterLink, FooterComponent, ClientHeaderComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private salonDataService = inject(SalonDataService);
  products = this.salonDataService.products;
}