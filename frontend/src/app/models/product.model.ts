export type ProductCategory = 'Fruits' | 'Vegetables' | 'Dairy' | 'Grains';

export interface Product {
  id: string;
  _id?: string;         // MongoDB's internal ID
  name: string;
  category: ProductCategory;
  price: number;      // current selling price
  oldPrice?: number;   // original price before discount (undefined = no discount)
  unit: string;        // e.g. 'kg', 'dozen', 'litre', 'pack'
  image: string;       // image URL
  description: string;
  organic: boolean;
  rating: number;      // 0-5
  reviewCount?: number;
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
}

/** Returns the discount percentage for a product, or 0 if it has no oldPrice. */
export function getDiscountPercent(product: Product): number {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export interface ProductListResponse {
  success: boolean;
  count?: number;
  products: Product[];
}

export interface ProductSingleResponse {
  success: boolean;
  product: Product;
}

export interface CategoryListResponse {
  success: boolean;
  categories: ProductCategory[];
}

