import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    const loginData = { email: this.email, password: this.password };

    this.http.post('http://localhost:5000/api/auth/login', loginData).subscribe({
      next: (res: any) => {
        // Save the token and email to the browser so the user stays logged in
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.email);
        
        alert('Login successful! Welcome back.');
        this.router.navigate(['/']); // Redirect to the Home page
      },
      error: (err) => {
        console.error(err);
        alert('Invalid email or password. Please try again.');
      }
    });
  }
}