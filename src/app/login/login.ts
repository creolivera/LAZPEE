import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  isLoginMode = true; // Toggles between Login and Signup forms
  
  authData = { email: '', password: '', role: 'customer' };
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    const url = this.isLoginMode 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/signup';

    // 🚨 THE FIX: If logging in, ONLY send email and password. 
    // If signing up, send the full authData (which includes the role).
    const payload = this.isLoginMode 
      ? { email: this.authData.email, password: this.authData.password } 
      : this.authData;

    console.log('Attempting auth request to:', url, payload);

    this.http.post<any>(url, payload).subscribe({
      next: (response) => {
        if (this.isLoginMode) {
          // SAVE TO LOCAL STORAGE
          localStorage.setItem('token', response.token); 
          localStorage.setItem('email', response.email);
          localStorage.setItem('role', response.role);
          
          alert('Login successful!');
          // Redirect to home and refresh to update the navigation bar
          this.router.navigate(['/']).then(() => window.location.reload());
        } else {
          alert('Signup successful! You can now log in.');
          this.toggleMode(); // Switch to login form
        }
      },
      error: (err) => {
        console.error('Auth system caught an error:', err);
        
        this.errorMessage = err.error?.error || err.message || 'Cannot connect to backend server. Is it running?';
      }
    });
  }
}