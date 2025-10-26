import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { NotificationService } from '../../../core/services';
import { SalonDataService } from '../../../core/data';
import { Product } from '../../../core/models';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgOptimizedImage, ProductModalComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

  products = this.salonDataService.products;
  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);

  openModal(product: Product | null = null) {
    this.editingProduct.set(product);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  handleSave(productData: Product) {
    if (this.editingProduct()) {
      // is an update
      this.salonDataService.updateProduct({ ...this.editingProduct()!, ...productData });
      this.notificationService.show('Produkt bol úspešne upravený.', 'success');
    } else {
      // is a new product
      this.salonDataService.addProduct(productData);
      this.notificationService.show('Produkt bol úspešne pridaný.', 'success');
    }
    this.closeModal();
  }

  handleDelete(product: Product) {
    if (confirm(`Naozaj chcete vymazať produkt "${product.name}"?`)) {
      this.salonDataService.deleteProduct(product.id);
      this.notificationService.show('Produkt bol vymazaný.', 'info');
    }
  }
}
