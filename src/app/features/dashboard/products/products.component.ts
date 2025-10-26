import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { NotificationService } from '../../../core/services';
import { SalonDataService } from '../../../core/data';
import { Product } from '../../../core/models';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, switchMap, startWith, finalize, map } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgOptimizedImage, ProductModalComponent, SpinnerComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private salonDataService = inject(SalonDataService);
  private notificationService = inject(NotificationService);

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
  
  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);
  isSaving = signal(false); // New signal for saving state within modal operation
  isDeleting = signal(false); // New signal for deleting state

  openModal(product: Product | null = null) {
    this.editingProduct.set(product);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  handleSave(productData: Product) {
    this.isSaving.set(true);
    const operation$ = this.editingProduct() 
      ? this.salonDataService.updateProduct(productData).pipe(map(() => ({ message: 'Produkt bol úspešne upravený.', type: 'success' as const })))
      : this.salonDataService.addProduct(productData).pipe(map(() => ({ message: 'Produkt bol úspešne pridaný.', type: 'success' as const })));

    operation$.pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (result) => {
        this.notificationService.show(result.message, result.type);
        this.closeModal(); // Close modal only after successful save
      },
      error: (err) => {
        this.notificationService.show(err.message || 'Nepodarilo sa uložiť produkt.', 'error');
      }
    });
  }

  handleDelete(product: Product) {
    if (confirm(`Naozaj chcete vymazať produkt "${product.name}"?`)) {
      this.isDeleting.set(true);
      this.salonDataService.deleteProduct(product.id).pipe(
        finalize(() => this.isDeleting.set(false))
      ).subscribe({
        next: () => {
          this.notificationService.show('Produkt bol vymazaný.', 'info');
        },
        error: (err) => {
          this.notificationService.show(err.message || 'Nepodarilo sa vymazať produkt.', 'error');
        }
      });
    }
  }
}