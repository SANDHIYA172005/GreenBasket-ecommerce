import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);

  menuOpen = false;      // mobile hamburger menu
  profileOpen = false;   // right-side profile dropdown

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
  }

  logout(): void {
    this.auth.logout();
    this.profileOpen = false;
    this.menuOpen = false;
    this.router.navigate(['/']);
  }

  /** Close the profile dropdown when clicking anywhere outside it. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      this.profileOpen = false;
    }
  }
}
