import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent),
    canActivate: [authGuard],
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./components/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
