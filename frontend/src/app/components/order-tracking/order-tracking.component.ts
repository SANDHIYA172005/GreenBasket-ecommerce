import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css',
})
export class OrderTrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  orderService = inject(OrderService);

  order: Order | undefined;
  statusSequence: OrderStatus[] = this.orderService.getStatusSequence();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getById(id).subscribe({
        next: (res) => { if (res.success) this.order = res.order; },
        error: (err) => console.error('Failed to load order', err)
      });
    }
  }

  stepIndex(status: OrderStatus): number {
    return this.statusSequence.indexOf(status);
  }

  isStepDone(status: OrderStatus): boolean {
    if (!this.order) return false;
    return this.stepIndex(status) <= this.stepIndex(this.order.status);
  }

  /** Demo-only: since there is no backend pushing real-time updates, this simulates progress. */
  simulateNextStep(): void {
    if (this.order && this.order.status !== 'Delivered') {
      this.orderService.advanceStatus(this.order.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.order = res.order;
          }
        },
        error: (err) => console.error('Failed to advance status', err)
      });
    }
  }
}
