import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order, OrderStatus, CartItem, OrderResponse, OrderListResponse } from '../models/order.model';
import { environment } from '../../environments/environment';

const STATUS_SEQUENCE: OrderStatus[] = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  placeOrder(userId: string, cartItems: CartItem[], address: string, paymentMethod: Order['paymentMethod']): Observable<OrderResponse> {
    const payload = {
      items: cartItems.map(ci => ({
        productId: ci.product.id,
        name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        unit: ci.product.unit,
      })),
      address,
      paymentMethod
    };
    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, payload).pipe(
      map(res => {
        if (res.order) {
          res.order.id = (res.order as any).orderId || res.order.id;
        }
        return res;
      })
    );
  }

  getAllOrders(): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(`${environment.apiUrl}/orders`).pipe(
      map(res => {
        if (res.orders) {
          res.orders = res.orders.map(o => ({ ...o, id: (o as any).orderId || o.id }));
        }
        return res;
      })
    );
  }

  getById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${orderId}`).pipe(
      map(res => {
        if (res.order) {
          res.order.id = (res.order as any).orderId || res.order.id;
        }
        return res;
      })
    );
  }

  /** Advances an order to the next status in the sequence (demo/simulation of real-time tracking). */
  advanceStatus(orderId: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${environment.apiUrl}/orders/${orderId}/advance`, {}).pipe(
      map(res => {
        if (res.order) {
          res.order.id = (res.order as any).orderId || res.order.id;
        }
        return res;
      })
    );
  }

  getStatusSequence(): OrderStatus[] {
    return STATUS_SEQUENCE;
  }
}
