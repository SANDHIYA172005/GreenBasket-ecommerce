import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductCategory, ProductListResponse, ProductSingleResponse, CategoryListResponse } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  /** GET /api/products - Fetches all products with optional filters */
  search(query: string, category?: ProductCategory | 'All', maxPrice?: number, organicOnly?: boolean, onSaleOnly?: boolean): Observable<ProductListResponse> {
    let params = new HttpParams();
    
    if (query) params = params.set('q', query);
    if (category && category !== 'All') params = params.set('category', category);
    if (maxPrice) params = params.set('maxPrice', maxPrice);
    if (organicOnly) params = params.set('organic', 'true');
    if (onSaleOnly) params = params.set('onSale', 'true');

    return this.http.get<ProductListResponse>(`${environment.apiUrl}/products`, { params }).pipe(
      map(res => {
        if (res.products) {
          res.products = res.products.map(p => ({ ...p, id: p._id || p.id }));
        }
        return res;
      })
    );
  }

  /** GET /api/products/categories */
  getCategories(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(`${environment.apiUrl}/products/categories`);
  }

  /** GET /api/products/:id */
  getById(id: string): Observable<ProductSingleResponse> {
    return this.http.get<ProductSingleResponse>(`${environment.apiUrl}/products/${id}`);
  }

  /** GET /api/products/featured */
  getFeatured(limit = 4): Observable<ProductListResponse> {
    let params = new HttpParams().set('limit', limit);
    return this.http.get<ProductListResponse>(`${environment.apiUrl}/products/featured`, { params }).pipe(
      map(res => {
        if (res.products) {
          res.products = res.products.map(p => ({ ...p, id: p._id || p.id }));
        }
        return res;
      })
    );
  }

  /** GET /api/products/bestsellers */
  getBestSellers(limit = 4): Observable<ProductListResponse> {
    let params = new HttpParams().set('limit', limit);
    return this.http.get<ProductListResponse>(`${environment.apiUrl}/products/bestsellers`, { params }).pipe(
      map(res => {
        if (res.products) {
          res.products = res.products.map(p => ({ ...p, id: p._id || p.id }));
        }
        return res;
      })
    );
  }
}
