import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  email = '';
  password = '';
  errorMessage = '';

  submit(): void {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    // Subscribe to the Observable returned by auth.login()
    this.auth.login(this.email, this.password).subscribe({
      // Success: API returned a response (could be success or failure)
      next: (res) => {
        if (res.success) {
          this.toastService.show('Login successful! Welcome back.', 'success');
          this.router.navigate(['/products']);
        } else {
          this.errorMessage = res.message;
        }
      },
      // Error: HTTP error (network failure, 401, 500, etc.)
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
