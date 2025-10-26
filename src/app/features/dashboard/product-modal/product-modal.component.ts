import { Component, ChangeDetectionStrategy, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  product = input<Product | null>();

  save = output<Product>();
  close = output<void>();

  productForm!: FormGroup;
  
  isEditMode = false;

  ngOnInit() {
    const p = this.product();
    this.isEditMode = !!p;

    this.productForm = this.fb.group({
      name: [p?.name || '', Validators.required],
      description: [p?.description || '', Validators.required],
      price: [p?.price || 0, [Validators.required, Validators.min(0.01)]],
      imageUrl: [p?.imageUrl || '', Validators.required],
    });
  }

  onSave() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const productData: Product = {
      id: this.product()?.id || Date.now(), // Generate a temporary ID for new products
      ...this.productForm.value
    };
    this.save.emit(productData);
  }

  onClose() {
    this.close.emit();
  }
}
