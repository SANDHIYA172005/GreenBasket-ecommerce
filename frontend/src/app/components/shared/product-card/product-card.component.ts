import { Component, Input, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, getDiscountPercent } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';
import { CartService } from '../../../services/cart.service';

/**
 * Reusable product card used across the Home page (Featured / Best Sellers)
 * and the Product List page. Keeping this as one component means the card's
 * look stays consistent everywhere and only needs to be updated in one place.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  private toastService = inject(ToastService);
  private cartService = inject(CartService);

  @Input({ required: true }) product!: Product;

  quantity = computed(() => {
    const item = this.cartService.items().find(i => i.product.id === this.product?.id);
    return item ? item.quantity : 0;
  });

  get discountPercent(): number {
    return getDiscountPercent(this.product);
  }

  /** Builds a simple array like [true, true, true, false, false] for a 5-star display. */
  get starStates(): boolean[] {
    const filled = Math.round(this.product.rating);
    return Array.from({ length: 5 }, (_, i) => i < filled);
  }

  onAddToCart(): void {
    if (!this.product.inStock) return;
    this.cartService.add(this.product, 1);
    this.toastService.show(`${this.product.name} added to cart`, 'success');
  }

  increment(): void {
    if (!this.product.inStock) return;
    this.cartService.add(this.product, 1);
  }

  decrement(): void {
    const currentQuantity = this.quantity();
    if (currentQuantity > 0) {
      this.cartService.updateQuantity(this.product.id, currentQuantity - 1);
    }
  }

  /** Fallback if a product image URL fails to load. */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
           <rect width="400" height="300" fill="#f8fafc"/>
           <text x="50%" y="50%" font-size="16" fill="#94a3b8" text-anchor="middle" dy=".3em">Image unavailable</text>
         </svg>`
      );
  }
}
