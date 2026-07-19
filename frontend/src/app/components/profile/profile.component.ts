import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private orderService = inject(OrderService);

  fullProfile = signal<any>(null);
  orderCount = signal<number>(0);

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.auth.getProfile().subscribe({
        next: (res) => {
          if (res.success) {
            this.fullProfile.set(res.user);
          }
        },
        error: (err) => console.error('Failed to load profile', err),
      });

      this.orderService.getAllOrders().subscribe({
        next: (res) => {
          if (res.success) {
            this.orderCount.set(res.count);
          }
        },
        error: (err) => console.error('Failed to load orders', err)
      });
    }
  }
}
