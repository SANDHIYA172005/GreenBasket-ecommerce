import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  submit(): void {
    this.errorMessage = '';
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Subscribe to the Observable returned by auth.register()
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('Account created successfully!', 'success');
          this.router.navigate(['/products']);
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
