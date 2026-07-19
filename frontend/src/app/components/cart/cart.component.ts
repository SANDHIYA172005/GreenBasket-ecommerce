import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cart = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  increment(productId: string, currentQty: number): void {
    this.cart.updateQuantity(productId, currentQty + 1);
  }

  decrement(productId: string, currentQty: number): void {
    this.cart.updateQuantity(productId, currentQty - 1);
  }

  remove(productId: string): void {
    this.cart.remove(productId);
    this.toastService.show('Item removed from cart', 'info');
  }

  proceedToCheckout(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /** If the hotlinked photo fails to load, fall back to a neutral placeholder instead of a broken icon. */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src =
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#f1f5f9"/><text x="50%" y="50%" font-size="30" text-anchor="middle" dominant-baseline="middle">🛒</text></svg>`
      );
  }
}
