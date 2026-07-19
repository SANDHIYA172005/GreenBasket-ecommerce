import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  placedAt: string;       // ISO date string
  address: string;
  paymentMethod: 'COD' | 'Card' | 'UPI';
  statusHistory: { status: OrderStatus; timestamp: string }[];
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  order: Order;
}

export interface OrderListResponse {
  success: boolean;
  count: number;
  orders: Order[];
}
