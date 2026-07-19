import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/order.model';

const CART_KEY = 'ogs_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSignal = signal<CartItem[]>(this.loadCart());

  readonly items = this.itemsSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  );

  private loadCart(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.itemsSignal()));
  }

  add(product: Product, quantity: number = 1): void {
    const current = [...this.itemsSignal()];
    const existing = current.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({ product, quantity });
    }
    this.itemsSignal.set(current);
    this.persist();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    const current = this.itemsSignal().map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    this.itemsSignal.set(current);
    this.persist();
  }

  remove(productId: string): void {
    this.itemsSignal.set(this.itemsSignal().filter(i => i.product.id !== productId));
    this.persist();
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.persist();
  }
}
