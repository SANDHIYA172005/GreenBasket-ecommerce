import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);

  orders: Order[] = [];
  isLoading = true;

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.orderService.getAllOrders().subscribe({
        next: (res) => {
          if (res.success) {
            this.orders = res.orders;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load orders', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }
}
