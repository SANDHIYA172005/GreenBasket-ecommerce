import { Component, inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../shared/product-card/product-card.component';

interface WhyChooseItem {
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
  image?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private el = inject(ElementRef);
  private observer!: IntersectionObserver;

  categories = [
    { name: 'Fruits', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=160&h=160&fit=crop', blurb: 'Hand-picked seasonal fruit' },
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=160&h=160&fit=crop', blurb: 'Farm-fresh daily harvests' },
    { name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=160&h=160&fit=crop', blurb: 'From grass-fed, happy cows' },
    { name: 'Grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=160&h=160&fit=crop', blurb: 'Wholesome pantry staples' },
  ];

  featuredProducts: Product[] = [];
  bestSellerProducts: Product[] = [];

  ngOnInit(): void {
    this.productService.getFeatured(4).subscribe({
      next: (res) => { if (res.success) this.featuredProducts = res.products; },
      error: (err) => console.error('Error fetching featured products', err)
    });

    this.productService.getBestSellers(4).subscribe({
      next: (res) => { if (res.success) this.bestSellerProducts = res.products; },
      error: (err) => console.error('Error fetching bestsellers', err)
    });
  }

  whyChooseUs: WhyChooseItem[] = [
    { title: '100% Organic', description: 'Every product is certified organic, grown without synthetic pesticides.' },
    { title: 'Farm Fresh', description: 'Sourced directly from local farms within days of harvest.' },
    { title: 'Secure Payment', description: 'Your card and UPI details are encrypted and never stored.' },
    { title: 'Fast Delivery', description: 'Same-day delivery on orders placed before 4 PM.' },
    { title: '24x7 Support', description: 'Real humans ready to help, any day, any time.' },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Ananya R.',
      location: 'Chennai',
      quote: 'The mangoes taste like the ones from my grandmother\u2019s farm. Delivery was quick and packaging was spotless.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      name: 'Karthik S.',
      location: 'Bengaluru',
      quote: 'Switched our whole household\u2019s groceries to GreenBasket. Quality is consistently better than the supermarket.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      name: 'Priya M.',
      location: 'Coimbatore',
      quote: 'Love that everything is clearly labelled organic or not. Prices are fair for the quality you get.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    },
  ];

  newsletterEmail = '';
  newsletterSubmitted = false;

  subscribeNewsletter(): void {
    if (!this.newsletterEmail.trim()) return;
    // No backend in this stack yet — this simply confirms the sign-up in the UI.
    this.newsletterSubmitted = true;
    this.newsletterEmail = '';
    setTimeout(() => (this.newsletterSubmitted = false), 4000);
  }

  addToCart(product: Product): void {
    this.cartService.add(product, 1);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = this.el.nativeElement.querySelectorAll('.fade-in-up');
    targets.forEach((el: Element) => this.observer.observe(el));
  }
}
