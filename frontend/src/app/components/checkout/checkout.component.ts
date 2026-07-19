import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  cart = inject(CartService);
  private auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  fullName = this.auth.currentUser()?.name ?? '';
  address = '';
  city = '';
  pincode = '';
  phone = '';
  paymentMethod: Order['paymentMethod'] = 'COD';

  errorMessage = '';
  placedOrder: Order | null = null;

  placeOrder(): void {
    this.errorMessage = '';

    if (this.cart.items().length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }
    if (!this.fullName || !this.address || !this.city || !this.pincode || !this.phone) {
      this.errorMessage = 'Please fill in all delivery details.';
      return;
    }

    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const fullAddress = `${this.fullName}, ${this.address}, ${this.city} - ${this.pincode} (Ph: ${this.phone})`;
    this.orderService.placeOrder(user.id, this.cart.items(), fullAddress, this.paymentMethod).subscribe({
      next: (res) => {
        if (res.success) {
          this.placedOrder = res.order;
          this.cart.clear();
          this.toastService.show('Order placed successfully! 🚀', 'success');
        } else {
          this.errorMessage = res.message || 'Failed to place order.';
        }
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while placing your order.';
        console.error('Error placing order:', err);
      }
    });
  }

  goToTracking(): void {
    if (this.placedOrder) {
      this.router.navigate(['/orders', this.placedOrder.id]);
    }
  }
}
