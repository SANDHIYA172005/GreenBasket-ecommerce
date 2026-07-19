import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private http = inject(HttpClient);

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    subject: 'general',
    message: ''
  };
  
  isSubmitted = false;
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.formData.firstName || !this.formData.email || !this.formData.message) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<{success: boolean, message: string}>(`${environment.apiUrl}/contact`, this.formData)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.isSubmitted = true;
          } else {
            this.errorMessage = res.message || 'Something went wrong.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred while submitting your message.';
          console.error('Contact error:', err);
        }
      });
  }
}
