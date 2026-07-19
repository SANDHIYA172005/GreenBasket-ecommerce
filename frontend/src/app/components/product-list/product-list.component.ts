import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductCategory } from '../../models/product.model';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories: ProductCategory[] = [];
  products: Product[] = [];

  searchQuery = '';
  selectedCategory: ProductCategory | 'All' = 'All';
  maxPrice = 500;
  organicOnly = false;
  onSaleOnly = false;

  addedFeedback: Record<string, boolean> = {};
  isLoading = true;

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (res) => { if (res.success) this.categories = res.categories; },
      error: (err) => console.error('Error fetching categories', err)
    });

    this.route.queryParamMap.subscribe(params => {
      const cat = params.get('category') as ProductCategory | null;
      this.selectedCategory = cat ?? 'All';
      this.onSaleOnly = params.get('onSale') === 'true';
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.isLoading = true;
    this.productService.search(
      this.searchQuery,
      this.selectedCategory,
      this.maxPrice,
      this.organicOnly,
      this.onSaleOnly
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.products;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching products', err);
        this.isLoading = false;
      }
    });
  }

  setCategory(category: ProductCategory | 'All'): void {
    this.selectedCategory = category;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: category === 'All' ? {} : { category },
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.maxPrice = 500;
    this.organicOnly = false;
    this.onSaleOnly = false;
    this.setCategory('All');
  }

  addToCart(product: Product): void {
    this.cartService.add(product, 1);
    this.addedFeedback[product.id] = true;
    this.toastService.show(`${product.name} added to cart`, 'success');
    setTimeout(() => (this.addedFeedback[product.id] = false), 1200);
  }

  /** If the hotlinked photo fails to load, fall back to a neutral placeholder instead of a broken icon. */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent infinite loop if the fallback also fails
    img.src =
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#f1f5f9"/><text x="50%" y="50%" font-size="60" text-anchor="middle" dominant-baseline="middle">🛒</text></svg>`
      );
  }
}
